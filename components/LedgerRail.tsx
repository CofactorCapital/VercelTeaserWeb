"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLedger } from "@/lib/ledger";
import { useViewport } from "@/lib/viewport";
import { chipTarget, DESKTOP_RIGHT_PAD } from "@/lib/rail";
import { SECTIONS } from "@/lib/content";

/**
 * The evidence ledger — a persistent rail that accumulates each chapter's
 * accusation as the reader scrolls. Vertical stack on the right edge for
 * desktop; a row of ticks along the bottom on mobile.
 * Chips double as navigation back to their chapter.
 */
export function LedgerRail() {
  const { collected, railHidden } = useLedger();
  const { w, h, isMobile } = useViewport();
  const reduce = useReducedMotion();

  if (reduce) return null;

  const count = SECTIONS.length;
  const found = collected.filter(Boolean).length;

  const goTo = (i: number) => {
    const el = document.getElementById(`chapter-${i}`);
    if (!el) return;
    // Land exactly on the aligned slide start; the reveal plays from there.
    const top = el.getBoundingClientRect().top + window.scrollY + 2;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <motion.div
      aria-hidden={railHidden}
      initial={false}
      animate={{ opacity: railHidden ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      className="pointer-events-none fixed inset-0 z-40"
      style={{ pointerEvents: "none" }}
    >
      {SECTIONS.map((section, i) => {
        const target = chipTarget(i, count, w, h, isMobile);
        const isOn = collected[i];

        if (isMobile) {
          return (
            <button
              key={section.index}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to chapter ${section.index}: ${section.title}`}
              className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 p-2"
              style={{
                left: target.x,
                top: target.y,
                pointerEvents: railHidden ? "none" : "auto",
              }}
            >
              <motion.span
                initial={false}
                animate={{
                  backgroundColor: isOn
                    ? "rgba(69, 113, 244, 1)"
                    : "rgba(236, 238, 243, 0.35)",
                  scaleX: isOn ? 1 : 0.6,
                }}
                className="block h-[3px] w-4 rounded-full"
              />
            </button>
          );
        }

        return (
          <button
            key={section.index}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to chapter ${section.index}: ${section.title}`}
            className="group absolute flex -translate-y-1/2 items-center justify-end gap-3 p-1"
            style={{
              right: DESKTOP_RIGHT_PAD,
              top: target.y,
              pointerEvents: railHidden ? "none" : "auto",
            }}
          >
            <motion.span
              initial={false}
              animate={{ opacity: isOn ? 1 : 0, x: isOn ? 0 : 10 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-porcelain/60 group-hover:text-porcelain/90"
            >
              {section.keyPhrase}
            </motion.span>
            <motion.span
              initial={false}
              animate={{
                backgroundColor: isOn
                  ? "rgba(69, 113, 244, 1)"
                  : "rgba(236, 238, 243, 0)",
                borderColor: isOn
                  ? "rgba(69, 113, 244, 1)"
                  : "rgba(236, 238, 243, 0.25)",
                scale: isOn ? 1 : 0.8,
              }}
              className="block h-2 w-2 rounded-full border"
            />
          </button>
        );
      })}

      {/* Running tally, one slot below the stack (desktop only). */}
      {!isMobile ? (
        <span
          className="absolute -translate-y-1/2 font-mono text-[10px] tracking-[0.2em] text-porcelain/30"
          style={{
            right: DESKTOP_RIGHT_PAD,
            top: chipTarget(count, count, w, h, false).y + 8,
          }}
        >
          {found} / {count}
        </span>
      ) : null}
    </motion.div>
  );
}
