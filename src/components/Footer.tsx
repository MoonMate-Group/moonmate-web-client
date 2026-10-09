import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { businesses } from "@/data/businesses";
import { nav, site } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative z-10 border-t bg-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-sm font-semibold tracking-[0.24em] uppercase">Moonmate Group</p>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">{site.tagline}</p>
        </div>
        <div>
          <p className="font-mono text-xs tracking-[0.16em] text-lunar uppercase">Businesses</p>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            {businesses.map((b) => (
              <li key={b.slug}><Link className="transition-colors hover:text-foreground" href={`/businesses/${b.slug}`}>{b.short}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-xs tracking-[0.16em] text-lunar uppercase">Group</p>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            {nav.filter((n) => n.href !== "/businesses").map((n) => (
              <li key={n.href}><Link className="transition-colors hover:text-foreground" href={n.href}>{n.label}</Link></li>
            ))}
            <li><Link className="transition-colors hover:text-foreground" href="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      <Separator />
      <p className="mx-auto max-w-7xl px-5 py-6 text-xs text-muted-foreground sm:px-10">
        © Moonmate Group. All rights reserved. Descriptions of planned ventures and long-term concepts are forward-looking and subject to change.
      </p>
    </footer>
  );
}
