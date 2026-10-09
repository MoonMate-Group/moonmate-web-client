"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { scrollState, tick } from "@/lib/scroll";

/** Inertial scrolling + the single per-frame loop that feeds the 3D scene and HUD. */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduced ? null : new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    scrollState.lenis = lenis;

    let raf = requestAnimationFrame(function loop(t) {
      lenis?.raf(t);
      tick();
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      scrollState.lenis = null;
    };
  }, []);
  return null;
}
