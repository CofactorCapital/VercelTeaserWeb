"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LogoMark } from "./Logo";
import { Reveal } from "./Reveal";
import { SignupForm } from "./SignupForm";
import { usePointerTilt } from "@/lib/usePointerTilt";

export function FinalSection() {
  const reduce = useReducedMotion();
  const tilt = usePointerTilt(10);

  return (
    <section
      data-snap
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      className="relative flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden border-t border-white/5 px-6 py-20 text-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-vermilion/10 blur-[130px]"
      />

      <motion.div
        style={reduce ? undefined : { rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
        className="gpu-3d relative z-10 flex max-w-2xl flex-col items-center"
      >
        <Reveal z>
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-porcelain/40">
            A simple question
          </span>
        </Reveal>

        <Reveal delay={0.08} as="h2" className="mt-6" z>
          <span className="text-balance block font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-porcelain sm:text-5xl md:text-6xl">
            What if investing could be{" "}
            <span className="text-vermilion">different?</span>
          </span>
        </Reveal>

        <Reveal delay={0.18} as="p" className="mt-8" z>
          <span className="font-display text-lg text-porcelain/70">
            Be the first to know.
          </span>
        </Reveal>

        <Reveal delay={0.26} className="mt-8 w-full" z>
          <SignupForm />
        </Reveal>

        <Reveal delay={0.34} className="mt-14" z>
          <LogoMark className="h-10 w-10 opacity-80" />
        </Reveal>
      </motion.div>

      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-porcelain/30">
        © {new Date().getFullYear()} Acme Test · Coming Soon
      </p>
    </section>
  );
}
