import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Business } from "@/data/businesses";
import { BusinessIcon } from "./BusinessIcon";
import { StatusBadge } from "./StatusBadge";

export function BusinessCard({ b }: { b: Business }) {
  return (
    <Link href={`/businesses/${b.slug}`} className="group block h-full rounded-2xl">
      <Card className="h-full backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:ring-primary/40">
        <CardHeader>
          <div className="flex items-start justify-between">
            <span className="flex size-11 items-center justify-center rounded-xl border bg-muted text-lunar">
              <BusinessIcon name={b.icon} className="size-5" />
            </span>
            <span className="numeral font-mono text-3xl">{b.code}</span>
          </div>
          <CardTitle className="mt-6 text-xl">{b.name}</CardTitle>
          <CardDescription className="text-sm">{b.tagline}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1" />
        <CardFooter className="justify-between">
          <StatusBadge status={b.status} />
          <ArrowUpRightIcon className="size-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" aria-hidden="true" />
        </CardFooter>
      </Card>
    </Link>
  );
}
