"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Heart, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { products, collections } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

const seasons = ["spring", "summer", "fall", "winter"];
const ageRanges = ["toddler", "preschool", "school"];

/* ── Illustrated category icons ── */
const categoryMeta: Record<string, { emoji: string; label: string }> = {
  all: { emoji: "✨", label: "All" },
  dresses: { emoji: "👗", label: "Dresses" },
  rompers: { emoji: "🦺", label: "Rompers" },
  tops: { emoji: "👕", label: "Tops" },
  bottoms: { emoji: "👖", label: "Bottoms" },
  layers: { emoji: "🧥", label: "Layers" },
};

const seasonEmoji: Record<string, string> = {
  spring: "🌸",
  summer: "☀️",
  fall: "🍂",
  winter: "❄️",
};

const ageEmoji: Record<string, string> = {
  toddler: "🧒",
  preschool: "👦",
  school: "👧",
};

/* ── Wishlist helpers (localStorage) ── */
function getWishlist(): string[] {
  try {
    return JSON.parse(localStorage.getItem("kindred-wishlist") || "[]");
  } catch {
    return [];
  }
}
function toggleWishlistId(id: string): string[] {
  const current = getWishlist();
  const idx = current.indexOf(id);
  if (idx >= 0) current.splice(idx, 1);
  else current.push(id);
  localStorage.setItem("kindred-wishlist", JSON.stringify(current));
  return [...current];
}

export default function CollectionsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { addItem } = useCart();

  useEffect(() => {
    setWishlist(getWishlist());
  }, []);

  const toggleSeason = (s: string) => {
    setSelectedSeasons((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };
  const toggleAge = (a: string) => {
    setSelectedAges((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  };
  const toggleWish = (id: string) => {
    const updated = toggleWishlistId(id);
    setWishlist(updated);
  };

  const filteredProducts = products.filter((p) => {
    if (activeCategory !== "all" && p.category !== activeCategory) return false;
    if (selectedSeasons.length > 0 && !p.season.some((s) => selectedSeasons.includes(s))) return false;
    if (selectedAges.length > 0 && !p.ageRange.some((a) => selectedAges.includes(a))) return false;
    return true;
  });

  const categories = Object.entries(categoryMeta).map(([id, meta]) => ({ id, ...meta }));

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

  const hasActiveFilters = selectedSeasons.length > 0 || selectedAges.length > 0;
  const activeCount = hasActiveFilters ? selectedSeasons.length + selectedAges.length : 0;

  return (
    <div>
      {/* Hero */}
      <section className="bg-denim-wash px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Badge className="mb-3 bg-white/15 text-white border-0 backdrop-blur-sm">
            {filteredProducts.length} pieces
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">All Collections</h1>
          <p className="mt-3 text-white/70 max-w-xl">
            Carefully curated pieces for every season and adventure. Filter by age, season, or category.
          </p>
        </div>
      </section>

      {/* ── Illustrated category tabs ── */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium cursor-pointer transition-all ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card-soft border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-sm">{cat.emoji}</span>
              {cat.label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`text-xs rounded-full ${showFilters ? "bg-primary/10 text-primary" : ""}`}
            >
              <Filter className="mr-1 h-3 w-3" />
              Filters{activeCount > 0 ? ` (${activeCount})` : ""}
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="text-xs text-destructive rounded-full" onClick={() => { setSelectedSeasons([]); setSelectedAges([]); }}>
                <X className="mr-1 h-3 w-3" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Expandable filter panel */}
        {showFilters && (
          <div className="mb-6 p-5 rounded-xl bg-card-soft border border-border/40 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Season */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Season</p>
                <div className="flex flex-wrap gap-2">
                  {seasons.map((s) => {
                    const active = selectedSeasons.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => toggleSeason(s)}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs cursor-pointer transition-all ${
                          active ? "border-primary bg-primary/10 text-primary font-medium" : "border-border hover:border-muted-foreground/40"
                        }`}
                      >
                        <span>{seasonEmoji[s]}</span>
                        <span className="capitalize">{s}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Age range */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Age Range</p>
                <div className="flex flex-wrap gap-2">
                  {ageRanges.map((a) => {
                    const active = selectedAges.includes(a);
                    return (
                      <button
                        key={a}
                        onClick={() => toggleAge(a)}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs cursor-pointer transition-all ${
                          active ? "border-primary bg-primary/10 text-primary font-medium" : "border-border hover:border-muted-foreground/40"
                        }`}
                      >
                        <span>{ageEmoji[a]}</span>
                        <span className="capitalize">{a}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Products grid */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4 opacity-70">🔍</span>
            <h3 className="text-lg font-semibold">No pieces match those filters</h3>
            <p className="text-sm text-muted-foreground mt-2">Try broadening your season or age range.</p>
            <Button variant="outline" size="sm" className="mt-5 rounded-full" onClick={() => { setSelectedSeasons([]); setSelectedAges([]); setActiveCategory("all"); }}>
              Reset All Filters
            </Button>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-5">
              Showing {filteredProducts.length} of {products.length} pieces
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => {
                const inWishlist = wishlist.includes(product.id);
                const justAdded = addedIds.has(product.id);
                return (
                  <Card
                    key={product.id}
                    className="group overflow-hidden border-0 bg-card-soft shadow-soft transition-all duration-300 hover:shadow-bouncy hover:-translate-y-0.5"
                  >
                    {/* Image area */}
                    <div className="aspect-square w-full bg-editorial flex items-center justify-center relative overflow-hidden">
                      <span className="text-7xl opacity-25 select-none transition-transform duration-500 group-hover:scale-125">
                        {categoryMeta[product.category]?.emoji || "🧵"}
                      </span>
                      {/* Wishlist heart */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleWish(product.id); }}
                        className="absolute top-2.5 left-2.5 h-8 w-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all hover:scale-110 active:scale-90 shadow-sm"
                        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart className={`h-4 w-4 transition-all ${inWishlist ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"}`} />
                      </button>
                      <Badge className="absolute top-2.5 right-2.5 text-[10px] bg-white/80 text-foreground border-0 backdrop-blur-sm shadow-sm">
                        New
                      </Badge>
                      {/* Age indicator */}
                      <Badge variant="outline" className="absolute bottom-2.5 right-2.5 text-[10px] bg-background/70 border-0 backdrop-blur-sm">
                        {product.ageRange.join(" · ")}
                      </Badge>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{product.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {product.material}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-base font-bold text-primary">${product.price}</span>
                        <div className="flex gap-1">
                          {product.colors.map((color) => (
                            <span
                              key={color.name}
                              className="inline-block h-3 w-3 rounded-full border border-border/50"
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {product.season.map((s) => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/15 text-accent-foreground flex items-center gap-0.5">
                            {seasonEmoji[s]} {s}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Link href={`/collections/${product.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full text-xs rounded-full border-muted-foreground/20">
                            Details
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          className={`text-xs rounded-full transition-all duration-300 ${
                            justAdded ? "bg-green-600 hover:bg-green-700" : ""
                          }`}
                          onClick={() => handleQuickAdd(product)}
                          disabled={justAdded}
                        >
                          <ShoppingBag className="mr-1 h-3 w-3" />
                          {justAdded ? "Added!" : "Add"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}