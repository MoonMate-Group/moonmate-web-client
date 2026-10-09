import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { InfoCard } from "@/components/InfoCard";
import { PageBody, PageHero, Section } from "@/components/PageHero";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Strategic Partnerships" };

const types = [
  ["Government & institutional", "Collaboration with public bodies and institutions on sovereign capability and national programmes."],
  ["Technology & research", "Joint development with universities, laboratories and technology leaders."],
  ["Manufacturing", "Industrial alliances to build precision manufacturing capacity and supply-chain depth."],
  ["Global strategic alliances", "International partnerships that extend reach while respecting sovereignty and compliance."],
];

export default function PartnershipsPage() {
  return (
    <>
      <PageHero eyebrow="Strategic partnerships" title="Capability grows faster together." lead="We build alliances grounded in trust, shared standards and long-term commitment." />
      <PageBody>
        <Section>
          <div className="grid gap-5 md:grid-cols-2">
            {types.map(([t, b]) => <InfoCard key={t} title={t} body={b} />)}
          </div>
          <Button size="lg" className="mt-12 h-11 rounded-full px-7 text-sm" render={<Link href="/contact" />} nativeButton={false}>
            Propose a partnership
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </Section>
      </PageBody>
    </>
  );
}
