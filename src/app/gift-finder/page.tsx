"use client";

import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, ArrowLeft, RotateCcw, ShoppingBag, Check, Heart, Star, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";
import { products } from "@/lib/data";

const questions = [
  {
    id: "age",
    question: "How old is the little one?",
    options: [
      { value: "infant", label: "0–12 months", emoji: "👶" },
      { value: "toddler", label: "1–3 years", emoji: "🧒" },
      { value: "preschool", label: "3–5 years", emoji: "👦" },
      { value: "school", label: "5–8 years", emoji: "👧" },
    ],
  },
  {
    id: "personality",
    question: "What describes their personality best?",
    options: [
      { value: "adventurous", label: "Wild & Adventurous", emoji: "🌲" },
      { value: "creative", label: "Creative & Artistic", emoji: "🎨" },
      { value: "gentle", label: "Gentle & Cuddly", emoji: "🧸" },
      { value: "silly", label: "Silly & Playful", emoji: "🤪" },
    ],
  },
  {
    id: "occasion",
    question: "What's the occasion?",
    options: [
      { value: "everyday", label: "Everyday Play", emoji: "🏃" },
      { value: "party", label: "Birthday Party", emoji: "🎉" },
      { value: "photo", label: "Photo-worthy", emoji: "📸" },
      { value: "seasonal", label: "Seasonal Special", emoji: "🌸" },
    ],
  },
  {
    id: "style",
    question: "Pick a favorite style vibe:",
    options: [
      { value: "boho", label: "Boho & Earthy", emoji: "🌻" },
      { value: "nautical", label: "Nautical & Classic", emoji: "⚓" },
      { value: "colorful", label: "Bright & Colorful", emoji: "🌈" },
      { value: "cozy", label: "Cozy & Comfy", emoji: "☁️" },
    ],
  },
];

const categoryMeta: Record<string, { emoji: string }> = {
  dresses: { emoji: "👗" },
  rompers: { emoji: "🦺" },
  tops: { emoji: "👕" },
  bottoms: { emoji: "👖" },
  layers: { emoji: "🧥" },
};

const personalityResultTitles: Record<string, string> = {
  adventurous: "For the Little Explorer",
  creative: "For the Mini Maker",
  gentle: "For the Cozy Cuddler",
  silly: "For the Joyful Jester",
};

/* ── Wishlist helpers ── */
function getWishlist(): string[] {
  try { return JSON.parse(localStorage.getItem("kindred-wishlist") || "[]"); }
  catch { return []; }
}
function toggleWishlistId(id: string): string[] {
  const current = getWishlist();
  const idx = current.indexOf(id);
  if (idx >= 0) current.splice(idx, 1);
  else current.push(id);
  localStorage.setItem("kindred-wishlist", JSON.stringify(current));
  return [...current];
}

type Answers = Record<string, string>;

function ResultCard({ product, delay }: { product: typeof products[0]; delay: number }) {
  const [added, setAdded] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    setInWishlist(getWishlist().includes(product.id));
  }, [product.id]);

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, size: product.sizes[0], color: product.colors[0].name, image: product.image, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const toggleWish = () => {
    const updated = toggleWishlistId(product.id);
    setInWishlist(updated.includes(product.id));
  };

  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-4 duration-400 fill-mode-backwards"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Card className="overflow-hidden border-0 bg-card-soft shadow-soft transition-all hover:shadow-bouncy hover:-translate-y-0.5 group">
        <div className="aspect-square w-full bg-editorial flex items-center justify-center relative">
          <span className="text-6xl opacity-40 select-none transition-transform duration-500 group-hover:scale-125">
            {categoryMeta[product.category]?.emoji || "🧵"}
          </span>
          {/* Wishlist heart */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleWish(); }}
            className="absolute top-2.5 left-2.5 h-7 w-7 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm transition-all hover:scale-110 active:scale-90"
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-3.5 w-3.5 ${inWishlist ? "fill-primary text-primary" : "text-muted-foreground"}`} />
          </button>
          <Badge className="absolute top-2.5 right-2.5 text-[10px] bg-white/80 text-foreground border-0 backdrop-blur-sm shadow-sm">
            ${product.price}
          </Badge>
        </div>
        <CardContent className="p-3.5">
          <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{product.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{product.material}</p>
          <div className="mt-1.5 flex gap-1">
            {product.colors.map((color) => (
              <span key={color.name} className="inline-block h-2.5 w-2.5 rounded-full border border-border/50" style={{ backgroundColor: color.hex }} />
            ))}
          </div>
          <Button
            size="sm"
            className={`w-full mt-2.5 text-xs rounded-full transition-all ${added ? "bg-green-600 hover:bg-green-700" : ""}`}
            onClick={handleAdd}
          >
            {added ? <><Check className="mr-1 h-3 w-3" /> Added!</> : <><ShoppingBag className="mr-1 h-3 w-3" /> Add to Bag</>}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function GiftFinderPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<{ title: string; picks: typeof products } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const { addItem } = useCart();

  const handleAnswer = (value: string) => {
    const updated = { ...answers, [questions[step].id]: value };
    setAnswers(updated);

    if (step < questions.length - 1) {
      setAnimKey((k) => k + 1);
      setStep(step + 1);
    } else {
      generateResult(updated);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setAnimKey((k) => k + 1);
      setStep(step - 1);
    }
  };

  const generateResult = (answers: Answers) => {
    type Scored = { product: typeof products[0]; score: number };
    const scored: Scored[] = products.map((p) => {
      let score = 0;

      if (answers.age === "infant") {
        if (p.sizes.includes("2T") || p.sizes.includes("3T")) score += 30;
        if (p.ageRange.includes("toddler")) score += 10;
      } else if (answers.age === "toddler") {
        if (p.ageRange.includes("toddler")) score += 30;
        if (p.sizes.includes("2T") || p.sizes.includes("3T") || p.sizes.includes("4T")) score += 10;
      } else if (answers.age === "preschool") {
        if (p.ageRange.includes("preschool")) score += 30;
        if (p.sizes.includes("4T") || p.sizes.includes("5") || p.sizes.includes("6")) score += 10;
      } else if (answers.age === "school") {
        if (p.ageRange.includes("school")) score += 30;
        if (p.sizes.includes("6") || p.sizes.includes("7") || p.sizes.includes("8")) score += 10;
      }

      if (answers.personality === "adventurous") {
        if (p.category === "bottoms" || p.category === "rompers") score += 20;
      } else if (answers.personality === "creative") {
        if (p.colors.length > 1) score += 20;
        if (p.name.toLowerCase().includes("bloom") || p.name.toLowerCase().includes("art")) score += 15;
      } else if (answers.personality === "gentle") {
        if (p.material.toLowerCase().includes("cotton") || p.material.toLowerCase().includes("knit")) score += 20;
        if (p.name.toLowerCase().includes("cloud") || p.name.toLowerCase().includes("bloom")) score += 15;
      } else if (answers.personality === "silly") {
        if (p.colors.some((c) => c.hex === "#f5d742" || c.hex === "#C23B22")) score += 15;
        if (p.category === "tops" || p.category === "rompers") score += 15;
      }

      if (answers.occasion === "everyday") {
        if (p.price && p.price <= 40) score += 20;
        if (p.category === "bottoms" || p.category === "tops") score += 10;
      } else if (answers.occasion === "party") {
        if (p.category === "dresses") score += 25;
        if (p.name.toLowerCase().includes("dress") || p.name.toLowerCase().includes("bloom")) score += 15;
      } else if (answers.occasion === "photo") {
        if (p.colors.length >= 2) score += 20;
        if (p.details.length >= 3) score += 10;
      } else if (answers.occasion === "seasonal") {
        if (p.season.length >= 2) score += 20;
      }

      if (answers.style === "boho") {
        if (p.material.toLowerCase().includes("linen")) score += 25;
        if (p.name.toLowerCase().includes("ramble") || p.name.toLowerCase().includes("bloom")) score += 15;
      } else if (answers.style === "nautical") {
        if (p.colors.some((c) => c.hex === "#1B2A4A" || c.hex === "#87CEEB")) score += 25;
      } else if (answers.style === "colorful") {
        if (p.colors.length >= 2) score += 20;
        score += p.colors.length * 5;
      } else if (answers.style === "cozy") {
        if (p.category === "layers" || p.category === "bottoms") score += 25;
        if (p.name.toLowerCase().includes("cloud") || p.name.toLowerCase().includes("jogger")) score += 15;
      }

      return { product: p, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const picks = scored.slice(0, 4).map((s) => s.product);
    const personalityTitle = personalityResultTitles[answers.personality] || "Perfect Picks for You";
    setResult({ title: personalityTitle, picks });
    setShowResult(true);
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
    setShowResult(false);
    setAnimKey((k) => k + 1);
  };

  const progress = ((step) / questions.length) * 100;

  return (
    <div>
      {/* Hero */}
      <section className="bg-denim-wash px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Badge className="mb-3 bg-white/15 text-white border-0 backdrop-blur-sm">
            <Gift className="mr-1 h-3 w-3" />
            Gift Finder
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Find the Perfect Gift</h1>
          <p className="mt-3 text-white/70 max-w-xl">
            Answer 4 quick questions and we&apos;ll match your little one with pieces they&apos;ll love.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {!showResult ? (
          <>
            {/* ── Progress bar ── */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Question {step + 1} of {questions.length}
                </span>
                <span className="text-xs text-muted-foreground">{Math.round(progress)}% complete</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {/* Step dots */}
              <div className="flex justify-between mt-2">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      i <= step ? "bg-primary scale-110" : "bg-muted-foreground/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* ── Question card ── */}
            <Card className="border-0 bg-card-soft shadow-soft mb-6">
              <CardContent className="p-6 sm:p-8">
                <div key={animKey} className="animate-in fade-in slide-in-from-right-4 duration-300 fill-mode-backwards">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">{["👶", "🎨", "🎉", "🌈"][step]}</span>
                    <h2 className="text-xl font-bold sm:text-2xl">{questions[step].question}</h2>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {questions[step].options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(option.value)}
                        className="group flex items-center gap-4 rounded-xl border-2 border-border/30 p-4 text-left transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-soft active:scale-[0.98] cursor-pointer"
                      >
                        <span className="text-3xl transition-transform group-hover:scale-110">{option.emoji}</span>
                        <span className="font-medium text-sm">{option.label}</span>
                        <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ── Back / Restart controls ── */}
            <div className="flex items-center justify-between">
              {step > 0 ? (
                <Button variant="ghost" size="sm" onClick={handleBack} className="text-xs rounded-full">
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Back
                </Button>
              ) : (
                <div />
              )}
              <Button variant="ghost" size="sm" onClick={resetQuiz} className="text-xs text-muted-foreground rounded-full">
                <RotateCcw className="mr-1 h-3 w-3" />
                Start Over
              </Button>
            </div>
          </>
        ) : (
          /* ── RESULTS ── */
          <div>
            {/* Result hero */}
            <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-400">
              <span className="text-5xl block mb-3">🎉</span>
              <Badge className="badge-pill mb-2 bg-primary/10 text-primary border-0">
                <Sparkles className="mr-1 h-3 w-3" />
                Your Results
              </Badge>
              <h2 className="text-2xl font-bold sm:text-3xl">{result?.title || "Our Picks for You"}</h2>
              <p className="mt-2 text-muted-foreground text-sm max-w-sm mx-auto">
                Based on your answers, here are the pieces we think they&apos;ll love most.
              </p>
            </div>

            {/* Answers recap */}
            <div className="mb-8 flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-400 fill-mode-backwards" style={{ animationDelay: "100ms" }}>
              {Object.entries(answers).map(([key, val]) => {
                const q = questions.find((q) => q.id === key);
                const opt = q?.options.find((o) => o.value === val);
                return (
                  <span key={key} className="inline-flex items-center gap-1 rounded-full bg-card-soft border border-border/30 px-3 py-1 text-xs">
                    <span>{opt?.emoji}</span>
                    <span className="capitalize">{opt?.label || val}</span>
                  </span>
                );
              })}
            </div>

            {/* Product grid */}
            {result && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {result.picks.map((product, idx) => (
                  <ResultCard key={product.id} product={product} delay={150 + idx * 100} />
                ))}
              </div>
            )}

            {/* Retake */}
            <div className="mt-10 text-center">
              <Button variant="outline" size="sm" onClick={resetQuiz} className="rounded-full text-xs">
                <RotateCcw className="mr-1 h-3 w-3" />
                Retake Quiz
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}