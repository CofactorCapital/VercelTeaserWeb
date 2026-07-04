"use client";

import { Logo } from "./Logo";

/**
 * Fixed header with a persistent CTA, so a visitor who bails mid-story can
 * still convert without reaching the finale.
 */
export function Header() {
  const goToSignup = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
      <Logo />
      <div className="flex items-center gap-6">
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.32em] text-porcelain/40 sm:block">
          Est. 2026
        </span>
        <button
          type="button"
          onClick={goToSignup}
          className="rounded-full border border-azure/50 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-porcelain/90 transition hover:border-azure hover:bg-azure/10"
        >
          Get early access
        </button>
      </div>
    </header>
  );
}
