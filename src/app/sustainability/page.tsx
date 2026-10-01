"use client";

import { useEffect, useState, useRef } from "react";
import { Leaf, Heart, Recycle, TreePine, ShieldCheck, Globe, Sparkles, ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/* ── Animated counter (IntersectionObserver) ── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const duration = 1500;
          const steps = 30;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── Accordion item ── */
function StoryAccordion({
  icon: Icon,
  title,
  description,
  emoji,
}: {
  icon: any;
  title: string;
  description: string;
  emoji: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-2xl border transition-all duration-300 ${open ? "border-primary/30 bg-card-soft shadow-soft" : "border-border/30 bg-card-soft/50 hover:bg-card-soft"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Tap to learn more</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="h-px bg-border/30 mb-4" />
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      )}
    </div>
  );
}

const stories = [
  {
    icon: Leaf,
    emoji: "🌱",
    title: "Organic from the Start",
    description:
      "Every Kindred Kids garment begins with GOTS-certified organic cotton or responsibly sourced linen. No synthetic pesticides, no chemical fertilizers — just pure, breathable fabrics that are gentle on sensitive skin and the earth.",
  },
  {
    icon: Heart,
    emoji: "🤝",
    title: "Ethical Manufacturing",
    description:
      "We partner with fair-wage factories and women-led artisan cooperatives in India, Portugal, and Turkey. Every person in our supply chain is paid fairly, works in safe conditions, and is treated with dignity and respect.",
  },
  {
    icon: Recycle,
    emoji: "♻️",
    title: "Circular by Design",
    description:
      "We design for longevity — reinforced seams, adjustable fits, and timeless styles that survive multiple children. Our Kindred Circle program lets you return outgrown pieces for store credit. We clean, repair, and resell them or recycle the fibers.",
  },
  {
    icon: TreePine,
    emoji: "🌳",
    title: "One Tree Per Order",
    description:
      "For every order placed, we plant a tree through our partnership with reforestation organizations. So far, our Kindred community has planted over 12,000 trees across deforested regions in Madagascar and Brazil.",
  },
  {
    icon: ShieldCheck,
    emoji: "🎨",
    title: "Low-Impact Dyes & Finishes",
    description:
      "Our colors come from low-impact, OEKO-TEX-certified dyes. We never use heavy metals, formaldehyde, or toxic finishes. The water from our dye houses is treated and recycled — nothing toxic enters local waterways.",
  },
  {
    icon: Globe,
    emoji: "📦",
    title: "Plastic-Free Packaging",
    description:
      "Every order ships in 100% post-consumer recycled cardboard boxes with paper tape. Our mailers are compostable, and we include a seed paper note you can plant to grow wildflowers.",
  },
];

const timeline = [
  { year: "2019", event: "Kindred Kids founded with a mission to make sustainable kiddswear accessible" },
  { year: "2020", event: "First collection launches — 100% organic cotton, 3 styles" },
  { year: "2021", event: "Partnered with One Tree Planted; 500 trees planted in year one" },
  { year: "2022", event: "Opened women-led artisan cooperative in Jaipur, India" },
  { year: "2023", event: "Launch Kindred Circle recycling program; 5,000 trees milestone" },
  { year: "2024", event: "GOTS-certified for all cotton; OEKO-TEX for all dyes" },
  { year: "2025", event: "12,000+ trees planted; plastic-free packaging achieved" },
];

export default function SustainabilityPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-denim-wash px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4 bg-white/15 text-white border-0 backdrop-blur-sm">
              <Sparkles className="mr-1 h-3 w-3" />
              Our Promise
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Made with Love,
              <span className="block mt-2 bg-gradient-to-r from-amber-200 via-yellow-100 to-white bg-clip-text text-transparent">
                Built to Last
              </span>
            </h1>
            <p className="mt-4 text-lg text-white/70 max-w-lg mx-auto">
              We believe the best clothes for kids are the ones that are kind to them — and to the planet.
              Here&apos;s how we make that real, every single day.
            </p>
          </div>
        </div>
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/5" />
        <div className="absolute top-1/3 left-1/4 h-20 w-20 rounded-full bg-amber-200/5" />
      </section>

      {/* Impact stats — animated */}
      <section className="mx-auto max-w-7xl px-4 -mt-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-card-soft shadow-soft border border-border/30 p-6 text-center transition-all hover:shadow-bouncy">
            <span className="text-3xl block">🌳</span>
            <p className="mt-3 text-3xl font-bold text-primary">
              <AnimatedCounter target={12000} suffix="+" />
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Trees Planted</p>
          </div>
          <div className="rounded-xl bg-card-soft shadow-soft border border-border/30 p-6 text-center transition-all hover:shadow-bouncy">
            <span className="text-3xl block">🌿</span>
            <p className="mt-3 text-3xl font-bold text-primary">
              <AnimatedCounter target={100} suffix="%" />
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Organic Cotton</p>
          </div>
          <div className="rounded-xl bg-card-soft shadow-soft border border-border/30 p-6 text-center transition-all hover:shadow-bouncy">
            <span className="text-3xl block">♻️</span>
            <p className="mt-3 text-3xl font-bold text-primary">
              <AnimatedCounter target={100} suffix="%" />
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Plastic-Free Packaging</p>
          </div>
        </div>
      </section>

      {/* Story accordions */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <Badge className="badge-pill mb-3 bg-primary/10 text-primary border-0">Our Impact</Badge>
          <h2 className="text-2xl font-bold sm:text-3xl">How We Make a Difference</h2>
          <p className="mt-2 text-muted-foreground text-sm max-w-md mx-auto">
            Tap each story to learn more about our commitments.
          </p>
        </div>
        <div className="space-y-3">
          {stories.map((story) => (
            <StoryAccordion key={story.title} {...story} />
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-card-soft/70 border-y border-border/20 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <span className="text-3xl block mb-2">📅</span>
            <h2 className="text-2xl font-bold sm:text-3xl">Our Journey</h2>
            <p className="mt-2 text-muted-foreground text-sm">Key milestones on our path to a kinder future</p>
          </div>
          <div className="space-y-4">
            {timeline.map((item, idx) => (
              <div key={item.year} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {idx + 1}
                  </div>
                  {idx < timeline.length - 1 && <div className="mt-1 h-full w-px bg-primary/20" />}
                </div>
                <div className="pb-6">
                  <span className="text-sm font-bold text-primary">{item.year}</span>
                  <p className="text-sm text-muted-foreground mt-0.5">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-caramel-fade p-8 sm:p-12 relative overflow-hidden">
          <span className="absolute -bottom-6 -right-6 text-7xl opacity-10 select-none">🌍</span>
          <span className="absolute -top-4 -left-4 text-5xl opacity-10 select-none rotate-45">♻️</span>
          <div className="mx-auto max-w-xl text-center relative">
            <span className="inline-flex items-center gap-2 bg-white/20 text-white backdrop-blur-sm rounded-full px-4 py-1 text-xs font-medium mb-3">
              <Sparkles className="h-3 w-3" />
              Join the Movement
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Every purchase plants a tree
            </h2>
            <p className="mt-4 text-white/70 max-w-md mx-auto text-sm">
              When you shop Kindred Kids, you&apos;re not just dressing your little one — you&apos;re helping restore forests, support fair wages, and build a cleaner future for every child.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-cream-warm text-foreground hover:brightness-95 border-0 rounded-full shadow-xl">
                <Link href="/collections">
                  <Leaf className="mr-2 h-4 w-4" />
                  Shop Sustainably
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}