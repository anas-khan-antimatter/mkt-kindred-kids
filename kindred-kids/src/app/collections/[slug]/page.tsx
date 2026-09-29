"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { products } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

export default function ProductDetailPage() {
  const params = useParams();
  const product = products.find((p) => p.id === params.slug);
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] ?? { name: "", hex: "" });
  const [added, setAdded] = useState(false);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor.name,
      image: product.image,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Link
        href="/collections"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Collections
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="aspect-[4/5] w-full rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 flex items-center justify-center">
          <div className="text-8xl opacity-30 select-none">
            {product.category === "dresses"
              ? "👗"
              : product.category === "rompers"
              ? "🦺"
              : product.category === "tops"
              ? "👕"
              : product.category === "bottoms"
              ? "👖"
              : "🧥"}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2 capitalize">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="mt-2 text-2xl font-bold text-primary">${product.price}</p>
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <Separator />

          {/* Color selector */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Color: <span className="font-normal">{selectedColor.name}</span></h3>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    selectedColor.name === color.name
                      ? "border-primary scale-110"
                      : "border-border hover:border-muted-foreground"
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
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Size</h3>
              <Link href="/size-guide" className="text-xs text-primary hover:underline">
                Size Guide
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  size="sm"
                  className="min-w-[48px]"
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Material & Details */}
          <div className="space-y-3">
            <p className="text-sm">
              <span className="font-semibold">Material:</span> {product.material}
            </p>
            <ul className="space-y-1">
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
            className={`w-full text-base transition-all ${added ? "bg-green-600 hover:bg-green-700" : ""}`}
            onClick={handleAddToCart}
          >
            {added ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                Added to Bag!
              </>
            ) : (
              <>
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Bag
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}