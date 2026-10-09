import type { Metadata } from "next";
import { InfoCard } from "@/components/InfoCard";
import { PageBody, PageHero, Section } from "@/components/PageHero";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = { title: "About" };

const approach = [
  ["Identify", "Spot frontier problems where technology and national or institutional need converge."],
  ["Incubate", "Build focused teams with the engineering depth and governance to operate in sensitive sectors."],
  ["Partner", "Work with governments, research institutions and manufacturers to earn trust and scale responsibly."],
  ["Scale", "Grow proven businesses under shared standards, capital discipline and long-term stewardship."],
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About the Group" title="A holding and venture-building group for frontier industries." lead="Moonmate Group brings together businesses that share a conviction: durable value is built where deep technology meets real institutional need." />
      <PageBody>
        <Section eyebrow="Our story" title="From a single idea to a group of ventures.">
          <div className="flex max-w-3xl flex-col gap-5 text-muted-foreground">
            <p>Moonmate Group was founded to build companies at the edge of what is technologically possible — and strategically necessary. Rather than a conventional conglomerate, we operate as a venture-building group, adding new companies, investments and verticals as opportunities mature.</p>
            <p>Our portfolio spans financial decision infrastructure, sovereign defence AI, advanced manufacturing and frontier space concepts. Each is led with a long-term view and honest clarity about its stage.</p>
          </div>
        </Section>
        <Separator />
        <Section>
          <div className="grid gap-12 md:grid-cols-2">
            <div><p className="font-mono text-xs tracking-[0.22em] text-lunar uppercase">Vision</p><p className="mt-4 text-2xl font-semibold text-balance">To be a trusted global group building intelligence, capability and infrastructure for nations and new frontiers.</p></div>
            <div><p className="font-mono text-xs tracking-[0.22em] text-lunar uppercase">Mission</p><p className="mt-4 text-2xl font-semibold text-balance">To create, scale and steward deep-tech businesses that strengthen institutions and expand what is possible.</p></div>
          </div>
        </Section>
        <Separator />
        <Section eyebrow="Our approach" title="How we build and scale businesses.">
          <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {approach.map(([t, b], i) => <li key={t}><InfoCard kicker={`0${i + 1}`} title={t} body={b} /></li>)}
          </ol>
        </Section>
        <Separator />
        <Section eyebrow="Leadership & governance" title="Accountable leadership and disciplined governance.">
          <p className="max-w-3xl text-muted-foreground">Leadership profiles and board information will be published here. The Group operates with clear separation between group oversight and individual business management, supporting compliance in regulated sectors.</p>
        </Section>
      </PageBody>
    </>
  );
}
