import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, ArrowUpRightIcon, InfoIcon } from "lucide-react";
import { BusinessIcon } from "@/components/BusinessIcon";
import { InfoCard } from "@/components/InfoCard";
import { PageBody, PageHero, Section } from "@/components/PageHero";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { businesses, getBusiness } from "@/data/businesses";

export function generateStaticParams() {
  return businesses.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const b = getBusiness((await params).slug);
  return b ? { title: b.name, description: b.tagline } : {};
}

export default function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-svh" />}>
      <BusinessContent params={params} />
    </Suspense>
  );
}

async function BusinessContent({ params }: { params: Promise<{ slug: string }> }) {
  const b = getBusiness((await params).slug);
  if (!b) notFound();
  const others = businesses.filter((x) => x.slug !== b.slug);

  return (
    <>
      <PageHero eyebrow={`Business ${b.code}`} title={b.name} lead={b.tagline}>
        <div className="mt-8 flex items-center gap-3">
          <BusinessIcon name={b.icon} className="size-5 text-lunar" />
          <StatusBadge status={b.status} />
        </div>
      </PageHero>

      <PageBody>
        <Section eyebrow="Overview" title={b.summary}>
          <Card size="sm" className="max-w-2xl flex-row items-start gap-3 px-4 backdrop-blur-xl">
            <InfoIcon className="mt-0.5 size-4 shrink-0 text-lunar" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">{b.statusNote}</p>
          </Card>
        </Section>

        <Separator />
        <Section eyebrow="Focus areas" title="What this business does.">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {b.capabilities.map((c, i) => <InfoCard key={c.title} kicker={`0${i + 1}`} title={c.title} body={c.body} />)}
          </div>
        </Section>

        <Separator />
        <Section eyebrow="Who we work with" title="Intended audiences and partners.">
          <ul className="grid gap-6 md:grid-cols-3">
            {b.outlook.map((o) => <li key={o} className="border-t border-lunar/50 pt-4 text-muted-foreground">{o}</li>)}
          </ul>
          <Button size="lg" className="mt-12 h-11 rounded-full px-7 text-sm" render={<Link href="/contact" />} nativeButton={false}>
            Discuss a collaboration
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </Section>

        <Separator />
        <Section eyebrow="Also in the Group">
          <ul className="grid gap-4 md:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/businesses/${o.slug}`} className="group flex items-center justify-between rounded-xl border p-5 transition-colors hover:border-primary/50">
                  <span>{o.short}</span>
                  <ArrowUpRightIcon className="size-4 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </PageBody>
    </>
  );
}
