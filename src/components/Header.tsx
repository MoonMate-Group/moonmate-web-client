"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { businesses } from "@/data/businesses";
import { nav } from "@/data/site";
import { cn } from "@/lib/utils";
import { BusinessIcon } from "./BusinessIcon";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Moonmate Group — home">
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
        <defs>
          <radialGradient id="mm-moon" cx="32%" cy="28%" r="80%">
            <stop offset="0" stopColor="#f3efe4" />
            <stop offset="0.55" stopColor="#bdb6a3" />
            <stop offset="1" stopColor="#5a5a64" />
          </radialGradient>
        </defs>
        <circle cx="16" cy="16" r="14" fill="url(#mm-moon)" />
        <circle cx="11" cy="12" r="2.6" fill="#000" opacity=".16" />
        <circle cx="20" cy="20" r="1.8" fill="#000" opacity=".16" />
      </svg>
      <span className="text-sm font-semibold tracking-[0.24em] uppercase">
        Moonmate <span className="text-muted-foreground">Group</span>
      </span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const rest = nav.filter((n) => n.href !== "/businesses");

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 h-16 border-b transition-colors duration-300", solid ? "border-border bg-background/70 backdrop-blur-xl" : "border-transparent")}>
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 sm:px-10">
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Businesses</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[26rem] gap-1 p-2">
                    {businesses.map((b) => (
                      <li key={b.slug}>
                        <NavigationMenuLink render={<Link href={`/businesses/${b.slug}`} />} className="flex-row items-center gap-3">
                          <BusinessIcon name={b.icon} className="size-4 text-lunar" />
                          <span className="flex flex-col">
                            <span className="font-medium">{b.name}</span>
                            <span className="text-xs text-muted-foreground">{b.status}</span>
                          </span>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {rest.map((n) => (
                <NavigationMenuItem key={n.href}>
                  <NavigationMenuLink render={<Link href={n.href} />} active={pathname === n.href}>
                    {n.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <Button variant="outline" size="lg" className="ml-3 rounded-full px-5" render={<Link href="/contact" />} nativeButton={false}>
            Contact
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon-lg" className="lg:hidden" aria-label="Open menu" />}>
            <MenuIcon />
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Moonmate Group</SheetTitle>
              <SheetDescription>Building Intelligence. Strengthening Nations. Exploring New Frontiers.</SheetDescription>
            </SheetHeader>
            <nav aria-label="Mobile" className="flex flex-col px-4">
              {[{ href: "/", label: "Home" }, ...nav, { href: "/contact", label: "Contact" }].map((n) => (
                <SheetClose key={n.href} render={<Link href={n.href} />} className="border-b py-4 text-lg text-muted-foreground transition-colors hover:text-foreground">
                  {n.label}
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
