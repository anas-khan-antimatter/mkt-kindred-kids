import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/outfit
 *
 * Suggests a coordinated outfit based on a description or preferences.
 * Calls an AI model when OPENAI_API_KEY is set; otherwise returns a
 * high-quality deterministic fallback so the UI still works.
 */

const FALLBACK_OUTFITS = [
  {
    name: "Meadow Morning",
    pieces: ["Sunshine Smock Dress (Buttercup Yellow)", "Bloom Cardigan (Blush Pink)", "Cloud Joggers (Heather Grey)"],
    vibe: "Bright & breezy — perfect for sunny playdates.",
    emoji: "🌸",
  },
  {
    name: "Wild Explorer",
    pieces: ["Ramble Romper (Sage Green)", "Comet Hoodie (Galaxy Tie-Dye)", "Ocean Stripe Tee (Navy Stripe)"],
    vibe: "Adventure-ready with extra cosiness for tree-climbing days.",
    emoji: "🌲",
  },
  {
    name: "Seaside Stroll",
    pieces: ["Ocean Stripe Tee (Red Stripe)", "Wild Dungarees (Stone Wash)", "Cloud Joggers (Dusty Lavender)"],
    vibe: "Classic nautical tones — comfortable and camera-ready.",
    emoji: "⚓",
  },
  {
    name: "Cozy Storytime",
    pieces: ["Meadow Pinafore (Honeycomb Print)", "Bloom Cardigan (Mint)", "Cloud Joggers (Heather Grey)"],
    vibe: "Snuggle-soft layers for lazy afternoons with a good book.",
    emoji: "🧸",
  },
  {
    name: "Galaxy Dreamer",
    pieces: ["Comet Hoodie (Galaxy Tie-Dye)", "Wild Dungarees (Indigo Wash)", "Ocean Stripe Tee (Navy Stripe)"],
    vibe: "Out-of-this-world style for little stargazers.",
    emoji: "⭐",
  },
  {
    name: "Garden Party",
    pieces: ["Meadow Pinafore (Wildflower Print)", "Bloom Cardigan (Blush Pink)", "Cloud Joggers (Dusty Lavender)"],
    vibe: "Sweet as a spring garden — ideal for celebrations.",
    emoji: "🌷",
  },
];

function getDeterministicOutfit(preferences: Record<string, string>) {
  const mood = (preferences.mood || preferences.personality || "playful").toLowerCase();
  const weather = (preferences.weather || "sunny").toLowerCase();

  // Simple matching logic
  if (mood.includes("adventur") || mood.includes("wild") || weather.includes("rain")) {
    return FALLBACK_OUTFITS[1]; // Wild Explorer
  }
  if (mood.includes("cozy") || mood.includes("snug") || weather.includes("cold") || weather.includes("chilly")) {
    return FALLBACK_OUTFITS[3]; // Cozy Storytime
  }
  if (mood.includes("dream") || mood.includes("star") || mood.includes("magic")) {
    return FALLBACK_OUTFITS[4]; // Galaxy Dreamer
  }
  if (mood.includes("party") || mood.includes("celebrat") || weather.includes("spring")) {
    return FALLBACK_OUTFITS[5]; // Garden Party
  }
  if (mood.includes("nautical") || mood.includes("ocean") || weather.includes("warm") || weather.includes("hot")) {
    return FALLBACK_OUTFITS[2]; // Seaside Stroll
  }
  // Default
  return FALLBACK_OUTFITS[0]; // Meadow Morning
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { preferences = {} } = body;

    // If an AI API key is configured, call the model
    const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;

    if (apiKey) {
      try {
        const model = process.env.OPENAI_API_KEY ? "gpt-4o-mini" : "claude-3-haiku-20240307";
        const apiUrl = process.env.OPENAI_API_KEY
          ? "https://api.openai.com/v1/chat/completions"
          : "https://api.anthropic.com/v1/messages";

        const prompt = `You are a playful children's clothing stylist for Kindred Kids.
Suggest a coordinated outfit based on these preferences: ${JSON.stringify(preferences)}.

Return JSON with: { "name": string, "pieces": string[], "vibe": string, "emoji": string }

Keep it fun, use emoji, and only recommend from this collection of categories:
- Dresses: Sunshine Smock Dress, Meadow Pinafore
- Rompers: Ramble Romper
- Tops: Ocean Stripe Tee
- Bottoms: Wild Dungarees, Cloud Joggers
- Layers: Bloom Cardigan, Comet Hoodie

Choose 2-4 pieces that work together. Include color variants.`;

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.OPENAI_API_KEY
              ? { Authorization: `Bearer ${apiKey}` }
              : { "x-api-key": apiKey, "anthropic-version": "2023-06-01" }),
          },
          body: JSON.stringify(
            process.env.OPENAI_API_KEY
              ? { model, messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } }
              : { model, messages: [{ role: "user", content: prompt }], max_tokens: 500 }
          ),
        });

        if (response.ok) {
          const data = await response.json();
          const content = process.env.OPENAI_API_KEY
            ? data.choices?.[0]?.message?.content
            : data.content?.[0]?.text;

          if (content) {
            const parsed = JSON.parse(content);
            return NextResponse.json({ outfit: parsed, source: "ai" });
          }
        }
        // Fall through to deterministic on API error
      } catch {
        // API call failed — fall through
      }
    }

    // Deterministic fallback
    const outfit = getDeterministicOutfit(preferences);
    return NextResponse.json({ outfit, source: "deterministic" });
  } catch {
    return NextResponse.json(
      { outfit: FALLBACK_OUTFITS[0], source: "deterministic" },
      { status: 200 }
    );
  }
}

/** GET — return all fallback outfits as inspiration */
export async function GET() {
  return NextResponse.json({ outfits: FALLBACK_OUTFITS, source: "deterministic" });
}