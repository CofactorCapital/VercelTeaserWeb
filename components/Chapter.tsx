"use client";

import { useRef, useState } from "react";
import {
  easeIn,
  easeOut,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { useLedger } from "@/lib/ledger";
import { useViewport } from "@/lib/viewport";
import { chipTarget } from "@/lib/rail";
import { SECTIONS, type Section } from "@/lib/content";

/**
 * A pinned chapter with a two-beat structure:
 *
 *   arrival — title/intro assemble as the chapter scrolls in, then the
 *             questions play on a TIMED stagger (not scroll-scrubbed)
 *   scroll  — continuing to scroll runs the stamp beat: the accusation
 *             lands center-screen, then flies into the ledger rail
 *
 * The timed reveal re-arms when the reader scrolls back above the chapter,
 * so revisiting replays it.
 */

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.3, delayChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 18 },
  },
};

export function Chapter({ section, index }: { section: Section; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { mark } = useLedger();
  const { w, h, isMobile } = useViewport();
  const [played, setPlayed] = useState(false);

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

  // Fire the timed question reveal when the chapter has essentially arrived;
  // re-arm it once the reader scrolls back above the chapter.
  useMotionValueEvent(pre, "change", (v) => {
    if (v > 0.92) setPlayed(true);
    else if (v < 0.5) setPlayed(false);
  });

  // --- arrival: title block assembles as the chapter scrolls in ---
  const metaOpacity = useTransform(pre, [0.45, 0.75], [0, 1]);
  const titleY = useTransform(pre, [0.45, 0.95], [80, 0]);
  const titleOpacity = useTransform(pre, [0.45, 0.85], [0, 1]);
  const introOpacity = useTransform(pre, [0.65, 1], [0, 1]);
  const introY = useTransform(pre, [0.65, 1], [30, 0]);

  // --- background ghost index: slow parallax, no acrobatics ---
  const ghostY = useTransform(full, [0, 1], ["16%", "-16%"]);

  // --- stamp beat: content dims while the accusation takes the stage ---
  const contentOpacity = useTransform(p, [0.28, 0.4], [1, 0.14]);
  const contentScale = useTransform(p, [0.28, 0.4], [1, 0.985]);

  // Fly target: from the stamp's natural center (viewport center) to this
  // chapter's slot on the ledger rail. Deterministic — no DOM measurement.
  const target = chipTarget(index, SECTIONS.length, w, h, isMobile);
  const dx = target.x - w / 2;
  const dy = target.y - h / 2;

  const stampOpacity = useTransform(p, [0.3, 0.36, 0.66, 0.72], [0, 1, 1, 0]);
  const stampScale = useTransform(p, [0.3, 0.42, 0.54, 0.72], [1.6, 1, 1, 0.1]);
  const stampRotate = useTransform(p, [0.3, 0.42, 0.54, 0.72], [-10, -4, -4, 0]);
  // Slightly different easings on each axis give the flight a subtle arc.
  const stampX = useTransform(p, [0.54, 0.72], [0, dx], { ease: easeIn });
  const stampY = useTransform(p, [0.54, 0.72], [0, dy], { ease: easeOut });

  // Light the rail chip as the stamp arrives; un-light when scrubbing back.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > 0.64) mark(index, true);
    else if (v < 0.58) mark(index, false);
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
    <section id={`chapter-${index}`} ref={ref} className="relative h-[180vh]">
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

          {/* Timed reveal: plays once the chapter arrives, independent of scroll */}
          <motion.ul
            variants={listVariants}
            initial="hidden"
            animate={played ? "visible" : "hidden"}
            className="mt-8 max-w-3xl space-y-4 border-l border-white/10 pl-6 sm:space-y-5"
          >
            {section.questions.map((q) => (
              <motion.li
                key={q}
                variants={itemVariants}
                className="text-balance font-display text-lg font-medium leading-snug text-porcelain sm:text-xl md:text-2xl"
              >
                {q}
              </motion.li>
            ))}
          </motion.ul>
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
