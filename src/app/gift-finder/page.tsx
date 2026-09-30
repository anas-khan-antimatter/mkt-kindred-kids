"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, RotateCcw, ShoppingBag, Check } from "lucide-react";
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

type Answers = Record<string, string>;

function ResultCard({ product, addItem, delay }: { product: typeof products[0]; addItem: (item: any) => void; delay: number }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: product.sizes[0],
      color: product.colors[0].name,
      image: product.image,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-4 opacity-0 animation-delay-200 animation-fill-forwards"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Card className="overflow-hidden border-0 bg-pastel-card shadow-soft transition-all hover:shadow-md">
        <div className="aspect-square w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative">
          <span className="text-5xl opacity-60 select-none">
            {product.category === "dresses"
              ? "👗"
              : product.category === "rompers"
              ? "🦺"
              : product.category === "tops"
              ? "👕"
              : product.category === "bottoms"
              ? "👖"
              : "🧥"}
          </span>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm">{product.name}</h3>
          <p className="mt-1 text-lg font-bold text-primary">${product.price}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{product.material}</p>
          <div className="mt-2 flex gap-1">
            {product.colors.map((color) => (
              <span
                key={color.name}
                className="inline-block h-3 w-3 rounded-full border border-border"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
          <Button
            size="sm"
            className={`w-full mt-3 text-xs rounded-full transition-all ${added ? "bg-green-600 hover:bg-green-700" : ""}`}
            onClick={handleAdd}
          >
            {added ? (
              <>
                <Check className="mr-1 h-3 w-3" />
                Added!
              </>
            ) : (
              <>
                <ShoppingBag className="mr-1 h-3 w-3" />
                Add to Bag
              </>
            )}
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
  const { addItem } = useCart();

  const handleAnswer = (value: string) => {
    const updated = { ...answers, [questions[step].id]: value };
    setAnswers(updated);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      generateResult(updated);
    }
  };

  const generateResult = (answers: Answers) => {
    let recommended = [...products];

    if (answers.age === "infant") {
      recommended = recommended.filter((p) => p.sizes.includes("2T") || p.sizes.includes("3T"));
    } else if (answers.age === "toddler") {
      recommended = recommended.filter((p) => p.sizes.includes("2T") || p.sizes.includes("3T") || p.sizes.includes("4T"));
    } else if (answers.age === "preschool") {
      recommended = recommended.filter((p) => p.sizes.includes("4T") || p.sizes.includes("5") || p.sizes.includes("6"));
    } else {
      recommended = recommended.filter((p) => p.sizes.includes("6") || p.sizes.includes("7") || p.sizes.includes("8"));
    }

    if (answers.personality === "adventurous" || answers.personality === "silly") {
      recommended = recommended.filter((p) =>
        p.name.toLowerCase().includes("ramble") ||
        p.name.toLowerCase().includes("dungaree") ||
        p.name.toLowerCase().includes("jogger")
      );
    } else if (answers.personality === "creative") {
      recommended = recommended.filter((p) =>
        p.name.toLowerCase().includes("smock") ||
        p.name.toLowerCase().includes("tee") ||
        p.name.toLowerCase().includes("hoodie")
      );
    } else {
      recommended = recommended.filter((p) =>
        p.name.toLowerCase().includes("cardigan") ||
        p.name.toLowerCase().includes("pinafore") ||
        p.name.toLowerCase().includes("smock")
      );
    }

    if (recommended.length < 3) {
      recommended = products.filter(
        (p) => p.name.toLowerCase().includes("tee") || p.name.toLowerCase().includes("dungaree")
      );
    }

    let title = "Your Perfect Picks!";
    if (answers.personality === "adventurous") title = "Adventure Awaits! 🌲";
    else if (answers.personality === "creative") title = "Creative Cuties! 🎨";
    else if (answers.personality === "gentle") title = "Cozy Comforts! 🧸";
    else if (answers.personality === "silly") title = "Playtime Picks! 🤪";

    setResult({ title, picks: recommended.slice(0, 4) });
    setTimeout(() => setShowResult(true), 100);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
    setShowResult(false);
  };

  const progressPct = result
    ? 100
    : Math.round(((step + 1) / questions.length) * 100);

  const currentQuestion = questions[step];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/10 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Badge className="mb-3 bg-accent/20 text-accent-foreground border-0">
            <Sparkles className="mr-1 h-3 w-3" />
            Interactive Quiz
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Gift Finder</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Not sure what to get? Answer 4 quick questions and we&apos;ll match you with the perfect pieces.
          </p>
        </div>
      </section>

      {!result ? (
        <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Question {step + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-primary">{progressPct}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <Card className="border-0 shadow-soft overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>

                <div className="space-y-3">
                  {currentQuestion.options.map((opt) => {
                    const selected = answers[currentQuestion.id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(opt.value)}
                        className={`flex w-full items-center gap-4 rounded-xl border p-4 cursor-pointer transition-all text-left hover:scale-[1.01] active:scale-[0.99] ${
                          selected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-muted-foreground/40 hover:bg-accent/30"
                        }`}
                      >
                        <span className="text-2xl shrink-0">{opt.emoji}</span>
                        <span className="font-medium">{opt.label}</span>
                        {selected && (
                          <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs animate-in zoom-in duration-200">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => step > 0 && setStep(step - 1)}
                  disabled={step === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button variant="ghost" onClick={reset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Start Over
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      ) : (
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            {showResult && (
              <div className="animate-in zoom-in duration-300">
                <Badge className="mb-3 bg-primary/10 text-primary border-0 text-sm px-5 py-1">
                  Quiz Complete! 🎉
                </Badge>
              </div>
            )}
            <h2 className="text-3xl font-bold tracking-tight animate-in fade-in duration-500">{result.title}</h2>
            <p className="mt-2 text-muted-foreground animate-in fade-in duration-500">
              Based on your answers, here are the perfect picks for your little one.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {result.picks.map((product, idx) => (
              <ResultCard key={product.id} product={product} addItem={addItem} delay={idx * 120} />
            ))}
          </div>

          {showResult && (
            <div className="mt-10 text-center space-x-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
              <Button onClick={reset} variant="outline" className="rounded-full">
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button asChild className="rounded-full">
                <a href="/collections">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}