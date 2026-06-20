import { Logo } from "@/components/Logo";
import { Hero } from "@/components/Hero";
import { QuestionSection, type Direction } from "@/components/QuestionSection";
import { FinalSection } from "@/components/FinalSection";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SectionNav } from "@/components/SectionNav";
import { SECTIONS } from "@/lib/content";

// Alternating entrance choreography across the eight panels.
const DIRECTIONS: Direction[] = [
  "left",
  "right",
  "left",
  "right",
  "up",
  "left",
  "right",
  "up",
];

export default function Home() {
  return (
    <main className="relative bg-obsidian">
      <ScrollProgress />
      <SectionNav count={SECTIONS.length} />

      {/* Minimal fixed header */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-10">
        <Logo />
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.32em] text-porcelain/40 sm:block">
          Est. 2026
        </span>
      </header>

      <Hero />

      {SECTIONS.map((section, i) => (
        <QuestionSection
          key={section.index}
          section={section}
          direction={DIRECTIONS[i % DIRECTIONS.length]}
        />
      ))}

      <FinalSection />
    </main>
  );
}
