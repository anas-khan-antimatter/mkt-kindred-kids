"use client";

import { useState } from "react";
import { lookbookLooks, products } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, X } from "lucide-react";

export default function LookbookPage() {
  const [activeLook, setActiveLook] = useState<number | null>(null);
  const { addItem } = useCart();

  /* ── Shop-the-look: find products matching each look description ── */
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
  };

  const emojis = ["🌸", "🏖️", "🍂", "☁️", "🌷", "⭐"];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-accent/20 via-primary/5 to-secondary/20 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Lookbook</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Styling inspiration for every season. Tap a look to shop the pieces.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {lookbookLooks.map((look) => {
            const lookProducts = getLookProducts(look.description);
            const isExpanded = activeLook === look.id;

            return (
              <div
                key={look.id}
                className="group overflow-hidden rounded-2xl bg-card-soft border border-border/30 transition-all hover:shadow-soft"
              >
                <button
                  className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setActiveLook(isExpanded ? null : look.id)}
                >
                  <div className="aspect-[4/5] w-full bg-card-soft flex items-center justify-center relative">
                    <span className="text-7xl opacity-80 select-none transition-transform group-hover:scale-110 duration-300">
                      {emojis[look.id - 1]}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{look.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {lookProducts.length} items
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{look.description}</p>
                  </div>
                </button>

                {/* ── Shop-the-look panel ── */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="h-px bg-border/60" />
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Shop this look
                    </p>
                    <div className="grid gap-3">
                      {lookProducts.length > 0 ? (
                        lookProducts.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center gap-3 rounded-xl bg-background/60 p-2.5 border border-border/30"
                          >
                            <div className="h-12 w-12 shrink-0 rounded-lg bg-card-soft flex items-center justify-center">
                              <span className="text-lg opacity-60">
                                {product.category === "dresses" ? "👗" : product.category === "rompers" ? "🦺" : product.category === "tops" ? "👕" : product.category === "bottoms" ? "👖" : "🧥"}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{product.name}</p>
                              <p className="text-xs text-muted-foreground">${product.price} · {product.material}</p>
                              <div className="flex gap-1 mt-1">
                                {product.colors.slice(0, 3).map((c) => (
                                  <span key={c.name} className="h-2.5 w-2.5 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
                                ))}
                              </div>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="shrink-0 h-8 w-8"
                              onClick={() => handleQuickAdd(product)}
                              title="Add to bag"
                            >
                              <ShoppingBag className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground italic">
                          Matching products coming soon.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-card-soft border-t border-border/30 py-16">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <span className="text-4xl block mb-2">✨</span>
          <h2 className="text-2xl font-bold tracking-tight">Create Your Own Look</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Mix and match from our collections to build the perfect outfit for your little one.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild className="rounded-full">
              <a href="/collections">Shop Now</a>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <a href="/sustainability">Our Story</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}