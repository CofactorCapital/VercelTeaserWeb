"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { LogoMark } from "./Logo";
import { ScrollCue } from "./ScrollCue";
import { FAITH_LINES } from "@/lib/content";

/**
 * Opening screen. The whole text sequence is TIMED on load — premise first,
 * then the faith lines stagger in, landing on "So we wrote down eight
 * questions." Scrolling simply moves on to chapter one.
 */

const sequence: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.35, delayChildren: 1.0 } },
};

const line: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 18 },
  },
};

export function Hero() {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <section className="bg-grid relative flex min-h-[100svh] w-full flex-col items-center justify-center px-6 py-28 text-center">
        <HeroTop />
        <div className="mt-8 space-y-1">
          {FAITH_LINES.map((l) => (
            <p key={l} className="font-display text-base text-porcelain/70 sm:text-lg">
              {l}
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
    <section className="bg-grid relative flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* static radial glow — no pointer chasing */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-azure/10 blur-[120px]"
      />

      <div className="relative z-10 flex max-w-3xl flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <HeroTop />
        </motion.div>

        <motion.div
          variants={sequence}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <div className="mt-8 space-y-1">
            {FAITH_LINES.map((l) => (
              <motion.p
                key={l}
                variants={line}
                className="font-display text-base text-porcelain/70 sm:text-lg"
              >
                {l}
              </motion.p>
            ))}
          </div>

          <motion.p
            variants={line}
            className="mt-10 font-display text-lg italic text-porcelain/80"
          >
            We&rsquo;ve always wondered why.
          </motion.p>

          <motion.p
            variants={line}
            className="mt-4 font-display text-xl font-semibold text-porcelain sm:text-2xl"
          >
            So we wrote down <span className="text-azure">eight questions</span>.
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.6, duration: 0.8 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 md:bottom-10"
      >
        <ScrollCue label="Scroll" />
      </motion.div>
    </section>
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
