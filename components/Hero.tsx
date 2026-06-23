"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { LogoMark } from "./Logo";
import { Reveal } from "./Reveal";
import { ScrollCue } from "./ScrollCue";
import { usePointerTilt } from "@/lib/usePointerTilt";
import { FAITH_LINES } from "@/lib/content";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const tilt = usePointerTilt(14);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Aggressive exit: the wordmark block recedes into the screen, tips back on
  // its X axis and fades as the hero scrolls away — like falling into depth.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const z = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const rotateExit = useTransform(scrollYProgress, [0, 1], [0, 22]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  // Background glow drifts opposite the pointer for layered depth.
  const glowX = useTransform(tilt.px, [-1, 1], ["8%", "-8%"]);
  const glowY = useTransform(tilt.py, [-1, 1], ["8%", "-8%"]);

  return (
    <section
      ref={ref}
      data-snap
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      className="bg-grid relative flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* radial glow — parallaxes with the pointer */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { x: glowX, y: glowY }}
        className="pointer-events-none absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-azure/10 blur-[120px]"
      />

      <motion.div
        style={
          reduce
            ? undefined
            : {
                y,
                z,
                scale,
                opacity,
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
              }
        }
        className="gpu-3d relative z-10 flex max-w-3xl flex-col items-center"
      >
        {/* Counter-rotate the exit tip so scroll depth reads on the block itself. */}
        <motion.div
          style={reduce ? undefined : { rotateX: rotateExit }}
          className="gpu-3d flex flex-col items-center"
        >
          <Reveal z>
            <LogoMark className="mb-8 h-16 w-16 sm:h-20 sm:w-20" />
          </Reveal>

          <Reveal delay={0.08} as="h1" z>
            <span className="block font-display text-4xl font-extrabold uppercase tracking-[0.18em] text-porcelain sm:text-5xl md:text-6xl">
              Acme Test
            </span>
          </Reveal>

          <Reveal delay={0.16} z>
            <span className="mt-5 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.4em] text-azure">
              <span className="h-px w-8 bg-azure/50" />
              Coming Soon
              <span className="h-px w-8 bg-azure/50" />
            </span>
          </Reveal>

          <Reveal delay={0.26} as="p" className="mt-10" z>
            <span className="text-balance font-display text-xl font-medium leading-snug text-porcelain sm:text-2xl md:text-[28px]">
              The investment industry asks investors to accept a lot on faith.
            </span>
          </Reveal>

          <div className="mt-8 space-y-1">
            {FAITH_LINES.map((line, i) => (
              <Reveal
                key={line}
                as="p"
                delay={0.32 + i * 0.08}
                y={14}
                z
                className="font-display text-base text-porcelain/60 sm:text-lg"
              >
                {line}
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.8} as="p" className="mt-10" z>
            <span className="font-display text-lg italic text-porcelain/80">
              We&rsquo;ve always wondered why.
            </span>
          </Reveal>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <ScrollCue label="Scroll" />
      </div>
    </section>
  );
}
