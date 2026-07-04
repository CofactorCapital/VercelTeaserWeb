import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Chapter } from "@/components/Chapter";
import { Finale } from "@/components/Finale";
import { LedgerRail } from "@/components/LedgerRail";
import { LedgerProvider } from "@/lib/ledger";
import { SECTIONS } from "@/lib/content";

/**
 * One continuous scroll story:
 *
 *   Hero      — the premise, and the promise of eight questions
 *   Chapters  — each pins, builds its questions, stamps its accusation
 *               into the persistent evidence ledger, and hands off
 *   Finale    — the ledger converges, flips to ANSWERED (redacted),
 *               and resolves into the signup CTA
 */
export default function Home() {
  return (
    <LedgerProvider count={SECTIONS.length}>
      <main className="relative bg-obsidian">
        <Header />
        <Hero />
        {SECTIONS.map((section, i) => (
          <Chapter key={section.index} section={section} index={i} />
        ))}
        <Finale />
        <LedgerRail />
      </main>
    </LedgerProvider>
  );
}
