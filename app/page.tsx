import { Logo } from "@/components/Logo";
import { Hero } from "@/components/Hero";
import { QuestionSection } from "@/components/QuestionSection";
import { FinalSection } from "@/components/FinalSection";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SECTIONS } from "@/lib/content";

export default function Home() {
  return (
    <main className="relative bg-obsidian">
      <ScrollProgress />

      {/* Minimal fixed header */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-10">
        <Logo />
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.32em] text-porcelain/40 sm:block">
          Est. 2026
        </span>
      </header>

      <Hero />

      {SECTIONS.map((section) => (
        <QuestionSection key={section.index} section={section} />
      ))}

      <FinalSection />

      <footer className="border-t border-white/5 px-6 py-10 text-center md:px-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-porcelain/30">
          © {new Date().getFullYear()} Acme Test · Coming Soon
        </p>
      </footer>
    </main>
  );
}
