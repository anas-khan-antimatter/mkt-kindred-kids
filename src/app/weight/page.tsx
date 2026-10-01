"use client";

import { useState, useEffect } from "react";
import { Scale, ArrowRight, RotateCcw, Ruler, ShoppingBag, Check, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { products } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

const categoryMeta: Record<string, { emoji: string }> = {
  dresses: { emoji: "👗" },
  rompers: { emoji: "🦺" },
  tops: { emoji: "👕" },
  bottoms: { emoji: "👖" },
  layers: { emoji: "🧥" },
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
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showAllSizes, setShowAllSizes] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    setWishlist(getWishlist());
  }, []);

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
    setShowAllSizes(false);
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
    setAddedIds((prev) => new Set(prev).add(product.id));
  };

  const toggleWish = (id: string) => {
    const updated = toggleWishlistId(id);
    setWishlist(updated);
  };

  const sizeChart = [
    { size: "0-3M", height: 'Up to 24"', weight: "Up to 14 lbs" },
    { size: "3-6M", height: '24–27"', weight: "14–18 lbs" },
    { size: "6-12M", height: '27–30"', weight: "18–24 lbs" },
    { size: "12-18M", height: '30–33"', weight: "24–28 lbs" },
    { size: "18-24M", height: '33–35"', weight: "28–30 lbs" },
    { size: "2T", height: '35–37"', weight: "30–32 lbs" },
    { size: "3T", height: '37–39"', weight: "32–35 lbs" },
    { size: "4T", height: '39–41"', weight: "35–39 lbs" },
    { size: "5", height: '41–44"', weight: "39–45 lbs" },
    { size: "6", height: '44–47"', weight: "45–50 lbs" },
    { size: "7", height: '47–50"', weight: "50–57 lbs" },
    { size: "8", height: '50–53"', weight: "57–65 lbs" },
  ];

  const visibleSizes = showAllSizes ? sizeChart : sizeChart.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="bg-denim-wash px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Badge className="mb-3 bg-white/15 text-white border-0 backdrop-blur-sm">
            <Sparkles className="mr-1 h-3 w-3" />
            New Tool
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Size Recommender</h1>
          <p className="mt-3 text-white/70 max-w-xl">
            Not sure which size fits your little one? Enter their height and weight — we&apos;ll recommend the perfect size and show you pieces that match.
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
                  Height <span className="text-xs text-muted-foreground">(inches) — optional</span>
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
                  <span className="animate-pulse flex items-center gap-2">
                    <span className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    Finding size…
                  </span>
                ) : (
                  <>
                    <Ruler className="mr-2 h-4 w-4" />
                    Get My Size
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              {recommended && (
                <Button variant="ghost" size="sm" onClick={resetForm} className="text-xs rounded-full">
                  <RotateCcw className="mr-1 h-3 w-3" />
                  Start Over
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Results ── */}
        {error && (
          <div className="mb-10 rounded-xl bg-destructive/5 border border-destructive/20 p-5 text-center">
            <span className="text-2xl block mb-2">😔</span>
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {recommended && recoDetails && (
          <>
            <div className="mb-10 rounded-2xl bg-caramel-fade border-2 border-primary/20 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <Ruler className="h-10 w-10 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <Badge className="mb-2 bg-white/20 text-white border-0 backdrop-blur-sm text-xs">
                    {recoGroup === "infants" ? "👶 Infant" : "🧒 Kids"} Size
                  </Badge>
                  <h2 className="text-2xl font-bold text-white sm:text-3xl">
                    We recommend size <span className="underline decoration-white/40 decoration-2 underline-offset-4">{recommended}</span>
                  </h2>
                  <p className="text-white/70 text-sm mt-1">Based on {weight} lbs{height ? ` and ${height}" height` : ""}</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl bg-white/10 backdrop-blur-sm p-4">
                <div className="text-center">
                  <p className="text-xs text-white/60">Height Range</p>
                  <p className="text-white font-semibold">{recoDetails.height}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-white/60">Weight Range</p>
                  <p className="text-white font-semibold">{recoDetails.weight}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-white/60">Chest</p>
                  <p className="text-white font-semibold">{recoDetails.chest}</p>
                </div>
              </div>
            </div>

            {/* ── Suggested products ── */}
            {suggestedProducts.length > 0 && (
              <div className="mb-10">
                <h3 className="text-lg font-semibold mb-4">Pieces that fit size {recommended}</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {suggestedProducts.map((product) => {
                    const inWishlist = wishlist.includes(product.id);
                    const justAdded = addedIds.has(product.id);
                    return (
                      <Card key={product.id} className="overflow-hidden border-0 bg-card-soft shadow-soft transition-all hover:shadow-bouncy hover:-translate-y-0.5 group">
                        <div className="aspect-square w-full bg-editorial flex items-center justify-center relative overflow-hidden">
                          <span className="text-5xl opacity-25 select-none transition-transform duration-500 group-hover:scale-125">
                            {categoryMeta[product.category]?.emoji || "🧵"}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleWish(product.id); }}
                            className="absolute top-2 left-2 h-7 w-7 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm transition-all hover:scale-110 active:scale-90"
                            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <Heart className={`h-3.5 w-3.5 ${inWishlist ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                          </button>
                          <Badge className="absolute top-2 right-2 text-[10px] bg-white/80 text-foreground border-0 backdrop-blur-sm shadow-sm">
                            ${product.price}
                          </Badge>
                        </div>
                        <CardContent className="p-3">
                          <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                          <div className="mt-1 flex gap-1">
                            {product.colors.map((color) => (
                              <span key={color.name} className="inline-block h-2.5 w-2.5 rounded-full border border-border/50" style={{ backgroundColor: color.hex }} />
                            ))}
                          </div>
                          <Button
                            size="sm"
                            className={`w-full mt-2 text-xs rounded-full transition-all ${justAdded ? "bg-green-600 hover:bg-green-700" : ""}`}
                            onClick={() => handleAddProduct(product)}
                            disabled={justAdded}
                          >
                            {justAdded ? (
                              <><Check className="mr-1 h-3 w-3" /> Added!</>
                            ) : (
                              <><ShoppingBag className="mr-1 h-3 w-3" /> Add to Bag</>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Size reference chart ── */}
        <div className="rounded-2xl bg-card-soft p-6 sm:p-8 border border-border/30">
          <h3 className="text-lg font-semibold mb-1">Size Reference Chart</h3>
          <p className="text-sm text-muted-foreground mb-5">Quick reference for all Kindred Kids sizes</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-3 px-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Size</th>
                  <th className="text-left py-3 px-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Height</th>
                  <th className="text-left py-3 px-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Weight</th>
                </tr>
              </thead>
              <tbody>
                {visibleSizes.map((row, idx) => (
                  <tr
                    key={row.size}
                    className={`border-b border-border/20 transition-colors hover:bg-muted/30 ${
                      row.size === recommended ? "bg-primary/5 font-medium" : ""
                    }`}
                  >
                    <td className={`py-3 px-2 ${row.size === recommended ? "text-primary" : ""}`}>
                      {row.size === recommended ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">✓</span>
                          {row.size}
                        </span>
                      ) : (
                        row.size
                      )}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{row.height}</td>
                    <td className="py-3 px-2 text-muted-foreground">{row.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sizeChart.length > 6 && (
            <button
              onClick={() => setShowAllSizes(!showAllSizes)}
              className="mt-4 text-xs text-primary hover:underline inline-flex items-center gap-1 transition-all"
            >
              {showAllSizes ? "Show fewer sizes" : `Show all ${sizeChart.length} sizes`}
              <ArrowRight className={`h-3 w-3 transition-transform ${showAllSizes ? "rotate-90" : ""}`} />
            </button>
          )}
        </div>
      </section>
    </div>
  );
}