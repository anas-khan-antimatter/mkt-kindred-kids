import { Leaf, Heart, Recycle, TreePine, ShieldCheck, Globe } from "lucide-react";

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
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-green-200/30" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-emerald-200/30" />
      </section>

      {/* Impact stats */}
      <section className="mx-auto max-w-7xl px-4 -mt-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Trees Planted", value: "12,000+", icon: TreePine },
            { label: "Organic Cotton", value: "100%", icon: Leaf },
            { label: "Plastic-Free Orders", value: "100%", icon: Recycle },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-white shadow-sm border border-border/40 p-6 text-center"
            >
              <stat.icon className="mx-auto h-6 w-6 text-green-600" />
              <p className="mt-3 text-3xl font-bold text-green-700">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
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
      <section className="border-t border-border/40 bg-green-50/50 py-16">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight">Join the Kindred Circle</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Return outgrown Kindred Kids pieces for store credit and help us give them a second life.
          </p>
          <div className="mt-6">
            <a
              href="/collections"
              className="inline-flex h-10 items-center justify-center rounded-md bg-green-700 px-6 text-sm font-medium text-white shadow transition-colors hover:bg-green-800"
            >
              Shop the Collection
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}