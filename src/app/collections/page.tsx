"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { products, collections } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

export default function CollectionsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { addItem } = useCart();

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

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
            Carefully curated pieces for every season and adventure.
          </p>
        </div>
      </section>

      {/* Collection filters */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat.id)}
              className="rounded-full"
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Products grid */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-0 bg-muted/30 shadow-sm transition-all hover:shadow-md">
              <div className="aspect-square w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden">
                <div className="text-6xl opacity-20 select-none">
                  {product.category === "dresses" ? "👗" : product.category === "rompers" ? "🦺" : product.category === "tops" ? "👕" : product.category === "bottoms" ? "👖" : "🧥"}
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs bg-white/80 text-foreground">New</Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                  {product.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold">${product.price}</span>
                  <div className="flex gap-1">
                    {product.colors.map((color) => (
                      <span
                        key={color.name}
                        className="inline-block h-4 w-4 rounded-full border border-border"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{product.material}</p>
                <div className="mt-3 flex gap-2">
                  <Link href={`/collections/${product.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Details
                    </Button>
                  </Link>
                  <Button size="sm" className="text-xs" onClick={() => handleQuickAdd(product)}>
                    <ShoppingBag className="mr-1 h-3 w-3" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}