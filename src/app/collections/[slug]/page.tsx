"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ShoppingBag, Check, Heart, Ruler, Leaf, Sparkles, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { products } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

const categoryMeta: Record<string, { emoji: string; label: string }> = {
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

export default function ProductDetailPage() {
  const params = useParams();
  const product = products.find((p) => p.id === params.slug);
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] ?? { name: "", hex: "" });
  const [added, setAdded] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.id !== product.id && (p.category === product.category || p.season.some((s) => product.season.includes(s))))
      .slice(0, 4);
  }, [product]);

  useEffect(() => {
    if (product) setInWishlist(getWishlist().includes(product.id));
  }, [product]);

  if (!product) notFound();

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price, size: selectedSize, color: selectedColor.name, image: product.image, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleWish = () => {
    const updated = toggleWishlistId(product.id);
    setInWishlist(updated.includes(product.id));
  };

  const fakeImages = [product.image, product.images?.[1] || product.image];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Link
        href="/collections"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back to Collections
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ─── Image area ─── */}
        <div className="space-y-3">
          <div className="relative aspect-[4/5] w-full rounded-3xl bg-editorial flex items-center justify-center overflow-hidden group/image">
            {/* Floating decorative particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className="absolute text-xl opacity-10 select-none animate-float"
                  style={{
                    top: `${8 + i * 15}%`,
                    left: `${5 + i * 16}%`,
                    animationDuration: `${5 + i * 2}s`,
                    animationDelay: `${i * 0.8}s`,
                  }}
                >
                  {["✦", "•", "☆", "◦", "✧", "·"][i]}
                </span>
              ))}
            </div>

            {/* Wishlist button */}
            <button
              onClick={handleToggleWish}
              className="absolute top-4 left-4 h-9 w-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all hover:scale-110 active:scale-90 z-10 shadow-soft"
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-4 w-4 transition-all ${inWishlist ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"}`} />
            </button>

            {/* Category badge */}
            <Badge className="absolute top-4 right-4 bg-white/80 text-foreground border-0 backdrop-blur-sm shadow-soft text-xs flex items-center gap-1">
              {categoryMeta[product.category]?.emoji} {categoryMeta[product.category]?.label}
            </Badge>

            {/* Season indicator */}
            <div className="absolute bottom-4 left-4 flex gap-1.5">
              {product.season.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 rounded-full bg-white/70 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-medium shadow-soft">
                  {seasonEmoji[s]} {s}
                </span>
              ))}
            </div>

            {/* Main emoji illustration */}
            {activeImage === 0 ? (
              <span className="text-8xl opacity-25 select-none transition-all duration-500 group-hover/image:scale-125 group-hover/image:opacity-40">
                {categoryMeta[product.category]?.emoji || "🧵"}
              </span>
            ) : (
              <span className="text-8xl opacity-25 select-none transition-all duration-500 group-hover/image:scale-125">
                {product.category === "dresses" ? "🌿" : product.category === "rompers" ? "🧸" : product.category === "tops" ? "⭐" : product.category === "bottoms" ? "🌊" : "☁️"}
              </span>
            )}
          </div>

          {/* Thumbnail selector */}
          <div className="flex gap-2">
            {fakeImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`h-14 w-14 rounded-xl flex items-center justify-center text-2xl transition-all border-2 ${
                  activeImage === i ? "border-primary bg-primary/5 scale-105" : "border-border/30 bg-card-soft hover:border-muted-foreground/40"
                }`}
              >
                {i === 0 ? (categoryMeta[product.category]?.emoji || "🧵") : "🔄"}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Product details ─── */}
        <div className="space-y-6 lg:pl-4">
          <div>
            <Badge className="mb-2 badge-pill text-[10px] border-0">
              <Sparkles className="mr-1 h-2.5 w-2.5" />
              {product.material}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-2xl font-bold text-primary">${product.price}</span>
              <span className="text-xs text-muted-foreground line-through">${(product.price * 1.25).toFixed(0)}</span>
              <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700 border-0">20% off</Badge>
            </div>
            <div className="mt-2 flex items-center gap-0.5 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < 4 ? "fill-current" : "fill-none stroke-current opacity-30"}`} />
              ))}
              <span className="ml-1.5 text-xs text-muted-foreground">(24 reviews)</span>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed text-sm">{product.description}</p>

          {/* Age range + details */}
          <div className="flex flex-wrap gap-2">
            {product.ageRange.map((age) => (
              <span key={age} className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent-foreground">
                {age === "toddler" ? "🧒" : age === "preschool" ? "👦" : "👧"} {age}
              </span>
            ))}
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Ruler className="h-3 w-3" /> Sizes {product.sizes[0]}–{product.sizes[product.sizes.length - 1]}
            </span>
          </div>

          <Separator />

          {/* Color selector */}
          <div>
            <h3 className="text-sm font-semibold mb-2.5">Color: <span className="font-normal text-muted-foreground">{selectedColor.name}</span></h3>
            <div className="flex gap-2.5">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  className={`h-9 w-9 rounded-full border-2 transition-all ${
                    selectedColor.name === color.name
                      ? "border-primary scale-110 shadow-soft"
                      : "border-border/50 hover:border-muted-foreground/50"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setSelectedColor(color)}
                  title={color.name}
                  aria-label={color.name}
                />
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-sm font-semibold">Size: <span className="font-normal text-muted-foreground">{selectedSize}</span></h3>
              <Link href="/size-guide" className="text-xs text-primary hover:underline inline-flex items-center gap-0.5">
                <Ruler className="h-3 w-3" /> Size Guide
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`min-w-[3rem] h-10 rounded-xl border-2 text-sm font-medium transition-all ${
                    selectedSize === size
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border/40 bg-card-soft text-foreground hover:border-muted-foreground/40"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">Qty:</span>
            <div className="flex items-center gap-1 rounded-xl border border-border/40 bg-card-soft">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-9 w-9 flex items-center justify-center text-sm font-medium hover:bg-muted/50 rounded-l-xl transition-colors"
                disabled={quantity <= 1}
              >
                –
              </button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="h-9 w-9 flex items-center justify-center text-sm font-medium hover:bg-muted/50 rounded-r-xl transition-colors"
                disabled={quantity >= 10}
              >
                +
              </button>
            </div>
          </div>

          <Separator />

          {/* Details list */}
          <div className="space-y-2.5">
            <p className="text-sm font-semibold flex items-center gap-1.5">
              <Leaf className="h-4 w-4 text-primary" />
              What makes it special
            </p>
            <ul className="space-y-1.5">
              {product.details.map((detail) => (
                <li key={detail} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-3 w-3 text-primary shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          {/* Add to cart */}
          <Button
            size="lg"
            className={`w-full text-base rounded-xl h-14 transition-all duration-300 shadow-bouncy ${
              added ? "bg-green-600 hover:bg-green-700 shadow-none" : ""
            }`}
            onClick={handleAddToCart}
          >
            {added ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                Added to Bag — ${(product.price * quantity).toFixed(0)}
              </>
            ) : (
              <>
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Bag — ${(product.price * quantity).toFixed(0)}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ─── Related products ─── */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-border/20 pt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">Complete the Look</h2>
              <p className="text-sm text-muted-foreground mt-1">Pieces that pair beautifully with {product.name}</p>
            </div>
            <Link
              href="/collections"
              className="text-sm text-primary hover:underline inline-flex items-center gap-0.5"
            >
              View All <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((rp) => (
              <Link key={rp.id} href={`/collections/${rp.id}`}>
                <Card className="h-full overflow-hidden border-0 bg-card-soft shadow-soft transition-all duration-300 hover:shadow-bouncy hover:-translate-y-0.5 group">
                  <div className="aspect-square w-full bg-editorial flex items-center justify-center relative">
                    <span className="text-5xl opacity-25 select-none transition-transform duration-500 group-hover:scale-125">
                      {categoryMeta[rp.category]?.emoji || "🧵"}
                    </span>
                  </div>
                  <CardContent className="p-3.5">
                    <p className="font-medium text-sm truncate">{rp.name}</p>
                    <p className="text-sm font-bold text-primary mt-0.5">${rp.price}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── Sustainability callout ─── */}
      <section className="mt-12 rounded-2xl bg-caramel-fade p-6 sm:p-8 relative overflow-hidden">
        <span className="absolute -bottom-4 -right-4 text-5xl opacity-10 select-none">🌿</span>
        <span className="absolute -top-4 -left-4 text-4xl opacity-10 select-none rotate-45">♻️</span>
        <div className="flex flex-col sm:flex-row items-center gap-4 relative">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl">
            🌱
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-white">Every purchase plants a tree</h3>
            <p className="text-sm text-white/70 mt-0.5">
              We partner with One Tree Planted to restore forests for every order. You&apos;ll get a certificate with your shipment.
            </p>
          </div>
          <Link href="/sustainability">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10 rounded-full shrink-0 border border-white/20">
              Learn More <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}