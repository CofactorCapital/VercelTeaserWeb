"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { LogoMark } from "./Logo";
import { SignupForm } from "./SignupForm";
import { useLedger } from "@/lib/ledger";
import { useViewport } from "@/lib/viewport";
import { SECTIONS } from "@/lib/content";

/**
 * The payoff. Pinned like the chapters, in three scrubbed phases:
 *
 *   1. the rail hands off — the eight collected accusations converge into
 *      an evidence grid center-stage under "Eight questions."
 *   2. the cards flip in a stagger to their backs: ANSWERED, contents
 *      redacted. Teaser only — the answers stay sealed until launch.
 *   3. the grid recedes and the CTA + signup rise.
 */
export function Finale() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { setRailHidden } = useLedger();
  const { isMobile } = useViewport();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  // The rail bows out as its contents take the stage.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setRailHidden(v > 0.04);
  });

  // Phase 1+2 wrapper (heading + grid) recedes for the CTA.
  const stageOpacity = useTransform(p, [0.6, 0.7], [1, 0.05]);
  const stageY = useTransform(p, [0.6, 0.7], [0, -70]);

  // Crossfading headline.
  const h1Opacity = useTransform(p, [0.03, 0.1, 0.32, 0.38], [0, 1, 1, 0]);
  const h1Y = useTransform(p, [0.03, 0.1], [40, 0]);
  const h2Opacity = useTransform(p, [0.4, 0.48], [0, 1]);

  // CTA block.
  const ctaOpacity = useTransform(p, [0.68, 0.78], [0, 1]);
  const ctaY = useTransform(p, [0.68, 0.78], [70, 0]);
  const ctaEvents = useTransform(p, (v) => (v > 0.7 ? "auto" : "none"));

  if (reduce) {
    return (
      <section
        id="signup"
        className="relative flex min-h-[100svh] w-full flex-col items-center justify-center border-t border-white/5 px-6 py-24 text-center"
      >
        <CtaContent />
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden border-t border-white/5 px-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-vermilion/10 blur-[130px]"
        />

        {/* Phases 1 & 2: the evidence, gathered and answered */}
        <motion.div
          style={{ opacity: stageOpacity, y: stageY }}
          className="relative z-10 flex w-full max-w-3xl flex-col items-center"
        >
          <div className="relative h-16 w-full text-center sm:h-20">
            <motion.h2
              style={{ opacity: h1Opacity, y: h1Y }}
              className="absolute inset-x-0 font-display text-3xl font-extrabold uppercase tracking-tight text-porcelain sm:text-5xl"
            >
              Eight questions.
            </motion.h2>
            <motion.h2
              style={{ opacity: h2Opacity }}
              className="absolute inset-x-0 font-display text-3xl font-extrabold uppercase tracking-tight text-porcelain sm:text-5xl"
            >
              Every one — <span className="text-azure">answered</span>.
            </motion.h2>
          </div>

          <div className="mt-8 grid w-full max-w-2xl grid-cols-2 gap-2 sm:gap-3">
            {SECTIONS.map((section, i) => (
              <EvidenceCard
                key={section.index}
                p={p}
                i={i}
                index={section.index}
                phrase={section.keyPhrase}
                isMobile={isMobile}
              />
            ))}
          </div>
        </motion.div>

        {/* Phase 3: the CTA rises */}
        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY, pointerEvents: ctaEvents }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
          id="signup"
        >
          <CtaContent />
        </motion.div>

        <p className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.3em] text-porcelain/30">
          © {new Date().getFullYear()} Acme Test · Coming Soon
        </p>
      </div>
    </section>
  );
}

/**
 * One collected accusation. Enters from the rail's side of the screen,
 * then flips to its redacted back: answered, but sealed until launch.
 */
function EvidenceCard({
  p,
  i,
  index,
  phrase,
  isMobile,
}: {
  p: MotionValue<number>;
  i: number;
  index: string;
  phrase: string;
  isMobile: boolean;
}) {
  const enter = 0.08 + i * 0.028;
  const flip = 0.38 + i * 0.028;

  const opacity = useTransform(p, [enter, enter + 0.07], [0, 1]);
  const x = useTransform(p, [enter, enter + 0.07], [isMobile ? 0 : 140, 0]);
  const y = useTransform(p, [enter, enter + 0.07], [isMobile ? 40 : 0, 0]);
  const rotateY = useTransform(p, [flip, flip + 0.1], [0, 180]);

  // Deterministic pseudo-random redaction widths.
  const w1 = 55 + ((i * 37) % 30);
  const w2 = 35 + ((i * 23) % 40);

  return (
    <motion.div style={{ opacity, x, y, perspective: 900 }} className="h-14 sm:h-16">
      <motion.div
        style={{ rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        {/* front: the accusation */}
        <div className="absolute inset-0 flex items-center gap-3 border border-white/10 bg-white/[0.03] px-3 [backface-visibility:hidden] sm:px-4">
          <span className="font-mono text-[10px] text-azure/80">{index}</span>
          <span className="truncate font-display text-xs font-semibold uppercase tracking-wide text-porcelain/90 sm:text-sm">
            {phrase}
          </span>
        </div>
        {/* back: answered, redacted */}
        <div className="absolute inset-0 flex items-center justify-between border border-azure/40 bg-azure/[0.06] px-3 [backface-visibility:hidden] [transform:rotateY(180deg)] sm:px-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 pr-3">
            <span className="block h-1.5 rounded-sm bg-porcelain/25 blur-[2px]" style={{ width: `${w1}%` }} />
            <span className="block h-1.5 rounded-sm bg-porcelain/15 blur-[2px]" style={{ width: `${w2}%` }} />
          </div>
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-azure">
            Answered
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CtaContent() {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center">
      <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-porcelain/40">
        One answer
      </span>
      <h2 className="mt-6 text-balance font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-porcelain sm:text-5xl md:text-6xl">
        What if investing could be{" "}
        <span className="text-vermilion">different?</span>
      </h2>
      <p className="mt-6 font-display text-lg text-porcelain/70">
        The answers arrive in 2026. Be the first to see them.
      </p>
      <div className="mt-8 w-full">
        <SignupForm />
      </div>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-porcelain/30">
        One email at launch. Nothing else.
      </p>
      <LogoMark className="mt-12 h-10 w-10 opacity-80" />
    </div>
  );
}
