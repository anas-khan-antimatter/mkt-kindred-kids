// antimatter-lane v2
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import http from "node:http";
import https from "node:https";

const SPEC_DIR = ".antimatter/lanes";
const RESULT = "lane-result.json";

function laneFromTag() {
  const ref = process.env.GITHUB_REF || "";
  const m = ref.match(/^refs\/tags\/antimatter-lane\/([^/]+)\/([^/]+)$/);
  if (!m) throw new Error("tag must be antimatter-lane/<lane>/<key>");
  return { lane: m[1], key: m[2] };
}

function loadSpec(lane) {
  const p = path.join(SPEC_DIR, lane + ".json");
  if (!fs.existsSync(p)) throw new Error("missing lane spec " + p);
  const raw = JSON.parse(fs.readFileSync(p, "utf8"));
  if (raw.schema !== 1) throw new Error("unsupported lane schema");
  return raw;
}

/** TERM for interactive TUI/curses (GHA often has unset/dumb/unknown). */
function laneEnv(extra) {
  const cur = String(process.env.TERM || "").trim();
  const term =
    cur && cur !== "unknown" && cur !== "dumb" ? cur : "xterm-256color";
  return {
    ...process.env,
    TERM: term,
    COLUMNS: process.env.COLUMNS || "120",
    LINES: process.env.LINES || "40",
    ...(extra || {}),
  };
}

function shellSingleQuote(s) {
  return `'${String(s).replace(/'/g, `'\\''`)}'`;
}

/**
 * Linux runners: allocate a PTY so interactive TUI/ncurses can open.
 * stdout of the step becomes a tty; stdin pipelines inside the cmd still work.
 */
function withLinuxPty(cmd) {
  if (process.platform !== "linux") return cmd;
  return `script -qefc ${shellSingleQuote(cmd)} /dev/null`;
}

function sh(cmd, opts = {}) {
  const timeoutSec = opts.timeoutSec || 600;
  const background = !!opts.background;
  return new Promise((resolve) => {
    const start = Date.now();
    const shell = process.platform === "win32" ? "cmd.exe" : "/bin/bash";
    const args = process.platform === "win32" ? ["/c", cmd] : ["-lc", cmd];
    const child = spawn(shell, args, {
      cwd: process.cwd(),
      env: laneEnv(opts.env || {}),
      stdio: ["ignore", "pipe", "pipe"],
      detached: background,
    });
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      try {
        if (background) process.kill(-child.pid, "SIGKILL");
        else child.kill("SIGKILL");
      } catch {
        /* ignore */
      }
    }, timeoutSec * 1000);
    if (background) {
      child.unref();
      clearTimeout(timer);
      resolve({
        exitCode: 0,
        timedOut: false,
        durationMs: Date.now() - start,
        stdout: "",
        stderr: "background",
        background: true,
      });
      return;
    }
    child.stdout.on("data", (d) => {
      if (stdout.length < 8000) stdout += d;
    });
    child.stderr.on("data", (d) => {
      if (stderr.length < 8000) stderr += d;
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({
        exitCode: timedOut ? null : code,
        timedOut,
        durationMs: Date.now() - start,
        stdout,
        stderr,
      });
    });
  });
}

async function httpProbe(url, withinSec) {
  const deadline = Date.now() + withinSec * 1000;
  let last = "no response";
  while (Date.now() < deadline) {
    try {
      const ok = await new Promise((resolve) => {
        const lib = url.startsWith("https") ? https : http;
        const req = lib.get(url, { timeout: 5000 }, (res) => {
          res.resume();
          resolve(res.statusCode >= 200 && res.statusCode < 300);
        });
        req.on("error", (e) => {
          last = e.message;
          resolve(false);
        });
        req.on("timeout", () => {
          req.destroy();
          last = "timeout";
          resolve(false);
        });
      });
      if (ok) return { pass: true, detail: "2xx" };
    } catch (e) {
      last = e.message || String(e);
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  return { pass: false, detail: last };
}

async function runProbe(probe) {
  const kind = probe.kind;
  if (kind === "http") {
    return httpProbe(probe.url, probe.withinSec || 60);
  }
  if (kind === "alive") {
    const frag = String(probe.cmd || probe.match || "").slice(0, 40);
    if (!frag) return { pass: false, detail: "alive needs cmd/match" };
    const r = await sh(
      process.platform === "win32"
        ? `tasklist | findstr /I "${frag.replace(/"/g, "")}"`
        : `pgrep -f ${JSON.stringify(frag)} >/dev/null`,
      { timeoutSec: 30 },
    );
    return {
      pass: r.exitCode === 0,
      detail: r.stderr || r.stdout || `exit ${r.exitCode}`,
    };
  }
  if (kind === "screenshot") {
    fs.mkdirSync("lane-screenshots", { recursive: true });
    const out = path.join("lane-screenshots", `shot-${Date.now()}.png`);
    let cmd;
    if (process.platform === "darwin") {
      cmd = `screencapture -x ${JSON.stringify(out)}`;
    } else if (process.platform === "win32") {
      cmd = `powershell -NoProfile -Command "$b=New-Object System.Drawing.Bitmap(800,600); $b.Save('${out.replace(/\\/g, "/")}')"`;
    } else {
      cmd = `import -window root ${JSON.stringify(out)} 2>/dev/null || echo no-screenshot-tool`;
    }
    const r = await sh(cmd, { timeoutSec: 60 });
    const exists = fs.existsSync(out);
    return {
      pass: exists,
      detail: exists ? out : r.stderr || r.stdout || "no screenshot",
    };
  }
  if (kind === "ios_simulator" || kind === "android_emulator") {
    return {
      pass: false,
      detail:
        kind +
        " requires Xcode/SDK setup steps in lane spec (boot/install/launch)",
    };
  }
  if (
    kind === "store_upload" ||
    kind === "store_submit" ||
    kind === "store_promote"
  ) {
    // Typed facts from pinned store-release.mjs (never HTML/prose classifiers).
    let store = null;
    try {
      store = JSON.parse(fs.readFileSync("store-release-result.json", "utf8"));
    } catch {
      return { pass: false, detail: "store-release-result.json missing" };
    }
    const action = String(store.action || "");
    const needed =
      kind === "store_upload"
        ? "upload"
        : kind === "store_submit"
          ? "submit"
          : "promote";
    if (action !== needed) {
      // Probe not applicable for this action — pass vacuously.
      return { pass: true, detail: `skipped (action=${action || "none"})` };
    }
    const fact = (store.facts || {})[kind];
    if (fact && typeof fact.pass === "boolean") {
      return { pass: fact.pass === true, detail: fact.detail || kind };
    }
    return {
      pass: store.ok === true,
      detail: store.uploadId || store.reviewStatus || store.error || kind,
    };
  }
  return { pass: false, detail: "unknown probe kind " + kind };
}

function exportSecrets(names) {
  const env = {};
  if (!names || !names.length) return env;
  let bag = {};
  try {
    bag = JSON.parse(process.env.AM_LANE_SECRETS || "{}");
  } catch {
    /* ignore */
  }
  for (const n of names) {
    if (bag[n] != null) env[n] = String(bag[n]);
    else if (process.env[n] != null) env[n] = process.env[n];
  }
  return env;
}

async function cmdPlan() {
  const { lane } = laneFromTag();
  const spec = loadSpec(lane);
  const runsOn = spec.runsOn ?? "ubuntu-latest";
  const runsOnJson = JSON.stringify(Array.isArray(runsOn) ? runsOn : [runsOn]);
  const container = spec.container ? JSON.stringify(spec.container) : '""';
  const timeout = String(spec.timeoutMinutes || 30);
  const out = process.env.GITHUB_OUTPUT;
  if (out) {
    fs.appendFileSync(out, `runs_on=${runsOnJson}\n`);
    fs.appendFileSync(out, `container=${container}\n`);
    fs.appendFileSync(out, `timeout=${timeout}\n`);
    fs.appendFileSync(out, `lane=${lane}\n`);
    fs.appendFileSync(
      out,
      `has_container=${spec.container ? "true" : "false"}\n`,
    );
  }
  console.log(
    JSON.stringify({
      lane,
      runsOn,
      container: spec.container || null,
      timeout,
    }),
  );
}

async function cmdRun() {
  const { lane, key } = laneFromTag();
  const spec = loadSpec(lane);
  const secretEnv = exportSecrets(spec.secretEnv || []);
  const steps = [];
  const runList = [];
  for (const c of spec.setup || []) {
    runList.push({ name: "setup", cmd: c, timeoutSec: 600 });
  }
  for (const c of spec.build || []) {
    runList.push({ name: "build", cmd: c, timeoutSec: 900 });
  }
  for (const s of spec.services || []) {
    runList.push({
      name: "service",
      cmd: typeof s === "string" ? s : s.cmd,
      background: typeof s === "object" ? !!s.background : true,
      timeoutSec: 120,
    });
  }
  for (const r of spec.run || []) {
    runList.push({
      name: "run",
      cmd: typeof r === "string" ? r : r.cmd,
      timeoutSec: typeof r === "object" ? r.timeoutSec || 600 : 600,
    });
  }
  for (const step of runList) {
    const rawCmd = String(step.cmd);
    const cmd =
      step.name === "run" && !step.background ? withLinuxPty(rawCmd) : rawCmd;
    const r = await sh(cmd, {
      timeoutSec: step.timeoutSec,
      background: step.background,
      env: secretEnv,
    });
    steps.push({
      name: step.name,
      cmd: rawCmd.slice(0, 200),
      exitCode: r.exitCode,
      timedOut: r.timedOut,
      durationMs: r.durationMs,
      stdoutTail: (r.stdout || "").slice(-2000),
      stderrTail: (r.stderr || "").slice(-2000),
    });
  }
  const probes = [];
  for (const p of spec.probes || []) {
    const pr = await runProbe(p);
    probes.push({ kind: p.kind, pass: pr.pass, detail: pr.detail });
  }
  const result = {
    schema: 1,
    lane,
    key,
    runsOn: spec.runsOn,
    steps,
    probes,
    finishedAt: new Date().toISOString(),
  };
  fs.writeFileSync(RESULT, JSON.stringify(result, null, 2));
  const failed =
    steps.some((s) => s.timedOut || s.exitCode !== 0) ||
    probes.some((p) => !p.pass);
  process.exit(failed ? 1 : 0);
}

const cmd = process.argv[2];
if (cmd === "plan") {
  cmdPlan().catch((e) => {
    console.error(e);
    process.exit(1);
  });
} else if (cmd === "run") {
  cmdRun().catch((e) => {
    console.error(e);
    process.exit(1);
  });
} else {
  console.error("usage: lane-runner.mjs plan|run");
  process.exit(2);
}
