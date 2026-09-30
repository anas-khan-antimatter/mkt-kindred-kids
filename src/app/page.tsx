"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Heart, ShoppingBag, Bird, Star, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { collections } from "@/lib/data";

/* ── Illustrated hero icons ── */
const heroIcons = ["🦋", "🌻", "🐞", "☁️", "🌈", "⭐", "🌸", "🦊"];

const valueCards = [
  {
    emoji: "🌿",
    title: "100% Organic",
    description: "GOTS-certified organic cotton & responsibly sourced linen — gentle on skin and planet.",
  },
  {
    emoji: "🧵",
    title: "Ethically Made",
    description: "Fair-wage factories & artisan cooperatives where every maker is valued.",
  },
  {
    emoji: "💪",
    title: "Built to Last",
    description: "Reinforced seams, adjustable fits, and timeless designs that hand down beautifully.",
  },
  {
    emoji: "🎨",
    title: "Safe Colors",
    description: "Low-impact, non-toxic OEKO-TEX dyes — nothing yucky near your little one.",
  },
];

const playFeatures = [
  {
    emoji: "🤷",
    title: "Not sure what fits?",
    desc: "Use our Size Recommender — just tell us height & weight.",
    href: "/size-guide",
    label: "Find Their Size",
  },
  {
    emoji: "🎁",
    title: "Gift Finder Quiz",
    desc: "Answer 4 quick questions for the perfect match.",
    href: "/gift-finder",
    label: "Take the Quiz",
  },
  {
    emoji: "✨",
    title: "Outfit Suggester",
    desc: "Mix & match pieces into dream outfits.",
    href: "/lookbook",
    label: "Get Inspired",
  },
  {
    emoji: "🌍",
    title: "Our Promise",
    desc: "Every order plants a tree. See our impact.",
    href: "/sustainability",
    label: "Learn More",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-brand-gradient px-4 py-24 sm:px-6 sm:py-36 lg:px-8">
        {/* Floating illustrated icons */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {heroIcons.map((icon, i) => (
            <span
              key={i}
              className="absolute text-4xl opacity-30"
              style={{
                top: `${10 + (i * 9) % 80}%`,
                left: `${5 + (i * 13) % 90}%`,
                transform: `rotate(${i * 18}deg)`,
              }}
            >
              {icon}
            </span>
          ))}
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-0 backdrop-blur-sm px-5 py-1">
              <Sparkles className="mr-1 h-3 w-3" />
              New Spring Meadow Collection
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Dressed for
              <span className="block text-gradient mt-2">
                wild adventures
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/80 max-w-lg mx-auto">
              Playful, sustainable children&apos;s clothing — soft on their skin, kind to the planet,
              and tough enough for every muddy puddle and tree climb.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90 shadow-xl rounded-full px-8">
                <Link href="/collections">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full">
                <Link href="/lookbook">
                  View Lookbook
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Pastel decorative blobs */}
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-white/5" />
        <div className="absolute top-1/3 left-1/4 h-32 w-32 rounded-full bg-yellow-200/10" />
      </section>

      {/* ─── PLAYFUL FEATURES ROW ─── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {playFeatures.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="group rounded-2xl bg-pastel-card border-2 border-dashed border-current/20 p-5 text-center transition-all hover:shadow-soft hover:-translate-y-0.5"
            >
              <span className="text-4xl block mb-2">{f.emoji}</span>
              <h3 className="font-semibold text-sm">{f.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
              <span className="mt-2 inline-flex text-xs font-medium text-primary items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {f.label}
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED COLLECTIONS ─── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 badge-pill mb-3">
            <Star className="h-3 w-3" />
            Seasonal Stories
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gradient">Our Collections</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Four seasonal worlds, each designed for a different kind of childhood magic.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection, idx) => (
            <Link key={collection.id} href={`/collections?collection=${collection.slug}`}>
              <Card className="group h-full overflow-hidden border-0 shadow-soft transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="aspect-[4/3] w-full bg-pastel-card flex items-center justify-center relative overflow-hidden">
                  <span className="text-6xl opacity-80 select-none transition-transform group-hover:scale-110 duration-300">
                    {["🌿", "🌊", "🍂", "⭐"][idx]}
                  </span>
                  {/* Decorative dots */}
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full bg-current/20" />
                    ))}
                  </div>
                </div>
                <CardContent className="p-4 sm:p-5">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{collection.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{collection.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/collections">
              Explore All Collections
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ─── VALUES WITH ILLUSTRATED ICONS ─── */}
      <section className="bg-muted/20 border-t border-border/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 badge-pill mb-3">
              <Heart className="h-3 w-3" />
              Made with Meaning
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Thoughtfully Made</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Every stitch, every seam — we care about how our clothes are made.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {valueCards.map((value) => (
              <div key={value.title} className="rounded-2xl bg-pastel-card p-6 text-center transition-all hover:shadow-soft">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                  {value.emoji}
                </div>
                <h3 className="font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GIFT FINDER CTA ─── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-brand-warm p-8 sm:p-12 relative overflow-hidden">
          {/* Decorative floating icons */}
          <span className="absolute -top-4 -right-4 text-5xl opacity-30 select-none">🎁</span>
          <span className="absolute -bottom-4 -left-4 text-5xl opacity-30 select-none">✨</span>

          <div className="mx-auto max-w-xl text-center relative">
            <span className="inline-flex items-center gap-2 bg-white/20 text-white backdrop-blur-sm rounded-full px-4 py-1 text-xs font-medium mb-3">
              <PartyPopper className="h-3 w-3" />
              Gift Finder
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Not sure what to get?
            </h2>
            <p className="mt-4 text-white/70">
              Take our quick Gift Finder quiz and we&apos;ll match your little one with the perfect pieces — in under 60 seconds.
            </p>
            <Button asChild size="lg" className="mt-6 shadow-xl bg-white text-foreground hover:bg-white/90 rounded-full">
              <Link href="/gift-finder">
                <Sparkles className="mr-2 h-4 w-4" />
                Take the Quiz
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── SIZE RECOMMENDER TEASER ─── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Link href="/size-guide" className="group grid gap-6 sm:grid-cols-2 items-center">
          <div className="rounded-2xl bg-pastel-card p-6 text-center">
            <span className="text-6xl block mb-2">📏</span>
          </div>
          <div className="text-center sm:text-left">
            <Badge className="mb-2 text-xs bg-accent/20 text-accent-foreground border-0">New Tool</Badge>
            <h2 className="text-2xl font-bold sm:text-3xl">Size Recommender</h2>
            <p className="mt-2 text-muted-foreground">
              Not sure which size fits? Enter your child&apos;s height and weight and we&apos;ll tell you in a snap.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
              Find Their Size <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="border-t border-border/30 bg-pastel-card py-16">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <span className="text-4xl block mb-2">✉️</span>
          <h2 className="text-2xl font-bold tracking-tight">Join the Kindred</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Be the first to hear about new collections, special offers, and playtime inspiration.
          </p>
          <form className="mt-6 flex gap-3 max-w-sm mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="flex h-11 w-full rounded-full border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="submit" className="rounded-full px-6">
              <Bird className="mr-2 h-4 w-4" />
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}