"use client";

import { useState, useEffect } from "react";
import { lookbookLooks, products } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, X, Heart, Check, Sparkles, ChevronDown } from "lucide-react";

const categoryMeta: Record<string, { emoji: string }> = {
  dresses: { emoji: "👗" },
  rompers: { emoji: "🦺" },
  tops: { emoji: "👕" },
  bottoms: { emoji: "👖" },
  layers: { emoji: "🧥" },
};

const seasonLookEmojis = ["🌸", "🏖️", "🍂", "☁️", "🌷", "⭐"];
const seasonVibes = ["Spring Bloom", "Beach Days", "Cozy Autumn", "Winter Wonder", "Garden Party", "Starry Night"];

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

export default function LookbookPage() {
  const [activeLook, setActiveLook] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { addItem } = useCart();

  useEffect(() => {
    setWishlist(getWishlist());
  }, []);

  const getLookProducts = (description: string) => {
    const keywords = description.toLowerCase().replace(/[+]/g, "").split(/\s+/);
    return products.filter((p) =>
      keywords.some((kw) => p.name.toLowerCase().includes(kw))
    );
  };

  const handleQuickAdd = (product: (typeof products)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: product.sizes[0],
      color: product.colors[0].name,
      image: product.image,
      quantity: 1,
    });
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => setAddedIds((prev) => { const n = new Set(prev); n.delete(product.id); return n; }), 1200);
  };

  const toggleWish = (id: string) => {
    const updated = toggleWishlistId(id);
    setWishlist(updated);
  };

  const handleAddAll = (look: (typeof lookbookLooks)[0]) => {
    const lookProducts = getLookProducts(look.description);
    lookProducts.forEach((p) => {
      addItem({
        id: p.id,
        name: p.name,
        price: p.price,
        size: p.sizes[0],
        color: p.colors[0].name,
        image: p.image,
        quantity: 1,
      });
    });
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-denim-wash px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Badge className="mb-3 bg-white/15 text-white border-0 backdrop-blur-sm">
            <Sparkles className="mr-1 h-3 w-3" />
            Styling Inspiration
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Lookbook</h1>
          <p className="mt-3 text-white/70 max-w-xl">
            Styling inspiration for every season. Tap a look to shop the pieces — or add the whole look at once.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {lookbookLooks.map((look, idx) => {
            const lookProducts = getLookProducts(look.description);
            const isExpanded = activeLook === look.id;
            const lookTotal = lookProducts.reduce((sum, p) => sum + p.price, 0);

            return (
              <div
                key={look.id}
                className={`group overflow-hidden rounded-2xl bg-card-soft border transition-all duration-300 ${
                  isExpanded ? "border-primary/30 shadow-soft" : "border-border/30 hover:shadow-soft"
                }`}
              >
                {/* ── Look Card (clickable) ── */}
                <button
                  className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setActiveLook(isExpanded ? null : look.id)}
                >
                  <div className="aspect-[4/5] w-full bg-editorial flex items-center justify-center relative overflow-hidden">
                    {/* Floating particles */}
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(4)].map((_, i) => (
                        <span
                          key={i}
                          className="absolute text-lg opacity-15 select-none"
                          style={{
                            top: `${10 + i * 25}%`,
                            left: `${10 + i * 22}%`,
                          }}
                        >
                          {["✦", "•", "☆", "◦"][i]}
                        </span>
                      ))}
                    </div>
                    <span className="text-7xl opacity-80 select-none transition-all duration-500 group-hover:scale-125 group-hover:opacity-100">
                      {seasonLookEmojis[idx % seasonLookEmojis.length]}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/8 to-transparent" />
                    <Badge className="absolute bottom-3 left-3 bg-white/80 text-foreground border-0 backdrop-blur-sm text-[10px]">
                      {seasonVibes[idx % seasonVibes.length]}
                    </Badge>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{look.title}</h3>
                      <Badge variant="secondary" className="text-xs rounded-full">
                        {lookProducts.length} items
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{look.description}</p>
                    {lookProducts.length > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          From <span className="font-semibold text-foreground">${Math.min(...lookProducts.map((p) => p.price))}</span>
                        </span>
                        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                    )}
                  </div>
                </button>

                {/* ── Shop-the-look expandable panel ── */}
                {isExpanded && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="mx-4 h-px bg-border/40" />
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Shop this look
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Total <span className="font-bold text-foreground">${lookTotal.toFixed(0)}</span>
                          </span>
                          {lookProducts.length > 0 && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[10px] h-7 rounded-full border-muted-foreground/20"
                              onClick={() => handleAddAll(look)}
                            >
                              <ShoppingBag className="mr-1 h-3 w-3" />
                              Add All
                            </Button>
                          )}
                        </div>
                      </div>

                      {lookProducts.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {lookProducts.map((product) => {
                            const inWishlist = wishlist.includes(product.id);
                            const justAdded = addedIds.has(product.id);
                            return (
                              <div key={product.id} className="flex items-center gap-3 rounded-xl bg-muted/30 p-2.5 transition-all hover:bg-muted/50">
                                {/* Mini visual */}
                                <div className="h-14 w-14 shrink-0 rounded-lg bg-card-soft flex items-center justify-center relative">
                                  <span className="text-2xl opacity-40 select-none">
                                    {categoryMeta[product.category]?.emoji || "🧵"}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium truncate">{product.name}</p>
                                  <p className="text-xs font-bold text-primary">${product.price}</p>
                                  <div className="mt-0.5 flex gap-1">
                                    {product.colors.map((color) => (
                                      <span key={color.name} className="inline-block h-2 w-2 rounded-full border border-border/50" style={{ backgroundColor: color.hex }} />
                                    ))}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <button
                                    onClick={() => toggleWish(product.id)}
                                    className="h-6 w-6 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-90"
                                    aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                                  >
                                    <Heart className={`h-3 w-3 ${inWishlist ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                                  </button>
                                  <Button
                                    size="sm"
                                    className={`text-[10px] h-6 px-2 rounded-full transition-all ${justAdded ? "bg-green-600 hover:bg-green-700" : ""}`}
                                    onClick={() => handleQuickAdd(product)}
                                    disabled={justAdded}
                                  >
                                    {justAdded ? (
                                      <Check className="h-3 w-3" />
                                    ) : (
                                      <><ShoppingBag className="mr-0.5 h-3 w-3" /> Add</>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <span className="text-2xl block mb-1 opacity-50">🔍</span>
                          <p className="text-xs text-muted-foreground">Browse our collection to find pieces for this look</p>
                          <Button asChild size="sm" variant="outline" className="mt-2 rounded-full text-xs">
                            <a href="/collections">Shop All</a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="bg-card-soft border-t border-border/30 py-16">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <span className="text-5xl block mb-3">📸</span>
          <h2 className="text-2xl font-bold sm:text-3xl">Share Your Look</h2>
          <p className="mt-2 text-muted-foreground text-sm max-w-sm mx-auto">
            Tag <span className="font-semibold">@kindredkids</span> on Instagram for a chance to be featured in our next lookbook.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            {["🌸", "🌿", "⭐", "🌈"].map((emoji, i) => (
              <span key={i} className="text-2xl opacity-40 hover:opacity-100 transition-opacity cursor-default">{emoji}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}