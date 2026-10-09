import type Lenis from "lenis";

/**
 * Shared scroll state. `coord` is the continuous "chapter coordinate":
 * 2.35 means 35% of the way from chapter 2 to chapter 3, measured against the
 * viewport centre. The 3D camera, the HUD and the chapter copy all read it,
 * so everything stays locked to the same scroll position.
 */
export const scrollState = {
  coord: 0,
  velocity: 0,
  chapters: 0,
  lenis: null as Lenis | null,
};

type Listener = (s: typeof scrollState) => void;
const listeners = new Set<Listener>();

export function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function tick() {
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
  scrollState.chapters = els.length;
  scrollState.velocity = scrollState.lenis ? scrollState.lenis.velocity : 0;

  if (els.length === 0) {
    scrollState.coord = 0;
  } else {
    els.sort((a, b) => Number(a.dataset.chapter) - Number(b.dataset.chapter));
    const half = window.innerHeight / 2;
    // distance of each chapter's centre below the viewport centre
    const d = els.map((el) => {
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2 - half;
    });
    let coord = 0;
    if (d[0] <= 0) {
      coord = els.length - 1;
      for (let i = 0; i < els.length - 1; i++) {
        if (d[i] <= 0 && d[i + 1] > 0) {
          coord = i + -d[i] / (d[i + 1] - d[i]);
          break;
        }
      }
    }
    scrollState.coord = coord;
  }
  listeners.forEach((fn) => fn(scrollState));
}
