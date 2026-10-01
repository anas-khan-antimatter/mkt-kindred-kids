"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Heart, ShoppingBag, Star, PartyPopper, Cloud, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { collections } from "@/lib/data";

/* ── Floating decorations ── */
const heroIcons = [
  { char: "🦋", x: 8, y: 12, spin: true },
  { char: "🌻", x: 72, y: 8, spin: true },
  { char: "🐞", x: 88, y: 55, spin: false },
  { char: "☁️", x: 15, y: 60, spin: false },
  { char: "🌈", x: 55, y: 78, spin: false },
  { char: "⭐", x: 30, y: 22, spin: true },
  { char: "🌸", x: 82, y: 82, spin: true },
  { char: "🦊", x: 48, y: 18, spin: false },
];

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
    href: "/weight",
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
    desc: "Tell us the mood & weather for a perfect coordinated look.",
    href: "/outfit-suggester",
    label: "Style Magic",
  },
  {
    emoji: "🌍",
    title: "Our Promise",
    desc: "Every order plants a tree. See our impact.",
    href: "/sustainability",
    label: "Learn More",
  },
];

/* ── Animated counter ── */
function AnimatedNumber({ n, suffix = "" }: { n: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let val = 0;
    const step = Math.ceil(n / 40);
    const timer = setInterval(() => {
      val += step;
      if (val >= n) { val = n; clearInterval(timer); }
      setCount(val);
    }, 30);
    return () => clearInterval(timer);
  }, [n]);
  return <>{count}{suffix}</>;
}

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-denim-wash px-4 py-24 sm:px-6 sm:py-36 lg:px-8">
        {/* Floating animated icons */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {heroIcons.map((icon, i) => (
            <span
              key={i}
              className={`absolute text-3xl sm:text-4xl opacity-25 transition-transform duration-700 ${icon.spin ? "animate-spin" : "animate-bounce"}`}
              style={{
                top: `${icon.y}%`,
                left: `${icon.x}%`,
                animationDuration: `${8 + i * 2}s`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              {icon.char}
            </span>
          ))}
        </div>

        {/* Decorative geometric shapes */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-white/[0.04]" />
        <div className="absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-white/[0.04]" />
        <div className="absolute top-1/4 left-1/3 h-24 w-24 rounded-full bg-amber-200/5" />
        <div className="absolute bottom-1/4 right-1/4 h-16 w-16 rotate-45 border-2 border-white/5" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4 bg-white/15 text-white hover:bg-white/25 border-0 backdrop-blur-sm px-5 py-1.5 rounded-full">
              <Sparkles className="mr-1.5 h-3 w-3" />
              New Spring Meadow Collection
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
              Dressed for
              <span className="block mt-2 bg-gradient-to-r from-amber-200 via-yellow-100 to-white bg-clip-text text-transparent">
                wild adventures
              </span>
            </h1>
            <p className="mt-5 text-lg leading-8 text-white/70 max-w-lg mx-auto">
              Playful, sustainable children&apos;s clothing — soft on their skin, kind to the planet,
              and tough enough for every muddy puddle and tree climb.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-cream-warm border-0 text-foreground hover:brightness-95 shadow-xl rounded-full px-8 py-6 text-base">
                <Link href="/collections">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/25 text-white hover:bg-white/10 rounded-full px-8 py-6 text-base">
                <Link href="/lookbook">
                  View Lookbook
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STAT STRIP ─── */}
      <section className="bg-card-soft border-y border-border/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { icon: "🌱", val: 5000, label: "Trees Planted", suffix: "+" },
              { icon: "🧒", val: 12, label: "Age Range (months)", suffix: "–8 yrs" },
              { icon: "♻️", val: 98, label: "Happy Families", suffix: "%" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-2xl mb-1">{stat.icon}</span>
                <span className="text-2xl font-bold text-primary">
                  <AnimatedNumber n={stat.val} suffix={stat.suffix} />
                </span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLAYFUL FEATURES ROW ─── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {playFeatures.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="group relative overflow-hidden rounded-2xl bg-card-soft p-5 text-center transition-all duration-300 hover:shadow-bouncy hover:-translate-y-1"
            >
              {/* Hover border accent */}
              <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <span className="text-4xl block mb-2 transition-transform duration-300 group-hover:scale-110">{f.emoji}</span>
              <h3 className="font-semibold text-sm">{f.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
              <span className="mt-2 inline-flex text-xs font-medium text-primary items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                {f.label}
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED COLLECTIONS ─── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 badge-pill mb-3">
            <Star className="h-3 w-3" />
            Seasonal Stories
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gradient-denim">Our Collections</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Four seasonal worlds, each designed for a different kind of childhood magic.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection, idx) => (
            <Link key={collection.id} href={`/collections?collection=${collection.slug}`}>
              <Card className="group h-full overflow-hidden border-0 shadow-soft transition-all duration-300 hover:shadow-bouncy hover:-translate-y-1.5">
                <div className="aspect-[4/3] w-full bg-card-soft flex items-center justify-center relative overflow-hidden">
                  <span className="text-6xl opacity-70 select-none transition-all duration-500 group-hover:scale-125 group-hover:opacity-100">
                    {["🌿", "🌊", "🍂", "⭐"][idx]}
                  </span>
                  {/* Corner dots */}
                  <div className="absolute bottom-3 right-3 flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full bg-primary/15" />
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

        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/collections">
              Explore All Collections
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ─── VALUES SECTION ─── */}
      <section className="bg-card-soft/50 border-y border-border/20 py-20">
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

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valueCards.map((value) => (
              <div key={value.title} className="rounded-2xl bg-card-soft p-6 text-center transition-all duration-300 hover:shadow-soft hover:-translate-y-0.5">
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
        <div className="rounded-3xl bg-caramel-fade p-8 sm:p-14 relative overflow-hidden">
          <span className="absolute -top-6 -right-6 text-6xl opacity-20 select-none animate-bounce" style={{ animationDuration: "3s" }}>🎁</span>
          <span className="absolute -bottom-6 -left-6 text-6xl opacity-20 select-none animate-bounce" style={{ animationDuration: "4s", animationDelay: "0.5s" }}>✨</span>
          <div className="absolute top-1/2 right-10 h-32 w-32 rounded-full bg-white/5" />
          <div className="absolute bottom-10 left-20 h-20 w-20 rotate-45 border-2 border-white/5" />

          <div className="mx-auto max-w-xl text-center relative">
            <span className="inline-flex items-center gap-2 bg-white/20 text-white backdrop-blur-sm rounded-full px-4 py-1 text-xs font-medium mb-3">
              <PartyPopper className="h-3 w-3" />
              Gift Finder
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Not sure what to get?
            </h2>
            <p className="mt-4 text-white/70 max-w-md mx-auto">
              Take our quick Gift Finder quiz and we&apos;ll match your little one with the perfect pieces — in under 60 seconds.
            </p>
            <Button asChild size="lg" className="mt-6 shadow-xl bg-cream-warm text-foreground hover:brightness-95 border-0 rounded-full px-8">
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
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Link href="/weight" className="group grid gap-6 sm:grid-cols-2 items-center rounded-2xl bg-card-soft p-6 sm:p-8 transition-all duration-300 hover:shadow-bouncy hover:-translate-y-0.5">
          <div className="rounded-xl bg-cream-warm p-6 text-center order-2 sm:order-1">
            <span className="text-6xl block mb-2 transition-transform duration-300 group-hover:scale-110">📏</span>
            <p className="text-xs text-muted-foreground mt-1">Height &bull; Weight &bull; Age</p>
          </div>
          <div className="text-center sm:text-left order-1 sm:order-2">
            <Badge className="mb-2 text-xs bg-accent/20 text-accent-foreground border-0">New Tool</Badge>
            <h2 className="text-2xl font-bold sm:text-3xl">Size Recommender</h2>
            <p className="mt-2 text-muted-foreground">
              Not sure which size fits? Enter your child&apos;s height and weight and we&apos;ll tell you in a snap.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline transition-all">
              Find Their Size <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="border-t border-border/20 bg-editorial py-16">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <span className="text-4xl block mb-3">✉️</span>
          <h2 className="text-2xl font-bold sm:text-3xl">Join the Kindred Crew</h2>
          <p className="mt-2 text-muted-foreground text-sm max-w-sm mx-auto">
            Be the first to know about new collections, early access, and little adventures.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
              required
            />
            <Button type="submit" className="rounded-xl shrink-0">
              <Sparkles className="mr-2 h-4 w-4" />
              Subscribe
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            No spam. Unsubscribe anytime. We respect your inbox 🌿
          </p>
        </div>
      </section>
    </div>
  );
}