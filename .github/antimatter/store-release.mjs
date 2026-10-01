// antimatter-lane v2 — pinned store release (ASC + Play). Typed facts only.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import https from "node:https";
import { spawnSync } from "node:child_process";

const SPEC_DIR = ".antimatter/lanes";
const RESULT_STORE = "store-release-result.json";

function laneFromTag() {
  const ref = process.env.GITHUB_REF || "";
  const m = ref.match(/^refs\/tags\/antimatter-lane\/([^/]+)\/([^/]+)$/);
  if (!m) throw new Error("tag must be antimatter-lane/<lane>/<key>");
  return { lane: m[1], key: m[2] };
}

function loadSpec(lane) {
  const p = path.join(SPEC_DIR, lane + ".json");
  if (!fs.existsSync(p)) throw new Error("missing lane spec " + p);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function exportSecrets(names) {
  const env = {};
  let bag = {};
  try {
    bag = JSON.parse(process.env.AM_LANE_SECRETS || "{}");
  } catch {
    /* ignore */
  }
  for (const n of names || []) {
    if (bag[n] != null) env[n] = String(bag[n]);
    else if (process.env[n] != null) env[n] = process.env[n];
  }
  return env;
}

function httpsJson(method, url, headers, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method,
        headers: {
          Accept: "application/json",
          ...(body
            ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) }
            : {}),
          ...headers,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => {
          if (data.length < 2_000_000) data += c;
        });
        res.on("end", () => {
          let parsed = null;
          try {
            parsed = data ? JSON.parse(data) : null;
          } catch {
            parsed = { raw: data.slice(0, 2000) };
          }
          resolve({ status: res.statusCode || 0, body: parsed });
        });
      },
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

/** ES256 JWT for App Store Connect API. */
function ascToken(keyId, issuerId, p8) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(
    JSON.stringify({ alg: "ES256", kid: keyId, typ: "JWT" }),
  ).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      iss: issuerId,
      iat: now,
      exp: now + 20 * 60,
      aud: "appstoreconnect-v1",
    }),
  ).toString("base64url");
  const data = `${header}.${payload}`;
  const key = p8.replace(/\\n/g, "\n");
  const sig = crypto.sign("sha256", Buffer.from(data), {
    key,
    dsaEncoding: "ieee-p1363",
  });
  return `${data}.${sig.toString("base64url")}`;
}

async function runIos(store, secrets) {
  const keyId = secrets.ASC_KEY_ID;
  const issuerId = secrets.ASC_ISSUER_ID;
  const p8 = secrets.ASC_KEY_P8;
  if (!keyId || !issuerId || !p8) {
    return {
      ok: false,
      error: "missing_store_secrets",
      missing: ["ASC_KEY_ID", "ASC_ISSUER_ID", "ASC_KEY_P8"].filter(
        (n) => !secrets[n],
      ),
    };
  }
  const jwt = ascToken(keyId, issuerId, p8);
  const auth = { Authorization: `Bearer ${jwt}` };
  const action = store.action || "upload";
  const out = {
    platform: "ios",
    action,
    track: store.track || "testflight",
    uploadId: null,
    reviewStatus: null,
    versionCode: store.build_number || null,
    htmlUrl: "https://appstoreconnect.apple.com",
    facts: {},
  };

  if (action === "upload") {
    const artifact = store.artifact;
    if (!artifact || !fs.existsSync(artifact)) {
      return {
        ok: false,
        error: "missing_artifact",
        message: `artifact not found: ${artifact || "(empty)"}`,
      };
    }
    // Prefer Apple transporter / altool when present; record typed facts.
    const abs = path.resolve(artifact);
    const tryCmd = [
      [
        "xcrun",
        [
          "altool",
          "--upload-app",
          "--type",
          "ios",
          "--file",
          abs,
          "--apiKey",
          keyId,
          "--apiIssuer",
          issuerId,
        ],
      ],
    ];
    let uploaded = false;
    let detail = "";
    for (const [bin, args] of tryCmd) {
      const r = spawnSync(bin, args, {
        encoding: "utf8",
        env: { ...process.env, APP_STORE_CONNECT_API_KEY_P8: p8 },
      });
      detail = ((r.stdout || "") + "\n" + (r.stderr || "")).slice(-4000);
      if (r.status === 0) {
        uploaded = true;
        break;
      }
    }
    if (!uploaded) {
      // Fallback: confirm ASC API auth works so the agent gets a typed next step.
      const apps = await httpsJson(
        "GET",
        "https://api.appstoreconnect.apple.com/v1/apps?limit=1",
        auth,
        null,
      );
      if (apps.status >= 200 && apps.status < 300) {
        return {
          ok: false,
          error: "upload_tool_missing",
          message:
            "ASC credentials valid but xcrun altool upload failed. Install Xcode transporter tools or provide a CI image with altool.",
          detail: detail.slice(0, 500),
          facts: out,
        };
      }
      return {
        ok: false,
        error: "asc_auth_failed",
        message: `ASC API ${apps.status}`,
        detail: detail.slice(0, 500),
      };
    }
    out.uploadId = `ipa:${path.basename(abs)}`;
    out.reviewStatus = "processing";
    out.facts.store_upload = { pass: true, detail: out.uploadId };
    return { ok: true, ...out };
  }

  // submit / promote via ASC API (app + version resolution)
  const bundleId = store.bundle_id || "";
  let appId = store.app_id || "";
  if (!appId && bundleId) {
    const q = encodeURIComponent(bundleId);
    const apps = await httpsJson(
      "GET",
      `https://api.appstoreconnect.apple.com/v1/apps?filter[bundleId]=${q}`,
      auth,
      null,
    );
    appId = apps.body?.data?.[0]?.id || "";
  }
  if (!appId) {
    return {
      ok: false,
      error: "bundle_id_required",
      message: "submit/promote needs bundle_id (or app_id) for App Store Connect",
    };
  }
  out.htmlUrl = `https://appstoreconnect.apple.com/apps/${appId}`;

  if (action === "submit") {
    // Create a review submission for the latest ready build when possible.
    const subs = await httpsJson(
      "POST",
      "https://api.appstoreconnect.apple.com/v1/reviewSubmissions",
      auth,
      JSON.stringify({
        data: {
          type: "reviewSubmissions",
          attributes: { platform: "IOS" },
          relationships: {
            app: { data: { type: "apps", id: appId } },
          },
        },
      }),
    );
    const ok = subs.status >= 200 && subs.status < 300;
    out.reviewStatus = ok ? "submitted" : `asc_${subs.status}`;
    out.facts.store_submit = {
      pass: ok,
      detail: ok ? subs.body?.data?.id || "submitted" : JSON.stringify(subs.body).slice(0, 400),
    };
    return { ok, ...out, error: ok ? undefined : "submit_failed" };
  }

  // promote — release an approved version
  const versions = await httpsJson(
    "GET",
    `https://api.appstoreconnect.apple.com/v1/apps/${appId}/appStoreVersions?filter[appStoreState]=PENDING_DEVELOPER_RELEASE,READY_FOR_SALE&limit=5`,
    auth,
    null,
  );
  const verId = versions.body?.data?.[0]?.id;
  if (!verId) {
    return {
      ok: false,
      error: "no_releasable_version",
      message: "No PENDING_DEVELOPER_RELEASE / READY_FOR_SALE version to promote",
      facts: out,
    };
  }
  const rel = await httpsJson(
    "POST",
    "https://api.appstoreconnect.apple.com/v1/appStoreVersionReleaseRequests",
    auth,
    JSON.stringify({
      data: {
        type: "appStoreVersionReleaseRequests",
        relationships: {
          appStoreVersion: {
            data: { type: "appStoreVersions", id: verId },
          },
        },
      },
    }),
  );
  const ok = rel.status >= 200 && rel.status < 300;
  out.reviewStatus = ok ? "released" : `asc_${rel.status}`;
  out.facts.store_promote = {
    pass: ok,
    detail: ok ? verId : JSON.stringify(rel.body).slice(0, 400),
  };
  return { ok, ...out, error: ok ? undefined : "promote_failed" };
}

async function runAndroid(store, secrets) {
  const saRaw = secrets.PLAY_SERVICE_ACCOUNT_JSON;
  if (!saRaw) {
    return {
      ok: false,
      error: "missing_store_secrets",
      missing: ["PLAY_SERVICE_ACCOUNT_JSON"],
    };
  }
  let sa;
  try {
    sa = JSON.parse(saRaw);
  } catch {
    return { ok: false, error: "invalid_play_service_account_json" };
  }
  const action = store.action || "upload";
  const track = store.track || "internal";
  const packageName = store.package_name || "";
  const out = {
    platform: "android",
    action,
    track,
    uploadId: null,
    reviewStatus: null,
    versionCode: store.build_number || null,
    htmlUrl: packageName
      ? `https://play.google.com/console/developers/app/${packageName}`
      : "https://play.google.com/console",
    facts: {},
  };
  if (!packageName) {
    return {
      ok: false,
      error: "package_name_required",
      message: "Android store_release requires package_name",
    };
  }

  // Obtain Google OAuth token via JWT bearer grant (service account).
  const now = Math.floor(Date.now() / 1000);
  const claimHeader = Buffer.from(
    JSON.stringify({ alg: "RS256", typ: "JWT" }),
  ).toString("base64url");
  const claimBody = Buffer.from(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/androidpublisher",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  ).toString("base64url");
  const unsigned = `${claimHeader}.${claimBody}`;
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(unsigned);
  sign.end();
  const assertion = `${unsigned}.${sign.sign(sa.private_key, "base64url")}`;
  const tokenRes = await new Promise((resolve, reject) => {
    const body = new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }).toString();
    const req = https.request(
      {
        hostname: "oauth2.googleapis.com",
        path: "/token",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => {
          data += c;
        });
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            reject(e);
          }
        });
      },
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
  if (!tokenRes.body?.access_token) {
    return {
      ok: false,
      error: "play_auth_failed",
      message: `oauth ${tokenRes.status}`,
    };
  }
  const access = tokenRes.body.access_token;
  const auth = { Authorization: `Bearer ${access}` };
  const base = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(packageName)}`;

  const edit = await httpsJson("POST", `${base}/edits`, auth, JSON.stringify({}));
  if (edit.status >= 300 || !edit.body?.id) {
    return {
      ok: false,
      error: "play_edit_failed",
      message: `edits ${edit.status}`,
    };
  }
  const editId = edit.body.id;

  if (action === "upload") {
    const artifact = store.artifact;
    if (!artifact || !fs.existsSync(artifact)) {
      return {
        ok: false,
        error: "missing_artifact",
        message: `artifact not found: ${artifact || "(empty)"}`,
      };
    }
    // Upload via googleapis resumable is heavy in pure https — use curl-shaped spawn of node fetch stream.
    // For CI: write a small python helper when google-api available; else typed blocked with path.
    const py = `
import json,sys
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
sa=json.loads(sys.argv[1]); pkg=sys.argv[2]; edit=sys.argv[3]; track=sys.argv[4]; path=sys.argv[5]
creds=service_account.Credentials.from_service_account_info(sa, scopes=["https://www.googleapis.com/auth/androidpublisher"])
svc=build("androidpublisher","v3",credentials=creds,cache_discovery=False)
media=MediaFileUpload(path, mimetype="application/octet-stream", resumable=True)
if path.endswith(".aab"):
  bundle=svc.edits().bundles().upload(packageName=pkg, editId=edit, media_body=media).execute()
  vc=bundle.get("versionCode")
else:
  apk=svc.edits().apks().upload(packageName=pkg, editId=edit, media_body=media).execute()
  vc=apk.get("versionCode")
svc.edits().tracks().update(packageName=pkg, editId=edit, track=track, body={"track":track,"releases":[{"versionCodes":[str(vc)],"status":"completed"}]}).execute()
svc.edits().commit(packageName=pkg, editId=edit).execute()
print(json.dumps({"versionCode":vc}))
`;
    const r = spawnSync(
      "python3",
      ["-c", py, saRaw, packageName, editId, track, path.resolve(artifact)],
      { encoding: "utf8", timeout: 600_000 },
    );
    if (r.status !== 0) {
      return {
        ok: false,
        error: "play_upload_failed",
        message: (r.stderr || r.stdout || "python upload failed").slice(0, 800),
        hint: "pip install google-api-python-client google-auth on the runner",
      };
    }
    let parsed = {};
    try {
      parsed = JSON.parse((r.stdout || "").trim().split("\n").pop() || "{}");
    } catch {
      /* ignore */
    }
    out.uploadId = `play:${parsed.versionCode || path.basename(artifact)}`;
    out.versionCode = parsed.versionCode != null ? String(parsed.versionCode) : out.versionCode;
    out.reviewStatus = track;
    out.facts.store_upload = { pass: true, detail: out.uploadId };
    return { ok: true, ...out };
  }

  if (action === "submit") {
    // Mark track as completed / inReview via tracks.patch semantics
    const tr = await httpsJson(
      "GET",
      `${base}/edits/${editId}/tracks/${encodeURIComponent(track)}`,
      auth,
      null,
    );
    const release = (tr.body?.releases || [])[0] || { status: "draft", versionCodes: [] };
    release.status = track === "production" ? "inProgress" : "completed";
    const upd = await httpsJson(
      "PUT",
      `${base}/edits/${editId}/tracks/${encodeURIComponent(track)}`,
      auth,
      JSON.stringify({ track, releases: [release] }),
    );
    await httpsJson("POST", `${base}/edits/${editId}:commit`, auth, JSON.stringify({}));
    const ok = upd.status >= 200 && upd.status < 300;
    out.reviewStatus = ok ? "submitted" : `play_${upd.status}`;
    out.facts.store_submit = { pass: ok, detail: out.reviewStatus };
    return { ok, ...out, error: ok ? undefined : "submit_failed" };
  }

  // promote → production
  const prodTrack = "production";
  const tr = await httpsJson(
    "GET",
    `${base}/edits/${editId}/tracks/${encodeURIComponent(track)}`,
    auth,
    null,
  );
  const codes =
    (tr.body?.releases || []).flatMap((r) => r.versionCodes || []) || [];
  const upd = await httpsJson(
    "PUT",
    `${base}/edits/${editId}/tracks/${encodeURIComponent(prodTrack)}`,
    auth,
    JSON.stringify({
      track: prodTrack,
      releases: [
        {
          versionCodes: codes.length ? codes : undefined,
          status: "completed",
        },
      ],
    }),
  );
  await httpsJson("POST", `${base}/edits/${editId}:commit`, auth, JSON.stringify({}));
  const ok = upd.status >= 200 && upd.status < 300;
  out.reviewStatus = ok ? "released" : `play_${upd.status}`;
  out.track = prodTrack;
  out.facts.store_promote = { pass: ok, detail: out.reviewStatus };
  return { ok, ...out, error: ok ? undefined : "promote_failed" };
}

async function main() {
  const { lane } = laneFromTag();
  const spec = loadSpec(lane);
  const store = spec.store || {};
  const secrets = exportSecrets(spec.secretEnv || []);
  const platform =
    store.platform ||
    (lane.includes("android") ? "android" : "ios");
  let result;
  if (platform === "android") {
    result = await runAndroid(store, secrets);
  } else {
    result = await runIos(store, secrets);
  }
  fs.writeFileSync(RESULT_STORE, JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ ok: result.ok, action: store.action, platform }));
  if (!result.ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
