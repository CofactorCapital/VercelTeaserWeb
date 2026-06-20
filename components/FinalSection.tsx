"use client";

import { LogoMark } from "./Logo";
import { Reveal } from "./Reveal";
import { SignupForm } from "./SignupForm";

export function FinalSection() {
  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden border-t border-white/5 px-6 py-28 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-vermilion/10 blur-[130px]"
      />

      <div className="relative z-10 flex max-w-2xl flex-col items-center">
        <Reveal>
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-porcelain/40">
            A simple question
          </span>
        </Reveal>

        <Reveal delay={0.08} as="h2" className="mt-6">
          <span className="text-balance block font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-porcelain sm:text-5xl md:text-6xl">
            What if investing could be{" "}
            <span className="text-vermilion">different?</span>
          </span>
        </Reveal>

        <Reveal delay={0.18} as="p" className="mt-8">
          <span className="font-display text-lg text-porcelain/70">
            Be the first to know.
          </span>
        </Reveal>

        <Reveal delay={0.26} className="mt-8 w-full">
          <SignupForm />
        </Reveal>

        <Reveal delay={0.34} className="mt-16">
          <LogoMark className="h-10 w-10 opacity-80" />
        </Reveal>
      </div>
    </section>
  );
}
