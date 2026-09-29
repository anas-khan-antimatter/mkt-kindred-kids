"use client";

import Link from "next/link";
import { ArrowRight, Leaf, Heart, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { collections } from "@/lib/data";

const values = [
  {
    icon: Leaf,
    title: "100% Organic",
    description: "All materials are GOTS-certified organic cotton or responsibly sourced linen.",
  },
  {
    icon: Heart,
    title: "Ethically Made",
    description: "We partner with fair-wage factories and artisan cooperatives around the world.",
  },
  {
    icon: Sparkles,
    title: "Designed to Last",
    description: "Reinforced seams, adjustable fits, and timeless designs that hand down beautifully.",
  },
  {
    icon: Shield,
    title: "Low-Impact Dyes",
    description: "Our colors come from low-impact, non-toxic dyes that are safe for kids and the planet.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-gradient px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-0">
              New Spring Collection
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Dressed for
              <span className="block text-gradient bg-gradient-to-r from-yellow-200 via-pink-200 to-blue-200">
                wild adventures
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/80">
              Playful, sustainable children&apos;s clothing made with organic materials.
              Every piece is designed to spark joy and stand up to the elements.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90 shadow-lg">
                <Link href="/collections">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                <Link href="/lookbook">View Lookbook</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5" />
      </section>

      {/* Featured Collections */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Collections</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Seasonal stories crafted for every kind of childhood adventure.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection) => (
            <Link key={collection.id} href={`/collections?collection=${collection.slug}`}>
              <Card className="group h-full overflow-hidden border-0 bg-muted/50 shadow-sm transition-all hover:shadow-md">
                <div className="aspect-[4/3] w-full bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="text-4xl mb-2">
                      {collection.id === "meadow" ? "🌿" : collection.id === "seaside" ? "🌊" : collection.id === "harvest" ? "🍂" : "⭐"}
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{collection.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{collection.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="/collections">
              Explore All Collections
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Made with Meaning</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Every stitch, every seam — we care about how our clothes are made.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link href="/sustainability">
                Read Our Story
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Gift Finder CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-accent/30 via-primary/5 to-secondary/10 p-8 sm:p-12">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Not sure what to get?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Take our quick Gift Finder quiz and we&apos;ll match your little one with the perfect pieces.
            </p>
            <Button asChild size="lg" className="mt-6 shadow-md">
              <Link href="/gift-finder">
                Take the Quiz
                <Sparkles className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-border/40 bg-muted/20 py-16">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight">Join the Kindred</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Be the first to hear about new collections, special offers, and playtime inspiration.
          </p>
          <form className="mt-6 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}