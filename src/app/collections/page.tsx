"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Heart, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { products, collections } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

const seasons = ["spring", "summer", "fall", "winter"];
const ageRanges = ["toddler", "preschool", "school"];

const categoryLabels: Record<string, string> = {
  all: "All",
  dresses: "Dresses",
  rompers: "Rompers",
  tops: "Tops",
  bottoms: "Bottoms",
  layers: "Layers",
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
  const { addItem } = useCart();

  // Load wishlist on mount
  useEffect(() => {
    setWishlist(getWishlist());
  }, []);

  const toggleSeason = (s: string) => {
    if (selectedSeasons.includes(s)) {
      setSelectedSeasons(selectedSeasons.filter((x) => x !== s));
    } else {
      setSelectedSeasons([...selectedSeasons, s]);
    }
  };

  const toggleAge = (a: string) => {
    if (selectedAges.includes(a)) {
      setSelectedAges(selectedAges.filter((x) => x !== a));
    } else {
      setSelectedAges([...selectedAges, a]);
    }
  };

  const toggleWish = (id: string) => {
    const updated = toggleWishlistId(id);
    setWishlist(updated);
  };

  // Filter pipeline
  const filteredProducts = products.filter((p) => {
    if (activeCategory !== "all" && p.category !== activeCategory) return false;
    if (selectedSeasons.length > 0 && !p.season.some((s) => selectedSeasons.includes(s))) return false;
    if (selectedAges.length > 0 && !p.ageRange.some((a) => selectedAges.includes(a))) return false;
    return true;
  });

  const categories = [
    { id: "all", label: "All" },
    { id: "dresses", label: "Dresses" },
    { id: "rompers", label: "Rompers" },
    { id: "tops", label: "Tops" },
    { id: "bottoms", label: "Bottoms" },
    { id: "layers", label: "Layers" },
  ];

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
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">All Collections</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Carefully curated pieces for every season and adventure. Filter by age, season, or category.
          </p>
        </div>
      </section>

      {/* Category + filter bar */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat.id)}
                className="rounded-full text-xs"
              >
                {cat.label}
              </Button>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} className="text-xs">
            <Filter className="mr-1 h-3 w-3" />
            Filters{selectedSeasons.length > 0 || selectedAges.length > 0 ? ` (${selectedSeasons.length + selectedAges.length})` : ""}
          </Button>
          {(selectedSeasons.length > 0 || selectedAges.length > 0) && (
            <Button variant="ghost" size="sm" className="text-xs text-destructive" onClick={() => { setSelectedSeasons([]); setSelectedAges([]); }}>
              Clear all
            </Button>
          )}
        </div>

        {/* Expandable filter panel */}
        {showFilters && (
          <div className="mt-4 p-4 rounded-xl bg-pastel-card border border-border/30 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Season */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Season</p>
                <div className="flex flex-wrap gap-2">
                  {seasons.map((s) => {
                    const active = selectedSeasons.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => toggleSeason(s)}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs cursor-pointer transition-all ${
                          active ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-muted-foreground/40"
                        }`}
                      >
                        {s === "spring" ? "🌸" : s === "summer" ? "☀️" : s === "fall" ? "🍂" : "❄️"}
                        <span className="capitalize">{s}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Age range */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Age Range</p>
                <div className="flex flex-wrap gap-2">
                  {ageRanges.map((a) => {
                    const active = selectedAges.includes(a);
                    return (
                      <button
                        key={a}
                        onClick={() => toggleAge(a)}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs cursor-pointer transition-all ${
                          active ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-muted-foreground/40"
                        }`}
                      >
                        {a === "toddler" ? "🧒" : a === "preschool" ? "👦" : "👧"}
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
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-3">🔍</span>
            <h3 className="text-lg font-semibold">No pieces match those filters</h3>
            <p className="text-sm text-muted-foreground mt-2">Try broadening your season or age range.</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => { setSelectedSeasons([]); setSelectedAges([]); setActiveCategory("all"); }}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => {
              const inWishlist = wishlist.includes(product.id);
              return (
                <Card key={product.id} className="group overflow-hidden border-0 bg-muted/30 shadow-sm transition-all hover:shadow-md">
                  <div className="aspect-square w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden">
                    <div className="text-6xl opacity-20 select-none">
                      {product.category === "dresses" ? "👗" : product.category === "rompers" ? "🦺" : product.category === "tops" ? "👕" : product.category === "bottoms" ? "👖" : "🧥"}
                    </div>
                    {/* Wishlist heart */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWish(product.id); }}
                      className="absolute top-2 left-2 h-7 w-7 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm transition-all hover:scale-110 active:scale-90"
                      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className={`h-3.5 w-3.5 ${inWishlist ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                    </button>
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs bg-white/80 text-foreground">New</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm">{product.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                      {product.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-base font-bold">${product.price}</span>
                      <div className="flex gap-1">
                        {product.colors.map((color) => (
                          <span
                            key={color.name}
                            className="inline-block h-3 w-3 rounded-full border border-border"
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {product.season.map((s) => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground">{s}</span>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Link href={`/collections/${product.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-xs rounded-full">
                          Details
                        </Button>
                      </Link>
                      <Button size="sm" className="text-xs rounded-full" onClick={() => handleQuickAdd(product)}>
                        <ShoppingBag className="mr-1 h-3 w-3" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}