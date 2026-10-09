import type { Metadata } from "next";
import { InfoCard } from "@/components/InfoCard";
import { PageBody, PageHero, Section } from "@/components/PageHero";

export const metadata: Metadata = { title: "News & Insights" };

const streams = [
  ["Group announcements", "Corporate updates and milestones."],
  ["Industry insights", "Perspective on AI, defence, manufacturing and space."],
  ["Innovation updates", "Progress across our technology programmes."],
  ["Media coverage", "Moonmate Group in the press."],
  ["Thought leadership", "Essays and viewpoints from our leaders and partners."],
];

export default function NewsPage() {
  return (
    <>
      <PageHero eyebrow="News & Insights" title="Updates from across the Group." lead="Announcements, analysis and perspectives — published here as they become available." />
      <PageBody>
        <Section>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {streams.map(([t, b]) => <InfoCard key={t} kicker="Coming soon" title={t} body={b} />)}
          </div>
        </Section>
      </PageBody>
    </>
  );
}
