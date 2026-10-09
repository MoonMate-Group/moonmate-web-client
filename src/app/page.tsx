import Link from "next/link";
import { ArrowRightIcon, CheckIcon, ChevronsDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Chapter } from "@/components/Chapter";
import { ChapterRail } from "@/components/ChapterRail";
import { StatusBadge } from "@/components/StatusBadge";
import { businesses } from "@/data/businesses";

const pillars = [
  { t: "Sovereign by design", b: "Technology and capability built to be owned, governed and operated within national and institutional boundaries." },
  { t: "Venture-building model", b: "A holding structure that incubates, funds and scales new companies across frontier sectors." },
  { t: "Long-horizon thinking", b: "Patient capital and engineering discipline applied to problems that take decades, not quarters." },
];

const railLabels = ["Group", ...businesses.map((b) => b.short), "Vision"];
// the chapter where the camera lands on the Moon
const MOON_CHAPTER = businesses.length;

export default function Home() {
  return (
    <>
      <ChapterRail labels={railLabels} moonChapter={MOON_CHAPTER} />

      {/* 00 — Hero */}
      <Chapter index={0} id="hero">
        <div className="mx-auto w-full max-w-7xl">
          <p className="font-mono text-xs tracking-[0.28em] text-lunar uppercase">Moonmate Group</p>
          <h1 className="mt-6 max-w-5xl text-[clamp(2.5rem,5.4vw,5rem)] leading-[1] font-semibold tracking-tight text-balance">
            Building Intelligence.
            <span className="block text-muted-foreground">Strengthening Nations.</span>
            <span className="block bg-gradient-to-r from-lunar via-primary to-primary bg-clip-text text-transparent">Exploring New Frontiers.</span>
          </h1>
          <p className="mt-8 max-w-lg text-lg text-muted-foreground text-pretty">
            A deep-tech holding and venture-building group across AI, defence, advanced manufacturing and space.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button size="lg" className="h-11 rounded-full px-7 text-sm" render={<Link href="/businesses" />} nativeButton={false}>
              Explore our businesses
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" className="h-11 rounded-full px-7 text-sm" render={<Link href="/about" />} nativeButton={false}>
              About the Group
            </Button>
          </div>
          <div className="mt-16 flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
            <ChevronsDownIcon className="cue size-4 text-lunar" aria-hidden="true" />
            Scroll to begin the journey
          </div>
        </div>
      </Chapter>

      {/* 01–04 — The four verticals */}
      {businesses.map((b, i) => {
        const textRight = i % 2 === 0; // the 3D subject sits on the opposite side
        return (
          <Chapter key={b.slug} index={i + 1} id={b.slug} align={textRight ? "right" : "left"}>
            <Card className={`max-w-xl backdrop-blur-xl sm:p-2 ${textRight ? "ml-auto" : ""}`}>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <span className="numeral font-mono text-7xl leading-none font-semibold">{b.code}</span>
                  <StatusBadge status={b.status} />
                </div>
                <CardTitle className="mt-4 text-3xl leading-tight sm:text-4xl">{b.name}</CardTitle>
                <CardDescription className="text-base">{b.tagline}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-3">
                  {b.capabilities.slice(0, 3).map((c) => (
                    <li key={c.title} className="flex items-start gap-3 text-sm">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-lunar" aria-hidden="true" />
                      <span>{c.title}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="h-10 rounded-full px-5" render={<Link href={`/businesses/${b.slug}`} />} nativeButton={false}>
                  Explore {b.short}
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </CardFooter>
            </Card>
          </Chapter>
        );
      })}

      {/* 05 — Vision / philosophy / CTA */}
      <Chapter index={businesses.length + 1} id="vision" align="left">
        <div className="mx-auto w-full max-w-7xl">
          <p className="font-mono text-xs tracking-[0.22em] text-lunar uppercase">Group philosophy</p>
          <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
            A group designed to grow without changing its purpose.
          </h2>
          <div className="mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
            {pillars.map((p) => (
              <Card key={p.t} size="sm" className="backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>{p.t}</CardTitle>
                  <CardDescription>{p.b}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" className="h-11 rounded-full px-7 text-sm" render={<Link href="/contact" />} nativeButton={false}>
              Partner with Moonmate
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" className="h-11 rounded-full px-7 text-sm" render={<Link href="/about" />} nativeButton={false}>
              Our story
            </Button>
          </div>
        </div>
      </Chapter>
    </>
  );
}
