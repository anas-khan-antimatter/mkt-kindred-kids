import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/size
 *
 * Recommends a size based on height (inches) and weight (lbs).
 * No API key needed — this runs deterministically on the server.
 */

interface SizeRow {
  size: string;
  height: string;
  weight: string;
  chest: string;
  waist: string;
}

const infants: SizeRow[] = [
  { size: "0-3M", height: 'Up to 24"', weight: "Up to 14 lbs", chest: '16"', waist: '15"' },
  { size: "3-6M", height: '24-27"', weight: "14-18 lbs", chest: '17"', waist: '16"' },
  { size: "6-12M", height: '27-30"', weight: "18-24 lbs", chest: '18"', waist: '17"' },
  { size: "12-18M", height: '30-33"', weight: "24-28 lbs", chest: '19"', waist: '18"' },
  { size: "18-24M", height: '33-35"', weight: "28-30 lbs", chest: '20"', waist: '19"' },
];

const kids: SizeRow[] = [
  { size: "2T", height: '35-37"', weight: "30-32 lbs", chest: '21"', waist: '20"' },
  { size: "3T", height: '37-39"', weight: "32-35 lbs", chest: '22"', waist: '20.5"' },
  { size: "4T", height: '39-41"', weight: "35-39 lbs", chest: '23"', waist: '21"' },
  { size: "5", height: '41-44"', weight: "39-45 lbs", chest: '24"', waist: '22"' },
  { size: "6", height: '44-47"', weight: "45-50 lbs", chest: '25"', waist: '22.5"' },
  { size: "7", height: '47-50"', weight: "50-57 lbs", chest: '26"', waist: '23"' },
  { size: "8", height: '50-53"', weight: "57-65 lbs", chest: '27"', waist: '24"' },
];

function parseRange(range: string): { low: number; high: number } {
  const cleaned = range.replace(/[^0-9\-\s]/g, "").trim();
  if (cleaned.includes("-")) {
    const parts = cleaned.split("-");
    const low = parseFloat(parts[0]) || 0;
    const high = parseFloat(parts[1]) || low + 10;
    return { low, high };
  }
  if (cleaned.startsWith("Up to")) {
    const num = parseFloat(cleaned.replace("Up to", "").trim()) || 0;
    return { low: 0, high: num };
  }
  const num = parseFloat(cleaned) || 0;
  return { low: num * 0.9, high: num * 1.1 };
}

function recommendSize(heightIn: number, weightLbs: number): {
  size: string;
  group: "infants" | "kids";
  details: SizeRow;
} {
  const all = [...infants.map((r) => ({ ...r, group: "infants" as const })), ...kids.map((r) => ({ ...r, group: "kids" as const }))];

  let best = all[0];
  let bestScore = Infinity;

  for (const row of all) {
    const hRange = parseRange(row.height);
    const wRange = parseRange(row.weight);

    const hMid = (hRange.low + hRange.high) / 2;
    const wMid = (wRange.low + wRange.high) / 2;
    const hSpan = hRange.high - hRange.low || 1;
    const wSpan = wRange.high - wRange.low || 1;

    const normH = (heightIn - hMid) / hSpan;
    const normW = (weightLbs - wMid) / wSpan;

    const inRange = heightIn >= hRange.low && heightIn <= hRange.high && weightLbs >= wRange.low && weightLbs <= wRange.high;

    let score = Math.abs(normH) + Math.abs(normW);
    if (inRange) score *= 0.4; // heavily weight "in range"
    if (heightIn >= hRange.low && heightIn <= hRange.high) score *= 0.7;
    if (weightLbs >= wRange.low && weightLbs <= wRange.high) score *= 0.7;

    if (score < bestScore) {
      bestScore = score;
      best = row;
    }
  }

  return {
    size: best.size,
    group: best.group,
    details: { size: best.size, height: best.height, weight: best.weight, chest: best.chest, waist: best.waist },
  };
}

export async function GET() {
  return NextResponse.json({
    description: "POST /api/size with { height, weight } to get a size recommendation",
    fields: {
      height: "number (inches, required)",
      weight: "number (lbs, required)",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { height, weight } = body;

    if (typeof height !== "number" || typeof weight !== "number" || height <= 0 || weight <= 0) {
      return NextResponse.json(
        { error: "Provide valid height (inches) and weight (lbs) as positive numbers." },
        { status: 400 }
      );
    }

    const result = recommendSize(height, weight);
    return NextResponse.json({ ...result });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}