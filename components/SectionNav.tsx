"use client";

import { useEffect, useState } from "react";

/**
 * Fixed vertical dot navigation. Self-discovers every [data-snap] panel,
 * highlights the one currently in view, and jumps on click.
 */
export function SectionNav({ count }: { count?: number }) {
  const [panels, setPanels] = useState<HTMLElement[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-snap]")
    );
    setPanels(nodes);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = nodes.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { threshold: 0.55 }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  // `count` is informational only; the real list comes from the DOM.
  void count;

  if (panels.length === 0) return null;

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex"
    >
      {panels.map((panel, i) => {
        const isActive = i === active;
        return (
          <button
            key={i}
            type="button"
            aria-label={`Go to section ${i + 1}`}
            aria-current={isActive}
            onClick={() => panel.scrollIntoView({ behavior: "smooth" })}
            className="group flex h-3 items-center"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "h-3 w-3 bg-azure"
                  : "h-1.5 w-1.5 bg-porcelain/25 group-hover:bg-porcelain/60"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
