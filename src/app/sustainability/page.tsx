"use client";

import { useEffect, useState, useRef } from "react";
import { Leaf, Heart, Recycle, TreePine, ShieldCheck, Globe } from "lucide-react";

/* ── Animated counter ── */
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

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

const stories = [
  {
    icon: Leaf,
    title: "Organic from the Start",
    description:
      "Every Kindred Kids garment begins with GOTS-certified organic cotton or responsibly sourced linen. No synthetic pesticides, no chemical fertilizers — just pure, breathable fabrics that are gentle on sensitive skin and the earth.",
  },
  {
    icon: Heart,
    title: "Ethical Manufacturing",
    description:
      "We partner with fair-wage factories and women-led artisan cooperatives in India, Portugal, and Turkey. Every person in our supply chain is paid fairly, works in safe conditions, and is treated with dignity and respect.",
  },
  {
    icon: Recycle,
    title: "Circular by Design",
    description:
      "We design for longevity — reinforced seams, adjustable fits, and timeless styles that survive multiple children. Our Kindred Circle program lets you return outgrown pieces for store credit. We clean, repair, and resell them or recycle the fibers.",
  },
  {
    icon: TreePine,
    title: "One Tree Per Order",
    description:
      "For every order placed, we plant a tree through our partnership with reforestation organizations. So far, our Kindred community has planted over 12,000 trees across deforested regions in Madagascar and Brazil.",
  },
  {
    icon: ShieldCheck,
    title: "Low-Impact Dyes & Finishes",
    description:
      "Our colors come from low-impact, OEKO-TEX-certified dyes. We never use heavy metals, formaldehyde, or toxic finishes. The water from our dye houses is treated and recycled — nothing toxic enters local waterways.",
  },
  {
    icon: Globe,
    title: "Plastic-Free Packaging",
    description:
      "Every order ships in 100% post-consumer recycled cardboard boxes with paper tape. Our mailers are compostable, and we include a seed paper note you can plant to grow wildflowers.",
  },
];

export default function SustainabilityPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Made with Love,<br />
              <span className="text-green-700">Built to Last</span>
            </h1>
            <p className="mt-4 text-lg text-green-800/70 max-w-lg mx-auto">
              We believe the best clothes for kids are the ones that are kind to them — and to the planet.
              Here&apos;s how we make that real, every single day.
            </p>
          </div>
        </div>
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-green-200/30" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-emerald-200/30" />
      </section>

      {/* Impact stats — animated */}
      <section className="mx-auto max-w-7xl px-4 -mt-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white shadow-sm border border-border/30 p-6 text-center">
            <TreePine className="mx-auto h-6 w-6 text-green-600" />
            <p className="mt-3 text-3xl font-bold text-green-700">
              <AnimatedCounter target={12000} suffix="+" />
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Trees Planted</p>
          </div>
          <div className="rounded-xl bg-white shadow-sm border border-border/30 p-6 text-center">
            <Leaf className="mx-auto h-6 w-6 text-green-600" />
            <p className="mt-3 text-3xl font-bold text-green-700">
              <AnimatedCounter target={100} suffix="%" />
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Organic Cotton</p>
          </div>
          <div className="rounded-xl bg-white shadow-sm border border-border/30 p-6 text-center">
            <Recycle className="mx-auto h-6 w-6 text-green-600" />
            <p className="mt-3 text-3xl font-bold text-green-700">
              <AnimatedCounter target={100} suffix="%" />
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Plastic-Free Orders</p>
          </div>
        </div>
      </section>

      {/* Stories grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Our Commitments</h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            Sustainability isn&apos;t a marketing line — it&apos;s woven into everything we make.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((item) => (
            <div key={item.title} className="group">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-700 group-hover:bg-green-200 transition-colors">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/30 bg-green-50/50 py-16">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight">Join the Kindred Circle</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Return outgrown Kindred Kids pieces for store credit and help us give them a second life.
          </p>
          <div className="mt-6">
            <a
              href="/collections"
              className="inline-flex h-10 items-center justify-center rounded-full bg-green-700 px-6 text-sm font-medium text-white shadow transition-colors hover:bg-green-800"
            >
              Shop the Collection
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}