"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { sizeChart } from "@/lib/data";
import { Ruler, ArrowRight, RotateCcw } from "lucide-react";

export default function SizeGuidePage() {
  const [tab, setTab] = useState("kids");

  // Size recommender state
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [recommended, setRecommended] = useState<string | null>(null);
  const [recoDetails, setRecoDetails] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRecommend = async () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/size", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ height: h, weight: w }),
      });
      if (res.ok) {
        const data = await res.json();
        setRecommended(data.size);
        setRecoDetails(data.details);
      } else {
        const err = await res.json().catch(() => ({ error: "Server error" }));
        setError(err.error);
      }
    } catch {
      setError("Could not connect. Please try again.");
    }
    setLoading(false);
  };

  const resetRecommender = () => {
    setHeight("");
    setWeight("");
    setRecommended(null);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary/10 via-accent/10 to-primary/10 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Badge className="mb-3 bg-accent/20 text-accent-foreground border-0">New Tool</Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Size Guide &amp; Recommender</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Find the perfect fit for your little one. Use our interactive tool or browse the size chart.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ── Size Recommender ── */}
        <Card className="mb-12 border-2 border-dashed border-primary/20 bg-primary/[0.02] shadow-soft">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Ruler className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Size Recommender</h2>
                <p className="text-sm text-muted-foreground">Enter height &amp; weight to get an instant recommendation</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Height (inches)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 42"
                    min="0"
                    step="0.5"
                    className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Weight (lbs)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 38"
                    min="0"
                    step="0.5"
                    className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button onClick={handleRecommend} disabled={!height || !weight} className="rounded-full">
                <Ruler className="mr-2 h-4 w-4" />
                Find Size
              </Button>
              <Button variant="ghost" size="sm" onClick={resetRecommender} className="text-xs">
                <RotateCcw className="mr-1 h-3 w-3" />
                Reset
              </Button>
            </div>

            {loading && (
              <div className="mt-6 flex items-center justify-center py-4">
                <p className="text-sm text-muted-foreground animate-pulse">Checking sizes…</p>
              </div>
            )}
            {error && (
              <div className="mt-6 rounded-xl bg-destructive/10 border border-destructive/30 p-4">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            {recommended && !loading && (
              <div className="mt-6 rounded-xl bg-primary/5 border border-primary/20 p-4">
                <p className="text-sm text-muted-foreground">Recommended size:</p>
                <p className="text-3xl font-bold text-primary mt-1">{recommended}</p>
                {recoDetails && (
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div><span className="font-semibold">Height:</span> {recoDetails.height}</div>
                    <div><span className="font-semibold">Weight:</span> {recoDetails.weight}</div>
                    <div><span className="font-semibold">Chest:</span> {recoDetails.chest}</div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Based on a height of {height}&quot; and weight of {weight} lbs
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── How to measure ── */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">How to Measure</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-0 bg-pastel-card shadow-soft">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">📏</div>
                <h3 className="font-medium text-sm">Height</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Measure from top of head to heel with child standing straight.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-pastel-card shadow-soft">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-medium text-sm">Chest</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Measure around the fullest part of the chest, under the arms.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-pastel-card shadow-soft">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🌀</div>
                <h3 className="font-medium text-sm">Waist</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Measure around the natural waistline, usually just above the belly button.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Size chart ── */}
        <Tabs defaultValue="kids" value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="kids">Kids (2T–8)</TabsTrigger>
            <TabsTrigger value="infants">Infants (0–24M)</TabsTrigger>
          </TabsList>

          <TabsContent value="kids">
            <div className="overflow-x-auto rounded-xl border border-border/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="py-3 px-4 text-left font-semibold">Size</th>
                    <th className="py-3 px-4 text-left font-semibold">Height</th>
                    <th className="py-3 px-4 text-left font-semibold">Weight</th>
                    <th className="py-3 px-4 text-left font-semibold">Chest</th>
                    <th className="py-3 px-4 text-left font-semibold">Waist</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.kids.map((row) => (
                    <tr key={row.size} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-medium">{row.size}</td>
                      <td className="py-3 px-4 text-muted-foreground">{row.height}</td>
                      <td className="py-3 px-4 text-muted-foreground">{row.weight}</td>
                      <td className="py-3 px-4 text-muted-foreground">{row.chest}</td>
                      <td className="py-3 px-4 text-muted-foreground">{row.waist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="infants">
            <div className="overflow-x-auto rounded-xl border border-border/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="py-3 px-4 text-left font-semibold">Size</th>
                    <th className="py-3 px-4 text-left font-semibold">Height</th>
                    <th className="py-3 px-4 text-left font-semibold">Weight</th>
                    <th className="py-3 px-4 text-left font-semibold">Chest</th>
                    <th className="py-3 px-4 text-left font-semibold">Waist</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.infants.map((row) => (
                    <tr key={row.size} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-medium">{row.size}</td>
                      <td className="py-3 px-4 text-muted-foreground">{row.height}</td>
                      <td className="py-3 px-4 text-muted-foreground">{row.weight}</td>
                      <td className="py-3 px-4 text-muted-foreground">{row.chest}</td>
                      <td className="py-3 px-4 text-muted-foreground">{row.waist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Fit notes */}
        <div className="mt-10 rounded-xl bg-pastel-card p-6 border border-border/30">
          <h3 className="font-semibold mb-2">Fit Notes</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Our clothes are designed with room to grow — most styles have adjustable features and a relaxed fit.</li>
            <li>• If your child is between sizes, we recommend sizing up for longevity.</li>
            <li>• Machine washable fabrics may shrink slightly — cold wash and tumble dry low is best.</li>
            <li>• Need help? Email us at hello@kindredkids.com and we&apos;ll help you find the perfect size.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}