"use client";

import { useRef } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

type Tilt = {
  /** Attach to the element you want to track the pointer over. */
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerLeave: () => void;
  /** Spring-smoothed rotation, in degrees, to feed into rotateX / rotateY. */
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  /** Spring-smoothed pointer offset (-1..1) for layered parallax. */
  px: MotionValue<number>;
  py: MotionValue<number>;
};

/**
 * Pointer-driven 3D tilt. Tracks the cursor across the element and maps it to
 * a spring-damped rotation, mont-fort style. Returns flat (no-op) values when
 * the user prefers reduced motion.
 *
 * @param max Maximum tilt in degrees at the edges.
 */
export function usePointerTilt(max = 12): Tilt {
  const reduce = useReducedMotion();
  const ref = useRef<DOMRect | null>(null);

  const rawX = useMotionValue(0); // -1..1, horizontal
  const rawY = useMotionValue(0); // -1..1, vertical

  const spring = { stiffness: 120, damping: 18, mass: 0.6 };
  const px = useSpring(rawX, spring);
  const py = useSpring(rawY, spring);

  // Cursor right -> rotate toward the right (positive rotateY); cursor down ->
  // tip the top back (negative rotateX). Reduced motion flattens to zero.
  const rotateY = useTransform(px, [-1, 1], [-max, max]);
  const rotateX = useTransform(py, [-1, 1], [max, -max]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce) return;
    const el = e.currentTarget as HTMLElement;
    const rect = ref.current ?? el.getBoundingClientRect();
    ref.current = rect;
    const x = (e.clientX - rect.left) / rect.width; // 0..1
    const y = (e.clientY - rect.top) / rect.height; // 0..1
    rawX.set(x * 2 - 1);
    rawY.set(y * 2 - 1);
  };

  const onPointerLeave = () => {
    ref.current = null;
    rawX.set(0);
    rawY.set(0);
  };

  const zero = useMotionValue(0);

  return reduce
    ? {
        onPointerMove,
        onPointerLeave,
        rotateX: zero,
        rotateY: zero,
        px: zero,
        py: zero,
      }
    : { onPointerMove, onPointerLeave, rotateX, rotateY, px, py };
}
