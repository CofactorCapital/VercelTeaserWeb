"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Subtle animated down-arrow used between sections. */
export function ScrollCue({ label }: { label?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col items-center gap-3 text-porcelain/40">
      {label ? (
        <span className="font-mono text-[10px] uppercase tracking-[0.32em]">
          {label}
        </span>
      ) : null}
      <motion.svg
        width="18"
        height="28"
        viewBox="0 0 18 28"
        fill="none"
        aria-hidden="true"
        animate={reduce ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M9 1v22M2 16l7 7 7-7"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </div>
  );
}
