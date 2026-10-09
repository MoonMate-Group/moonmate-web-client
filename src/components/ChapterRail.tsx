"use client";

import { useEffect, useRef } from "react";
import { scrollState, subscribe } from "@/lib/scroll";

const EARTH_MOON_KM = 384_400;

/** Right-hand chapter index + a mission-style distance-to-Moon readout, driven by scroll. */
export function ChapterRail({ labels, moonChapter }: { labels: string[]; moonChapter: number }) {
  const dots = useRef<(HTMLButtonElement | null)[]>([]);
  const readout = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let last = -1;
    return subscribe((s) => {
      const active = Math.round(s.coord);
      dots.current.forEach((d, i) => d?.setAttribute("data-active", String(i === active)));
      if (readout.current) {
        const km = Math.round(EARTH_MOON_KM * (1 - Math.min(1, Math.max(0, s.coord / moonChapter))));
        if (km !== last) {
          last = km;
          readout.current.textContent = km.toLocaleString("en-US").padStart(7, " ");
        }
      }
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, s.coord / (labels.length - 1))})`;
    });
  }, [labels.length, moonChapter]);

  const go = (i: number) => {
    const el = document.querySelector<HTMLElement>(`[data-chapter="${i}"]`);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY + el.offsetHeight / 2 - window.innerHeight / 2;
    if (scrollState.lenis) scrollState.lenis.scrollTo(y, { duration: 2.2 });
    else window.scrollTo({ top: y });
  };

  return (
    <>
      <div className="fixed inset-x-0 top-16 z-40 h-px bg-border" aria-hidden="true">
        <div ref={bar} className="h-full origin-left bg-primary" style={{ transform: "scaleX(0)" }} />
      </div>

      <nav aria-label="Journey chapters" className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 xl:flex">
        {labels.map((l, i) => (
          <button
            key={l}
            ref={(n) => { dots.current[i] = n; }}
            type="button"
            onClick={() => go(i)}
            data-active={i === 0}
            className="group flex cursor-pointer items-center gap-3 font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase transition-colors hover:text-foreground data-[active=true]:text-foreground"
          >
            <span className="translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-data-[active=true]:translate-x-0 group-data-[active=true]:opacity-100">{l}</span>
            <span className="h-px w-5 bg-current transition-all duration-300 group-data-[active=true]:w-9 group-data-[active=true]:bg-primary" />
          </button>
        ))}
      </nav>

      <div className="pointer-events-none fixed bottom-6 left-5 z-40 hidden font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase sm:left-10 sm:block lg:left-16">
        <span className="text-lunar">Distance to Moon</span>
        <span className="mx-3 text-border">/</span>
        <span ref={readout} className="text-foreground tabular-nums">{EARTH_MOON_KM.toLocaleString("en-US")}</span> km
      </div>
    </>
  );
}
