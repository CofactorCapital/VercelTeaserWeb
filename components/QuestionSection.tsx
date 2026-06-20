"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import type { Section } from "@/lib/content";
import { Reveal } from "./Reveal";

export function QuestionSection({ section }: { section: Section }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Restrained parallax: the oversized ghost index drifts gently.
  const ghostY = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);
  const ghostOpacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [0, 0.06, 0.06, 0]
  );

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen w-full items-center overflow-hidden border-t border-white/5 py-28"
    >
      {/* Oversized ghost index in the background */}
      <motion.span
        aria-hidden="true"
        style={
          reduce
            ? { opacity: 0.05 }
            : { y: ghostY, opacity: ghostOpacity }
        }
        className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none font-display text-[34vw] font-black leading-none text-azure md:text-[24vw]"
      >
        {section.index}
      </motion.span>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 md:px-10">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tracking-[0.3em] text-azure">
              {section.index}
            </span>
            <span className="h-px w-12 bg-azure/40" />
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-porcelain/40">
              The questions
            </span>
          </div>
        </Reveal>

        <Reveal as="h2" delay={0.05} className="mt-6">
          <span className="block font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-porcelain sm:text-6xl md:text-7xl">
            {section.title}
          </span>
        </Reveal>

        {section.intro ? (
          <div className="mt-8 max-w-2xl space-y-1">
            {section.intro.map((line, i) => (
              <Reveal
                as="p"
                key={line}
                delay={0.1 + i * 0.06}
                className="font-display text-lg text-porcelain/70 sm:text-xl"
              >
                {line}
              </Reveal>
            ))}
          </div>
        ) : null}

        <ul className="mt-10 max-w-3xl space-y-5 border-l border-white/10 pl-6">
          {section.questions.map((q, i) => (
            <Reveal
              as="li"
              key={q}
              delay={0.12 + i * 0.07}
              y={18}
              className="text-balance font-display text-xl font-medium leading-snug text-porcelain/90 sm:text-2xl"
            >
              {q}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
