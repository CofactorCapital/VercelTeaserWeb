type Tone = "dark" | "light";

type LogoProps = {
  className?: string;
  /** "dark" = for dark backgrounds (default). "light" = for light backgrounds. */
  tone?: Tone;
};

/**
 * Acme Test mark — a plus/cross built from rounded bars:
 * vertical bar + azure horizontals + vermilion center.
 * The vertical bar flips to porcelain on dark backgrounds so it stays visible.
 */
export function LogoMark({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: Tone;
}) {
  const vertical = tone === "dark" ? "#ECEEF3" : "#0B0E16";
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Acme Test logo"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* vertical bar */}
      <rect x="78" y="20" width="44" height="160" rx="10" fill={vertical} />
      {/* horizontal bars (azure) */}
      <rect x="20" y="78" width="160" height="44" rx="10" fill="#4571F4" />
      {/* center accent (vermilion) */}
      <rect x="80" y="80" width="40" height="40" rx="6" fill="#F06A45" />
    </svg>
  );
}

export function Logo({ className, tone = "dark" }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <LogoMark className="h-7 w-7" tone={tone} />
      <span className="font-display text-sm font-semibold uppercase tracking-[0.28em] text-porcelain/90">
        Acme&nbsp;Test
      </span>
    </div>
  );
}
