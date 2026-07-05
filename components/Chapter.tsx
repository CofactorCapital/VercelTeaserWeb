"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
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
 *   scroll  — crossing scroll thresholds TRIGGERS the stamp beat: the
 *             accusation springs in center-screen, then flies into the
 *             ledger rail
 *
 * The stamp is a state machine (hidden → staged → flown), not a scrubbed
 * timeline: scroll position picks the state, timed springs play the
 * transition. That way the beat can never be skipped by scrolling fast —
 * it simply won't arm until the question reveal has finished, and it
 * plays in full from wherever the reader is.
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

/**
 * Scroll bands within the pin that select the stamp state. These are the
 * BASE thresholds; once the timed reveal finishes, the stage threshold is
 * re-anchored just past wherever the reader is parked, so the stamp always
 * waits for fresh scroll input instead of appearing on its own.
 */
const STAGE_AT = 0.22;
const FLY_AT = 0.55;
/** Extra pin-progress the reader must scroll after the reveal to summon the stamp. */
const ARM_OFFSET = 0.07;

type Zone = "before" | "stage" | "fly";

export function Chapter({ section, index }: { section: Section; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { mark } = useLedger();
  const { w, h, isMobile } = useViewport();

  const [played, setPlayed] = useState(false);
  const [revealDone, setRevealDone] = useState(false);
  const [zone, setZone] = useState<Zone>("before");

  // Pin-phase progress: 0 when the pin engages, 1 when it releases.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
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

  // Pin progress at the moment the reveal finished — the anchor the reader
  // must scroll past for the stamp beat. Null until the beat is armed.
  const armPRef = useRef<number | null>(null);

  // Fire the timed question reveal once the slide is properly aligned
  // (SnapManager guarantees alignment shortly after any partial scroll);
  // re-arm everything once the reader scrolls back above the chapter.
  useMotionValueEvent(pre, "change", (v) => {
    if (v > 0.98) setPlayed(true);
    else if (v < 0.5) {
      setPlayed(false);
      setRevealDone(false);
      armPRef.current = null;
    }
  });

  // Scroll position selects the stamp zone; state changes trigger timed
  // animations rather than scrubbing a timeline. After arming, the stage
  // threshold sits just past the reader's parked position so the stamp
  // only ever answers a fresh scroll.
  const applyZone = (v: number) => {
    const arm = armPRef.current;
    const stageAt =
      arm === null
        ? STAGE_AT
        : Math.max(STAGE_AT, Math.min(arm + ARM_OFFSET, 0.85));
    const flyAt = Math.min(Math.max(FLY_AT, stageAt + 0.18), 0.96);
    setZone(v < stageAt ? "before" : v < flyAt ? "stage" : "fly");
  };
  useMotionValueEvent(scrollYProgress, "change", applyZone);

  // The stamp only arms once the timed reveal has finished. Scroll position
  // picks the TARGET state...
  const targetState = !revealDone || zone === "before"
    ? "hidden"
    : zone === "stage"
      ? "staged"
      : "flown";

  // ...but the actual state is sequenced: the stamp may never skip the
  // stage. If the reader outran the timer and is already in the fly zone
  // when the beat arms, it still lands center-screen, holds for a minimum
  // dwell, and only then flies to the rail.
  const [stampState, setStampState] = useState<"hidden" | "staged" | "flown">(
    "hidden"
  );
  const stagedAtRef = useRef(0);

  useEffect(() => {
    if (stampState === "staged") stagedAtRef.current = Date.now();
  }, [stampState]);

  useEffect(() => {
    if (targetState === stampState) return;
    if (targetState === "flown") {
      if (stampState === "hidden") {
        setStampState("staged");
        return;
      }
      // staged -> flown only after the stamp has held the stage briefly
      const dwell = 900;
      const remaining = dwell - (Date.now() - stagedAtRef.current);
      if (remaining <= 0) {
        setStampState("flown");
        return;
      }
      const t = setTimeout(() => setStampState("flown"), remaining);
      return () => clearTimeout(t);
    }
    setStampState(targetState);
  }, [targetState, stampState]);

  const stampOnStage = stampState !== "hidden";

  // Light the rail chip when the stamp takes off; un-light when scrolling back.
  useEffect(() => {
    mark(index, stampState === "flown");
  }, [stampState, mark, index]);

  // --- arrival: title block assembles as the chapter scrolls in ---
  const metaOpacity = useTransform(pre, [0.45, 0.75], [0, 1]);
  const titleY = useTransform(pre, [0.45, 0.95], [80, 0]);
  const titleOpacity = useTransform(pre, [0.45, 0.85], [0, 1]);
  const introOpacity = useTransform(pre, [0.65, 1], [0, 1]);
  const introY = useTransform(pre, [0.65, 1], [30, 0]);

  // --- background ghost index: slow parallax, no acrobatics ---
  const ghostY = useTransform(full, [0, 1], ["16%", "-16%"]);

  // Fly target: from the stamp's natural center (viewport center) to this
  // chapter's slot on the ledger rail. Deterministic — no DOM measurement.
  const target = chipTarget(index, SECTIONS.length, w, h, isMobile);
  const dx = target.x - w / 2;
  const dy = target.y - h / 2;

  const stampVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 1.6,
      rotate: -10,
      x: 0,
      y: 0,
      transition: { duration: 0.25 },
    },
    staged: {
      opacity: 1,
      scale: 1,
      rotate: -4,
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 240, damping: 22 },
    },
    flown: {
      // Hold visible for most of the flight, fade only on arrival.
      opacity: [null, 1, 0],
      scale: 0.12,
      rotate: 0,
      x: dx,
      y: dy,
      transition: {
        duration: 0.55,
        ease: "easeInOut",
        opacity: { duration: 0.55, times: [0, 0.75, 1] },
      },
    },
  };

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

        {/* Content dims while the stamp holds the stage */}
        <motion.div
          animate={{
            opacity: stampOnStage ? 0.14 : 1,
            scale: stampOnStage ? 0.985 : 1,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
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
            onAnimationComplete={(definition) => {
              if (definition === "visible") {
                // Anchor the stamp beat to wherever the reader is right now,
                // then re-evaluate the zone so it waits for fresh input.
                armPRef.current = scrollYProgress.get();
                setRevealDone(true);
                applyZone(scrollYProgress.get());
              }
            }}
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

        {/* The accusation stamp — springs in center-screen, then flies to the rail */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <motion.div
            variants={stampVariants}
            initial="hidden"
            animate={stampState}
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
