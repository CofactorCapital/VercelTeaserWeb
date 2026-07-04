"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { LogoMark } from "./Logo";
import { ScrollCue } from "./ScrollCue";
import { FAITH_LINES } from "@/lib/content";

/**
 * Pinned opening chapter. The premise is visible immediately; scrolling
 * scrubs the faith lines in one at a time, then lands the setup for the
 * ledger mechanic: "So we wrote down eight questions."
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  const cueOpacity = useTransform(p, [0, 0.08], [1, 0]);
  const exitOpacity = useTransform(p, [0.9, 1], [1, 0.35]);

  const wonderOpacity = useTransform(p, [0.6, 0.68], [0, 1]);
  const wonderY = useTransform(p, [0.6, 0.68], [30, 0]);
  const eightOpacity = useTransform(p, [0.72, 0.8], [0, 1]);
  const eightY = useTransform(p, [0.72, 0.8], [30, 0]);
  const eightScale = useTransform(p, [0.72, 0.82], [1.06, 1]);

  if (reduce) {
    return (
      <section className="bg-grid relative flex min-h-[100svh] w-full flex-col items-center justify-center px-6 py-28 text-center">
        <HeroTop />
        <div className="mt-8 space-y-1">
          {FAITH_LINES.map((line) => (
            <p key={line} className="font-display text-base text-porcelain/60 sm:text-lg">
              {line}
            </p>
          ))}
        </div>
        <p className="mt-10 font-display text-lg italic text-porcelain/80">
          We&rsquo;ve always wondered why.
        </p>
        <p className="mt-4 font-display text-xl font-semibold text-porcelain">
          So we wrote down <span className="text-azure">eight questions</span>.
        </p>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[200vh]">
      <div className="bg-grid sticky top-0 flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
        {/* static radial glow — no pointer chasing */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-azure/10 blur-[120px]"
        />

        <motion.div
          style={{ opacity: exitOpacity }}
          className="relative z-10 flex max-w-3xl flex-col items-center"
        >
          {/* One-time entrance on load; everything below is scroll-scrubbed. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <HeroTop />
          </motion.div>

          <div className="mt-8 space-y-1">
            {FAITH_LINES.map((line, i) => (
              <FaithLine key={line} p={p} i={i} count={FAITH_LINES.length}>
                {line}
              </FaithLine>
            ))}
          </div>

          <motion.p
            style={{ opacity: wonderOpacity, y: wonderY }}
            className="mt-10 font-display text-lg italic text-porcelain/80"
          >
            We&rsquo;ve always wondered why.
          </motion.p>

          <motion.p
            style={{ opacity: eightOpacity, y: eightY, scale: eightScale }}
            className="mt-4 font-display text-xl font-semibold text-porcelain sm:text-2xl"
          >
            So we wrote down <span className="text-azure">eight questions</span>.
          </motion.p>
        </motion.div>

        <motion.div
          style={{ opacity: cueOpacity }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 md:bottom-10"
        >
          <ScrollCue label="Scroll" />
        </motion.div>
      </div>
    </section>
  );
}

function FaithLine({
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
  const start = 0.1 + i * (0.4 / count);
  const next = 0.1 + (i + 1) * (0.4 / count);
  const isLast = i === count - 1;

  const opacity = useTransform(
    p,
    isLast ? [start, start + 0.06] : [start, start + 0.06, next, next + 0.06],
    isLast ? [0, 1] : [0, 1, 1, 0.45]
  );
  const y = useTransform(p, [start, start + 0.06], [24, 0]);

  return (
    <motion.p
      style={{ opacity, y }}
      className="font-display text-base text-porcelain/80 sm:text-lg"
    >
      {children}
    </motion.p>
  );
}

function HeroTop() {
  return (
    <>
      <LogoMark className="mb-8 h-16 w-16 sm:h-20 sm:w-20" />
      <h1 className="font-display text-4xl font-extrabold uppercase tracking-[0.18em] text-porcelain sm:text-5xl md:text-6xl">
        Acme Test
      </h1>
      <span className="mt-5 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.4em] text-azure">
        <span className="h-px w-8 bg-azure/50" />
        Coming Soon
        <span className="h-px w-8 bg-azure/50" />
      </span>
      <p className="mt-10 text-balance font-display text-xl font-medium leading-snug text-porcelain sm:text-2xl md:text-[28px]">
        The investment industry asks investors to accept a lot on faith.
      </p>
    </>
  );
}
