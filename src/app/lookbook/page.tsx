"use client";

import { useState } from "react";
import { lookbookLooks } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default function LookbookPage() {
  const [activeLook, setActiveLook] = useState<number | null>(null);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-accent/20 via-primary/5 to-secondary/20 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Lookbook</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Styling inspiration for every season. See how Kindred Kids pieces come together.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {lookbookLooks.map((look) => (
            <button
              key={look.id}
              className="group relative overflow-hidden rounded-2xl bg-muted/30 text-left transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setActiveLook(activeLook === look.id ? null : look.id)}
            >
              <div className="aspect-[4/5] w-full bg-gradient-to-br from-accent/20 via-primary/10 to-secondary/10 flex items-center justify-center relative">
                <div className="text-6xl opacity-20 select-none">
                  {["🌸", "🏖️", "🍂", "☁️", "🌷", "⭐"][look.id - 1]}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold group-hover:text-primary transition-colors">{look.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{look.description}</p>
              </div>

              {/* Expanded detail */}
              {activeLook === look.id && (
                <div className="px-4 pb-4 space-y-2 animate-in slide-in-from-top-2">
                  <Badge variant="secondary" className="text-xs">Featured Look</Badge>
                  <p className="text-xs text-muted-foreground">
                    Style this look with our curated accessories and layering pieces. 
                    All items available in the collection.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {look.description.split(" + ").map((item) => (
                      <Badge key={item} variant="outline" className="text-xs bg-background">
                        {item.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted/20 border-t border-border/40 py-12">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight">Create Your Own Look</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Mix and match from our collections to build the perfect outfit for your little one.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a
              href="/collections"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Shop Now
            </a>
            <a
              href="/sustainability"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Our Story
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}