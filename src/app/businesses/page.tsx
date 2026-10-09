import type { Metadata } from "next";
import { BusinessCard } from "@/components/BusinessCard";
import { PageBody, PageHero, Section } from "@/components/PageHero";
import { StatusBadge } from "@/components/StatusBadge";
import { STATUS_DESCRIPTIONS, businesses, type BusinessStatus } from "@/data/businesses";

export const metadata: Metadata = { title: "Our Businesses" };

export default function BusinessesPage() {
  return (
    <>
      <PageHero eyebrow="Our businesses" title="Four verticals. One long-term vision." lead="Moonmate Group builds and backs businesses across financial infrastructure, defence intelligence, advanced manufacturing and frontier space." />
      <PageBody>
        <Section>
          <div className="grid gap-5 md:grid-cols-2">
            {businesses.map((b) => <BusinessCard key={b.slug} b={b} />)}
          </div>
        </Section>
        <Section eyebrow="How we describe stage" title="Clarity on what is live, planned and conceptual." className="border-t">
          <dl className="grid gap-8 md:grid-cols-3">
            {(Object.keys(STATUS_DESCRIPTIONS) as BusinessStatus[]).map((s) => (
              <div key={s} className="flex flex-col gap-4">
                <dt><StatusBadge status={s} /></dt>
                <dd className="text-sm text-muted-foreground">{STATUS_DESCRIPTIONS[s]}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </PageBody>
    </>
  );
}
