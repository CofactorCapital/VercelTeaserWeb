"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { usePointerTilt } from "@/lib/usePointerTilt";
import type { Section } from "@/lib/content";

export type Direction = "left" | "right" | "up";

// Each direction enters from a different point in 3D space: off to one side and
// rotated on its Y hinge, or rising from below tipped back on its X hinge.
const ENTER: Record<Direction, { x: number; y: number; rotateX: number; rotateY: number }> = {
  left: { x: -260, y: 0, rotateX: 0, rotateY: 38 },
  right: { x: 260, y: 0, rotateX: 0, rotateY: -38 },
  up: { x: 0, y: 200, rotateX: -45, rotateY: 0 },
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
  const tilt = usePointerTilt(10);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // The oversized ghost index barrel-rolls through 3D space: it sweeps across,
  // spins on its Y axis and rushes toward then away from the camera in Z.
  const ghostY = useTransform(scrollYProgress, [0, 1], ["55%", "-55%"]);
  const ghostX = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "right" ? ["28%", "-28%"] : ["-28%", "28%"]
  );
  const ghostRotateY = useTransform(scrollYProgress, [0, 1], [-65, 65]);
  const ghostRotateZ = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const ghostZ = useTransform(scrollYProgress, [0, 0.5, 1], [-500, 120, -500]);
  const ghostOpacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [0, 0.14, 0.14, 0]
  );

  // The content slab drifts opposite the ghost and tips on the scroll axis for
  // depth, on top of the live pointer tilt.
  const contentY = useTransform(scrollYProgress, [0, 1], ["14%", "-14%"]);
  const scrollTip = useTransform(scrollYProgress, [0, 0.5, 1], [9, 0, -9]);

  const enter = ENTER[direction];

  const container: Variants = {
    hidden: {
      opacity: 0,
      x: reduce ? 0 : enter.x,
      y: reduce ? 0 : enter.y,
      z: reduce ? 0 : -420,
      rotateX: reduce ? 0 : enter.rotateX,
      rotateY: reduce ? 0 : enter.rotateY,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      z: 0,
      rotateX: 0,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 52,
        damping: 17,
        mass: 1,
        staggerChildren: 0.07,
        delayChildren: 0.05,
      },
    },
  };

  const item: Variants = {
    hidden: {
      opacity: 0,
      x: reduce ? 0 : enter.x * 0.18,
      y: reduce ? 0 : (enter.y || 40) * 0.4,
      z: reduce ? 0 : -140,
      rotateY: reduce ? 0 : enter.rotateY * 0.4,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      z: 0,
      rotateY: 0,
      transition: { type: "spring", stiffness: 85, damping: 18 },
    },
  };

  return (
    <section
      ref={ref}
      data-snap
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      className="relative flex h-[100svh] w-full items-center overflow-hidden border-t border-white/5"
    >
      {/* Oversized ghost index barrel-rolling in the background */}
      <motion.span
        aria-hidden="true"
        style={
          reduce
            ? { opacity: 0.06 }
            : {
                y: ghostY,
                x: ghostX,
                z: ghostZ,
                rotateY: ghostRotateY,
                rotateZ: ghostRotateZ,
                opacity: ghostOpacity,
              }
        }
        className="gpu-3d pointer-events-none absolute right-[-6%] top-1/2 -translate-y-1/2 select-none font-display text-[40vw] font-black leading-none text-azure md:text-[26vw]"
      >
        {section.index}
      </motion.span>

      <motion.div
        style={
          reduce
            ? undefined
            : {
                y: contentY,
                rotateX: scrollTip,
              }
        }
        className="gpu-3d relative z-10 mx-auto w-full max-w-5xl px-6 md:px-10"
      >
        {/* Live pointer tilt rides on top of the scroll-driven depth. */}
        <motion.div
          style={reduce ? undefined : { rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
          className="gpu-3d"
        >
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.45 }}
            className="gpu-3d"
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
      </motion.div>
    </section>
  );
}
