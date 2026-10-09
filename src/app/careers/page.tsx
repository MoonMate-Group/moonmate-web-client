import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { InfoCard } from "@/components/InfoCard";
import { PageBody, PageHero, Section } from "@/components/PageHero";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Careers" };

const tracks = [
  ["Group businesses", "Roles across our financial, defence, manufacturing and space initiatives."],
  ["Entrepreneurial & research", "Opportunities for builders and researchers to shape new ventures."],
  ["Internships", "Programmes for students and early-career talent."],
  ["Talent collaboration", "Fellowships, sabbaticals and joint research with institutions."],
];

export default function CareersPage() {
  return (
    <>
      <PageHero eyebrow="Careers" title="Build something that lasts." lead="Join a group working on problems that matter, at the frontier of technology." />
      <PageBody>
        <Section>
          <div className="grid gap-5 md:grid-cols-2">
            {tracks.map(([t, b]) => <InfoCard key={t} title={t} body={b} />)}
          </div>
          <Button size="lg" className="mt-12 h-11 rounded-full px-7 text-sm" render={<Link href="/contact" />} nativeButton={false}>
            Register your interest
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </Section>
      </PageBody>
    </>
  );
}
