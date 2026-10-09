"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { subscribe } from "@/lib/scroll";

type Align = "left" | "right" | "center";

/**
 * One stop on the scroll journey. The section is tall; its content is pinned in the middle
 * of the viewport and cross-fades as the camera flies in and out of the station.
 */
export function Chapter({
  index, id, align = "left", className, children,
}: { index: number; id: string; align?: Align; className?: string; children: React.ReactNode }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return subscribe((s) => {
      const node = el.current;
      if (!node) return;
      const d = s.coord - index;
      const o = Math.min(1, Math.max(0, 1 - (Math.abs(d) - 0.2) / 0.34));
      node.style.opacity = String(o);
      node.style.transform = `translate3d(0, ${(d * 56).toFixed(1)}px, 0)`;
      node.style.pointerEvents = o < 0.25 ? "none" : "";
      node.style.visibility = o === 0 ? "hidden" : "visible";
    });
  }, [index]);

  return (
    <section id={id} data-chapter={index} className={cn("relative h-[170vh]", className)}>
      <div
        className={cn(
          "sticky top-0 flex h-svh items-center px-5 sm:px-10 lg:px-16 xl:pr-52",
          align === "right" && "justify-end",
          align === "center" && "justify-center text-center",
        )}
      >
        <div ref={el} className="w-full will-change-transform">{children}</div>
      </div>
    </section>
  );
}
