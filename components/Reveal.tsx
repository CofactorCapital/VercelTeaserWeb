"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds. */
  delay?: number;
  /** Vertical travel distance in px. */
  y?: number;
  /** Use a 3D entrance: the element rises out of depth and tips upright. */
  z?: boolean;
  as?: "div" | "li" | "p" | "span" | "h1" | "h2" | "h3";
};

/**
 * A scroll-reveal. By default a restrained fade + short upward travel.
 * With `z`, it becomes an aggressive 3D entrance — the element starts pushed
 * back into the screen and tipped forward, then springs upright into place.
 * Respects prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  z = false,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();

  const variants: Variants = z
    ? {
        hidden: reduce
          ? { opacity: 0 }
          : { opacity: 0, y: y * 1.5, z: -380, rotateX: -55 },
        visible: {
          opacity: 1,
          y: 0,
          z: 0,
          rotateX: 0,
          transition: reduce
            ? { duration: 0.4, delay }
            : { type: "spring", stiffness: 70, damping: 16, delay },
        },
      }
    : {
        hidden: { opacity: 0, y: reduce ? 0 : y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
        },
      };

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={z ? `gpu-3d ${className ?? ""}` : className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </MotionTag>
  );
}
