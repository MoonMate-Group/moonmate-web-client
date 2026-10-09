import type { Metadata } from "next";
import { InfoCard } from "@/components/InfoCard";
import { PageBody, PageHero, Section } from "@/components/PageHero";

export const metadata: Metadata = { title: "Technology & Innovation" };

const areas = [
  ["Artificial Intelligence", "Decision-grade AI, including compact domain-specific models designed for secure deployment."],
  ["Sovereign Technology", "Capabilities developed and operated under the control of the institutions that rely on them."],
  ["Advanced Engineering", "Precision engineering and manufacturing know-how for demanding, regulated environments."],
  ["Deep-Tech R&D", "Applied research with universities, labs and industry partners."],
  ["Future Infrastructure", "Early-stage exploration of resilient infrastructure on Earth and beyond."],
];

export default function TechnologyPage() {
  return (
    <>
      <PageHero eyebrow="Technology & Innovation" title="Deep technology, built to be trusted." lead="Our technology priorities cut across every business in the Group." />
      <PageBody>
        <Section>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {areas.map(([t, b], i) => <InfoCard key={t} kicker={`0${i + 1}`} title={t} body={b} />)}
          </div>
        </Section>
      </PageBody>
    </>
  );
}
