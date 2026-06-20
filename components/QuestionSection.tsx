"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import type { Section } from "@/lib/content";

export type Direction = "left" | "right" | "up";

const ENTER: Record<Direction, { x: number; y: number }> = {
  left: { x: -160, y: 0 },
  right: { x: 160, y: 0 },
  up: { x: 0, y: 110 },
};

export function QuestionSection({
  section,
  direction = "up",
}: {
  section: Section;
  direction?: Direction;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Bold parallax: the oversized ghost index sweeps and counter-rotates.
  const ghostY = useTransform(scrollYProgress, [0, 1], ["45%", "-45%"]);
  const ghostX = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "right" ? ["20%", "-20%"] : ["-20%", "20%"]
  );
  const ghostRotate = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const ghostOpacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [0, 0.1, 0.1, 0]
  );

  // The content block drifts opposite the ghost for depth.
  const contentY = useTransform(scrollYProgress, [0, 1], ["18%", "-18%"]);

  const enter = ENTER[direction];

  const container: Variants = {
    hidden: {
      opacity: 0,
      x: reduce ? 0 : enter.x,
      y: reduce ? 0 : enter.y,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 55,
        damping: 16,
        mass: 0.9,
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const item: Variants = {
    hidden: {
      opacity: 0,
      x: reduce ? 0 : enter.x * 0.25,
      y: reduce ? 0 : (enter.y || 30) * 0.4,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 90, damping: 18 },
    },
  };

  return (
    <section
      ref={ref}
      data-snap
      className="relative flex h-[100svh] w-full items-center overflow-hidden border-t border-white/5"
    >
      {/* Oversized ghost index in the background */}
      <motion.span
        aria-hidden="true"
        style={
          reduce
            ? { opacity: 0.06 }
            : {
                y: ghostY,
                x: ghostX,
                rotate: ghostRotate,
                opacity: ghostOpacity,
              }
        }
        className="pointer-events-none absolute right-[-6%] top-1/2 -translate-y-1/2 select-none font-display text-[40vw] font-black leading-none text-azure md:text-[26vw]"
      >
        {section.index}
      </motion.span>

      <motion.div
        style={reduce ? undefined : { y: contentY }}
        className="relative z-10 mx-auto w-full max-w-5xl px-6 md:px-10"
      >
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.45 }}
        >
          <motion.div variants={item} className="flex items-center gap-4">
            <span className="font-mono text-xs tracking-[0.3em] text-azure">
              {section.index}
            </span>
            <span className="h-px w-12 bg-azure/40" />
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-porcelain/40">
              The questions
            </span>
          </motion.div>

          <motion.h2 variants={item} className="mt-5">
            <span className="block font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-porcelain sm:text-6xl md:text-7xl">
              {section.title}
            </span>
          </motion.h2>

          {section.intro ? (
            <div className="mt-6 max-w-2xl space-y-1">
              {section.intro.map((line) => (
                <motion.p
                  variants={item}
                  key={line}
                  className="font-display text-lg text-porcelain/70 sm:text-xl"
                >
                  {line}
                </motion.p>
              ))}
            </div>
          ) : null}

          <ul className="mt-8 max-w-3xl space-y-3 border-l border-white/10 pl-6 sm:space-y-4">
            {section.questions.map((q) => (
              <motion.li
                variants={item}
                key={q}
                className="text-balance font-display text-lg font-medium leading-snug text-porcelain/90 sm:text-xl md:text-2xl"
              >
                {q}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
