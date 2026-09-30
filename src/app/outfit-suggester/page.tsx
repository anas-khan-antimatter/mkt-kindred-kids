"use client";

import { useState, useCallback } from "react";
import { Sparkles, ArrowRight, RotateCcw, Wand2, Loader2, ThumbsUp, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Outfit = {
  name: string;
  pieces: string[];
  vibe: string;
  emoji: string;
};

const moodOptions = [
  { value: "adventurous", label: "Wild & Adventurous", emoji: "🌲" },
  { value: "cozy", label: "Cozy & Snuggly", emoji: "🧸" },
  { value: "party", label: "Party Ready", emoji: "🎉" },
  { value: "dreamy", label: "Dreamy & Magic", emoji: "⭐" },
  { value: "nautical", label: "Nautical & Classic", emoji: "⚓" },
  { value: "playful", label: "Playful & Bright", emoji: "🌈" },
];

const weatherOptions = [
  { value: "sunny", label: "Sunny & Warm", emoji: "☀️" },
  { value: "chilly", label: "Cool & Chilly", emoji: "❄️" },
  { value: "rainy", label: "Rainy & Wet", emoji: "🌧️" },
  { value: "spring", label: "Spring Fresh", emoji: "🌸" },
  { value: "any", label: "Any Weather", emoji: "🌍" },
];

function OutfitCard({ outfit, delay }: { outfit: Outfit; delay: number }) {
  const [saved, setSaved] = useState(false);

  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-4 opacity-0 animation-fill-forwards"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Card className="overflow-hidden border-0 bg-pastel-card shadow-soft transition-all hover:shadow-md group">
        <div className="bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/5 p-5 text-center">
          <span className="text-5xl block mb-2 select-none">{outfit.emoji}</span>
          <h3 className="text-lg font-bold tracking-tight">{outfit.name}</h3>
          <p className="text-xs text-muted-foreground mt-1 italic">{outfit.vibe}</p>
        </div>
        <CardContent className="p-4">
          <ul className="space-y-2">
            {outfit.pieces.map((piece, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                  {i + 1}
                </span>
                <span>{piece}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs rounded-full"
              onClick={() => setSaved(!saved)}
            >
              {saved ? (
                <>
                  <Heart className="mr-1 h-3 w-3 fill-primary text-primary" />
                  Saved!
                </>
              ) : (
                <>
                  <ThumbsUp className="mr-1 h-3 w-3" />
                  Love This
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OutfitSuggesterPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedWeather, setSelectedWeather] = useState<string | null>(null);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [source, setSource] = useState<"ai" | "deterministic" | null>(null);

  const generateOutfits = useCallback(async () => {
    if (!selectedMood) return;
    setLoading(true);
    setHasGenerated(true);

    try {
      const res = await fetch("/api/outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: {
            mood: selectedMood,
            weather: selectedWeather || "any",
            personality: selectedMood,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSource(data.source);
        // We get one outfit from the API — show it plus generate a few more
        const primary = data.outfit as Outfit;
        // Fetch a few more by calling GET
        const allRes = await fetch("/api/outfit", { method: "GET" });
        if (allRes.ok) {
          const allData = await allRes.json();
          const allOutfits = allData.outfits as Outfit[];
          // Move the primary to the front, deduplicate
          const filtered = allOutfits.filter((o) => o.name !== primary.name);
          setOutfits([primary, ...filtered].slice(0, 4));
        } else {
          setOutfits([primary]);
        }
      }
    } catch {
      // Fallback — use GET to load all deterministic
      const allRes = await fetch("/api/outfit", { method: "GET" });
      if (allRes.ok) {
        const allData = await allRes.json();
        setOutfits(allData.outfits.slice(0, 4));
        setSource("deterministic");
      }
    }
    setLoading(false);
  }, [selectedMood, selectedWeather]);

  const reset = () => {
    setSelectedMood(null);
    setSelectedWeather(null);
    setOutfits([]);
    setHasGenerated(false);
    setSource(null);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Badge className="mb-3 bg-accent/20 text-accent-foreground border-0">
            <Sparkles className="mr-1 h-3 w-3" />
            Interactive Tool
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Outfit Suggester</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Tell us the mood and weather — we&apos;ll mix and match the perfect outfit for your little one.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Preferences */}
        <Card className="mb-10 border-2 border-dashed border-primary/20 bg-primary/[0.02] shadow-soft">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Wand2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Pick a Vibe</h2>
                <p className="text-sm text-muted-foreground">Choose a mood and weather to get started</p>
              </div>
            </div>

            {/* Mood */}
            <div className="mb-5">
              <label className="block text-sm font-medium mb-3">What&apos;s the mood? *</label>
              <div className="grid gap-2 sm:grid-cols-3">
                {moodOptions.map((opt) => {
                  const isSelected = selectedMood === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedMood(isSelected ? null : opt.value)}
                      className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all text-left ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30"
                          : "border-border hover:border-muted-foreground/40 hover:bg-accent/30"
                      }`}
                    >
                      <span className="text-xl shrink-0">{opt.emoji}</span>
                      <span className="text-sm font-medium">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weather */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Weather (optional)</label>
              <div className="flex flex-wrap gap-2">
                {weatherOptions.map((opt) => {
                  const isSelected = selectedWeather === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedWeather(isSelected ? null : opt.value)}
                      className={`flex items-center gap-2 rounded-full border px-4 py-2 cursor-pointer transition-all text-sm ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30"
                          : "border-border hover:border-muted-foreground/40 hover:bg-accent/30"
                      }`}
                    >
                      <span>{opt.emoji}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={generateOutfits}
                disabled={!selectedMood || loading}
                className="rounded-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Outfits
                  </>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={reset} className="text-xs">
                <RotateCcw className="mr-1 h-3 w-3" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {hasGenerated && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Your Looks ✨</h2>
                {source && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {source === "ai"
                      ? "Powered by AI — styled just for your little one"
                      : "Curated from our stylist collection"}
                  </p>
                )}
              </div>
              <Badge variant="secondary" className="text-xs">
                {outfits.length} outfits
              </Badge>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  <p className="mt-3 text-sm text-muted-foreground">Mixing the perfect look…</p>
                </div>
              </div>
            ) : outfits.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {outfits.map((outfit, idx) => (
                  <OutfitCard key={outfit.name} outfit={outfit} delay={idx * 100} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  No outfits matched. Try a different mood!
                </p>
              </div>
            )}

            {outfits.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-xs text-muted-foreground mb-3">
                  Like what you see? Head to the collections to shop each piece.
                </p>
                <Button asChild className="rounded-full">
                  <a href="/collections">
                    Shop Collections
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!hasGenerated && (
          <div className="text-center py-16 border border-dashed border-border/50 rounded-2xl">
            <span className="text-6xl block mb-4">✨</span>
            <h3 className="text-xl font-semibold mb-2">Ready for style magic?</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Pick a mood and weather above, then hit &ldquo;Generate Outfits&rdquo; for a coordinated look your little one will love.
            </p>
          </div>
        )}
      </section>

      {/* Inspiration CTA */}
      <section className="bg-accent/10 border-t border-border/30 py-16">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <span className="text-4xl block mb-2">👗</span>
          <h2 className="text-2xl font-bold tracking-tight">See It in Action</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse our Lookbook for real styling inspiration from the Kindred Kids team.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild className="rounded-full">
              <a href="/lookbook">View Lookbook</a>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <a href="/gift-finder">Try Gift Finder</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}