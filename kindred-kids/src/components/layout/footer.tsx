import Link from "next/link";

const footerLinks = [
  { href: "/collections", label: "Shop All" },
  { href: "/size-guide", label: "Size Guide" },
  { href: "/sustainability", label: "Sustainability" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/gift-finder", label: "Gift Finder" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="text-lg font-bold tracking-tight text-gradient">
              Kindred Kids
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Playful, sustainable children&apos;s clothing made with love and organic materials.
              Where every adventure begins.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">About</h3>
            <ul className="space-y-2">
              <li><Link href="/sustainability" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Our Story</Link></li>
              <li><span className="text-sm text-muted-foreground">Ethical Manufacturing</span></li>
              <li><span className="text-sm text-muted-foreground">Organic Materials</span></li>
              <li><span className="text-sm text-muted-foreground">Giving Back</span></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Connect</h3>
            <ul className="space-y-2">
              <li><span className="text-sm text-muted-foreground">Instagram</span></li>
              <li><span className="text-sm text-muted-foreground">Facebook</span></li>
              <li><span className="text-sm text-muted-foreground">Pinterest</span></li>
              <li><span className="text-sm text-muted-foreground">hello@kindredkids.com</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/40 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Kindred Kids. All rights reserved. Made with care for little dreamers.
          </p>
        </div>
      </div>
    </footer>
  );
}