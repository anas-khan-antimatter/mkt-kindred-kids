"use client";

import { useState } from "react";
import { Scale, ArrowRight, RotateCcw, Ruler, Heart, ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { products } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

export default function WeightPage() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [recommended, setRecommended] = useState<string | null>(null);
  const [recoGroup, setRecoGroup] = useState<string | null>(null);
  const [recoDetails, setRecoDetails] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<typeof products>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { addItem } = useCart();

  const handleRecommend = async () => {
    const h = parseFloat(height) || 0;
    const w = parseFloat(weight) || 0;
    if (w <= 0) return;
    setLoading(true);
    setError(null);
    setRecommended(null);
    setSuggestedProducts([]);
    try {
      const res = await fetch("/api/size", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ height: h > 0 ? h : w * 2.4, weight: w }),
      });
      if (res.ok) {
        const data = await res.json();
        setRecommended(data.size);
        setRecoGroup(data.group);
        setRecoDetails(data.details);

        // Suggest products available in this size
        const size = data.size;
        const matched = products.filter((p) => p.sizes.includes(size));
        setSuggestedProducts(matched.slice(0, 4));
      } else {
        const err = await res.json().catch(() => ({ error: "Server error" }));
        setError(err.error);
      }
    } catch {
      setError("Could not connect. Please try again.");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setHeight("");
    setWeight("");
    setRecommended(null);
    setRecoDetails(null);
    setSuggestedProducts([]);
    setError(null);
  };

  const handleAddProduct = (product: (typeof products)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: recommended || product.sizes[0],
      color: product.colors[0].name,
      image: product.image,
      quantity: 1,
    });
    const newSet = new Set(addedIds);
    newSet.add(product.id);
    setAddedIds(newSet);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Badge className="mb-3 bg-accent/20 text-accent-foreground border-0">
            <Ruler className="mr-1 h-3 w-3" />
            New Tool
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Size Recommender</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Enter your child&apos;s height and weight and we&apos;ll tell you the perfect size — plus show you pieces that fit.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ── Input Form ── */}
        <Card className="mb-10 border-2 border-dashed border-primary/20 bg-primary/[0.02] shadow-soft">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Tell us about your child</h2>
                <p className="text-sm text-muted-foreground">We&apos;ll recommend the ideal size</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Height <span className="text-xs text-muted-foreground">(inches) — optional but helps accuracy</span>
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 42"
                  min="0"
                  step="0.5"
                  className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Weight <span className="text-xs text-destructive">* required</span>
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 38"
                  min="0"
                  step="0.5"
                  className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                onClick={handleRecommend}
                disabled={!weight || loading}
                className="rounded-full shadow-sm"
              >
                {loading ? (
                  <span className="animate-pulse">Checking…</span>
                ) : (
                  <>
                    <Ruler className="mr-2 h-4 w-4" />
                    Find Their Size
                  </>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={resetForm} className="text-xs">
                <RotateCcw className="mr-1 h-3 w-3" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Loading State ── */}
        {loading && (
          <div className="mb-10 flex items-center justify-center py-8">
            <div className="rounded-2xl bg-card-soft p-8 text-center shadow-soft animate-in fade-in">
              <span className="text-5xl block mb-3 animate-bounce">📐</span>
              <p className="text-muted-foreground animate-pulse">Finding the perfect size…</p>
            </div>
          </div>
        )}

        {/* ── Error State ── */}
        {error && !loading && (
          <div className="mb-10 rounded-xl bg-destructive/10 border border-destructive/30 p-5 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">😕</span>
              <div>
                <h3 className="font-semibold text-sm text-destructive">Something went wrong</h3>
                <p className="text-xs text-destructive/70 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Result ── */}
        {recommended && !loading && (
          <>
            {/* Size Recommendation */}
            <div className="mb-10 rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-2 border-primary/20 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl">🎯</span>
                <div>
                  <Badge className="bg-accent/20 text-accent-foreground border-0 text-xs">Recommended</Badge>
                  <h2 className="text-2xl font-bold mt-1">
                    Size <span className="text-primary text-3xl">{recommended}</span>
                  </h2>
                </div>
              </div>

              {recoDetails && (
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-xl bg-white/50 p-3 text-center">
                    <span className="block text-xs text-muted-foreground">Height Range</span>
                    <span className="block text-lg font-semibold text-foreground mt-1">{recoDetails.height}</span>
                  </div>
                  <div className="rounded-xl bg-white/50 p-3 text-center">
                    <span className="block text-xs text-muted-foreground">Weight Range</span>
                    <span className="block text-lg font-semibold text-foreground mt-1">{recoDetails.weight}</span>
                  </div>
                  <div className="rounded-xl bg-white/50 p-3 text-center">
                    <span className="block text-xs text-muted-foreground">Chest</span>
                    <span className="block text-lg font-semibold text-foreground mt-1">{recoDetails.chest}</span>
                  </div>
                </div>
              )}

              <div className="mt-4 text-xs text-muted-foreground">
                Based on {height ? `${height}" height and ` : ""}{weight} lbs weight
                {recoGroup === "infants" ? " — wearing infant sizing" : ""}
              </div>
            </div>

            {/* Suggested Products in this Size */}
            {suggestedProducts.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  Pieces in Size {recommended}
                  <span className="text-xs text-muted-foreground font-normal">({suggestedProducts.length} available)</span>
                </h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {suggestedProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="group overflow-hidden border-0 bg-card-soft shadow-soft transition-all hover:shadow-md animate-in fade-in"
                    >
                      <div className="aspect-square w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden">
                        <span className="text-5xl opacity-30 select-none">
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
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="text-xs bg-white/70 text-foreground border-0">
                            {recommended}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm">{product.name}</h3>
                        <p className="text-lg font-bold text-primary mt-1">${product.price}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {product.season.map((s) => (
                            <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground">
                              {s}
                            </span>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          className="w-full mt-2 text-xs rounded-full"
                          onClick={() => handleAddProduct(product)}
                        >
                          {addedIds.has(product.id) ? (
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
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Empty / First-visit education ── */}
        {!recommended && !loading && !error && (
          <div className="rounded-2xl bg-card-soft p-6 sm:p-8 border border-border/30">
            <div className="grid gap-6 sm:grid-cols-3 text-center">
              <div>
                <span className="text-3xl block mb-2">📏</span>
                <h3 className="font-medium text-sm">Step 1</h3>
                <p className="text-xs text-muted-foreground mt-1">Measure height &amp; weight at home</p>
              </div>
              <div>
                <span className="text-3xl block mb-2">🔢</span>
                <h3 className="font-medium text-sm">Step 2</h3>
                <p className="text-xs text-muted-foreground mt-1">Enter values and get a size</p>
              </div>
              <div>
                <span className="text-3xl block mb-2">🛍️</span>
                <h3 className="font-medium text-sm">Step 3</h3>
                <p className="text-xs text-muted-foreground mt-1">Shop pieces available in that size</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}