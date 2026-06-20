"use client";

import { useState, type FormEvent } from "react";

/**
 * Visual-only signup form for the teaser pass.
 * The submit handler intentionally does nothing beyond a local UI state change —
 * no email is sent or stored. Wire to Formspree/Tally before production.
 */
export function SignupForm() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // No-op for the visual/workflow check. Production: POST to form endpoint.
    setTouched(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-3 sm:flex-row"
      noValidate
    >
      <label htmlFor="email" className="sr-only">
        Email address
      </label>
      <input
        id="email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-12 flex-1 rounded-full border border-white/15 bg-white/[0.03] px-5 font-mono text-sm text-porcelain placeholder:text-porcelain/30 outline-none transition focus:border-azure focus:bg-white/[0.06]"
      />
      <button
        type="submit"
        className="h-12 shrink-0 rounded-full bg-azure px-7 font-display text-sm font-semibold uppercase tracking-[0.12em] text-snow transition hover:bg-azure/90 active:scale-[0.98]"
      >
        Notify me
      </button>

      {/* aria-live region for the visual-only confirmation */}
      <p className="sr-only" aria-live="polite">
        {touched ? "Thanks — signups are not yet active." : ""}
      </p>
    </form>
  );
}
