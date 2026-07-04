"use client";

import { useRef } from "react";
import {
  easeIn,
  easeOut,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useLedger } from "@/lib/ledger";
import { useViewport } from "@/lib/viewport";
import { chipTarget } from "@/lib/rail";
import { SECTIONS, type Section } from "@/lib/content";

/**
 * A pinned, scroll-scrubbed chapter.
 *
 * The outer container is ~2.4 viewport-heights tall; the inner viewport is
 * sticky, so scrolling scrubs the chapter's internal choreography:
 *
 *   scroll in   — title / intro assemble as the chapter arrives
 *   pin 0–~0.5  — questions land one at a time, focus advancing
 *   ~0.55–0.75  — the accusation stamps center-screen, content dims
 *   ~0.78–0.94  — the stamp flies into the ledger rail; the chip lights up
 *
 * Everything is a pure function of scroll position, so it plays identically
 * forward and backward.
 */
export function Chapter({ section, index }: { section: Section; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { mark } = useLedger();
  const { w, h, isMobile } = useViewport();

  // Pin-phase progress: 0 when the pin engages, 1 when it releases.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  // Approach progress: 0 while below the fold, 1 as the pin engages.
  const { scrollYProgress: pre } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });

  // Full-range progress for the background parallax.
  const { scrollYProgress: full } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // --- approach: title block assembles as the chapter scrolls in ---
  const metaOpacity = useTransform(pre, [0.45, 0.75], [0, 1]);
  const titleY = useTransform(pre, [0.45, 0.95], [80, 0]);
  const titleOpacity = useTransform(pre, [0.45, 0.85], [0, 1]);
  const introOpacity = useTransform(pre, [0.65, 1], [0, 1]);
  const introY = useTransform(pre, [0.65, 1], [30, 0]);

  // --- background ghost index: slow parallax, no acrobatics ---
  const ghostY = useTransform(full, [0, 1], ["16%", "-16%"]);

  // --- stamp phase: content dims while the accusation takes the stage ---
  const contentOpacity = useTransform(p, [0.55, 0.64], [1, 0.14]);
  const contentScale = useTransform(p, [0.55, 0.64], [1, 0.985]);

  // Fly target: from the stamp's natural center (viewport center) to this
  // chapter's slot on the ledger rail. Deterministic — no DOM measurement.
  const target = chipTarget(index, SECTIONS.length, w, h, isMobile);
  const dx = target.x - w / 2;
  const dy = target.y - h / 2;

  const stampOpacity = useTransform(p, [0.56, 0.61, 0.9, 0.94], [0, 1, 1, 0]);
  const stampScale = useTransform(p, [0.56, 0.66, 0.78, 0.94], [1.6, 1, 1, 0.1]);
  const stampRotate = useTransform(p, [0.56, 0.66, 0.78, 0.94], [-10, -4, -4, 0]);
  // Slightly different easings on each axis give the flight a subtle arc.
  const stampX = useTransform(p, [0.78, 0.94], [0, dx], { ease: easeIn });
  const stampY = useTransform(p, [0.78, 0.94], [0, dy], { ease: easeOut });

  // Light the rail chip as the stamp arrives; un-light when scrubbing back.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > 0.86) mark(index, true);
    else if (v < 0.8) mark(index, false);
  });

  // Reduced motion: a calm, fully visible static chapter. No pin, no stamp
  // flight — the accusation renders as a plain badge below the questions.
  if (reduce) {
    return (
      <section
        id={`chapter-${index}`}
        className="relative flex min-h-[100svh] w-full items-center border-t border-white/5"
      >
        <div className="mx-auto w-full max-w-5xl px-6 py-24 md:px-10">
          <ChapterMeta section={section} />
          <ChapterTitle section={section} />
          <ChapterIntro section={section} />
          <ul className="mt-8 max-w-3xl space-y-4 border-l border-white/10 pl-6">
            {section.questions.map((q) => (
              <li
                key={q}
                className="text-balance font-display text-lg font-medium leading-snug text-porcelain/90 sm:text-xl md:text-2xl"
              >
                {q}
              </li>
            ))}
          </ul>
          <p className="mt-10 inline-block border-2 border-vermilion/70 px-4 py-2 font-mono text-xs uppercase tracking-[0.24em] text-vermilion">
            {section.keyPhrase}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id={`chapter-${index}`}
      ref={ref}
      className="relative h-[230vh] md:h-[240vh]"
    >
      <div className="sticky top-0 flex h-[100svh] w-full items-center overflow-hidden border-t border-white/5">
        {/* Ghost index — quiet depth, not a fairground ride */}
        <motion.span
          aria-hidden="true"
          style={{ y: ghostY }}
          className="pointer-events-none absolute right-[-4%] top-1/2 -translate-y-1/2 select-none font-display text-[38vw] font-black leading-none text-azure/[0.05] md:text-[24vw]"
        >
          {section.index}
        </motion.span>

        <motion.div
          style={{ opacity: contentOpacity, scale: contentScale }}
          className="relative z-10 mx-auto w-full max-w-5xl px-6 md:px-10"
        >
          <motion.div style={{ opacity: metaOpacity }}>
            <ChapterMeta section={section} />
          </motion.div>

          <motion.div style={{ y: titleY, opacity: titleOpacity }}>
            <ChapterTitle section={section} />
          </motion.div>

          <motion.div style={{ y: introY, opacity: introOpacity }}>
            <ChapterIntro section={section} />
          </motion.div>

          <ul className="mt-8 max-w-3xl space-y-4 border-l border-white/10 pl-6 sm:space-y-5">
            {section.questions.map((q, qi) => (
              <Question key={q} p={p} i={qi} count={section.questions.length}>
                {q}
              </Question>
            ))}
          </ul>
        </motion.div>

        {/* The accusation stamp — lands center-screen, then flies to the rail */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <motion.div
            style={{
              opacity: stampOpacity,
              scale: stampScale,
              rotate: stampRotate,
              x: stampX,
              y: stampY,
            }}
            className="border-[3px] border-vermilion/90 bg-obsidian/70 px-6 py-4 text-center backdrop-blur-sm sm:px-10 sm:py-6"
          >
            <span className="block font-mono text-[10px] uppercase tracking-[0.4em] text-vermilion/70">
              Exhibit {section.index}
            </span>
            <span className="mt-2 block font-display text-3xl font-black uppercase tracking-tight text-vermilion sm:text-5xl">
              {section.keyPhrase}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** One question line: rises in on its scroll window, dims when the next lands. */
function Question({
  p,
  i,
  count,
  children,
}: {
  p: MotionValue<number>;
  i: number;
  count: number;
  children: string;
}) {
  const start = 0.06 + i * (0.34 / Math.max(1, count - 1));
  const next = 0.06 + (i + 1) * (0.34 / Math.max(1, count - 1));
  const isLast = i === count - 1;

  const opacity = useTransform(
    p,
    isLast ? [start, start + 0.08] : [start, start + 0.08, next, next + 0.08],
    isLast ? [0, 1] : [0, 1, 1, 0.4]
  );
  const y = useTransform(p, [start, start + 0.08], [40, 0]);

  return (
    <motion.li
      style={{ opacity, y }}
      className="text-balance font-display text-lg font-medium leading-snug text-porcelain sm:text-xl md:text-2xl"
    >
      {children}
    </motion.li>
  );
}

function ChapterMeta({ section }: { section: Section }) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-xs tracking-[0.3em] text-azure">
        {section.index}
      </span>
      <span className="h-px w-12 bg-azure/40" />
      <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-porcelain/40">
        The questions
      </span>
    </div>
  );
}

function ChapterTitle({ section }: { section: Section }) {
  return (
    <h2 className="mt-5 overflow-hidden">
      <span className="block font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-porcelain sm:text-6xl md:text-7xl">
        {section.title}
      </span>
    </h2>
  );
}

function ChapterIntro({ section }: { section: Section }) {
  if (!section.intro) return null;
  return (
    <div className="mt-6 max-w-2xl space-y-1">
      {section.intro.map((line) => (
        <p
          key={line}
          className="font-display text-lg text-porcelain/70 sm:text-xl"
        >
          {line}
        </p>
      ))}
    </div>
  );
}
