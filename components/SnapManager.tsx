"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { SECTIONS } from "@/lib/content";

/**
 * Slide alignment. While a chapter is pinned the viewport is always filled,
 * but between a chapter's pin release and the next chapter's pin start the
 * page can rest showing two partial slides. When scrolling settles inside
 * one of those hand-off bands, glide to the nearest sensible slide edge:
 *
 *   scrolling down + committed past 15% of the band → align the next slide
 *   scrolling down but barely into the band          → settle back
 *   scrolling up mirrors the same rule
 *
 * Renders nothing; it only listens.
 */

const SETTLE_MS = 170;
const EDGE = 4; // px slack at band edges so landings don't re-trigger
const COMMIT = 0.15; // fraction of the band that commits to the next slide

export function SnapManager() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastY = window.scrollY;
    let dir: 1 | -1 = 1;

    type Band = { start: number; end: number };

    // Hand-off bands, recomputed at settle time so resizes stay correct.
    const bands = (): Band[] => {
      const out: Band[] = [];
      const vh = window.innerHeight;
      const first = document.getElementById("chapter-0");
      if (!first) return out;
      const firstTop = first.getBoundingClientRect().top + window.scrollY;
      if (firstTop > vh / 2) out.push({ start: 0, end: firstTop }); // hero → ch1
      for (let i = 0; i < SECTIONS.length; i++) {
        const el = document.getElementById(`chapter-${i}`);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const pinEnd = top + el.offsetHeight - vh; // this chapter's pin release
        out.push({ start: pinEnd, end: top + el.offsetHeight }); // → next slide
      }
      return out;
    };

    const settle = () => {
      const y = window.scrollY;
      for (const b of bands()) {
        if (y > b.start + EDGE && y < b.end - EDGE) {
          const frac = (y - b.start) / (b.end - b.start);
          const target =
            dir > 0
              ? frac > COMMIT
                ? b.end
                : b.start
              : frac < 1 - COMMIT
                ? b.start
                : b.end;
          window.scrollTo({ top: target, behavior: "smooth" });
          return;
        }
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) > 0.5) dir = y > lastY ? 1 : -1;
      lastY = y;
      if (timer) clearTimeout(timer);
      timer = setTimeout(settle, SETTLE_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer) clearTimeout(timer);
    };
  }, [reduce]);

  return null;
}
