"use client";

import { useEffect, useState } from "react";

export type Viewport = {
  w: number;
  h: number;
  isMobile: boolean;
};

/**
 * Live viewport size, used to compute deterministic fly-to-ledger targets.
 * Starts with a desktop-ish guess for SSR; corrects itself on mount/resize.
 */
export function useViewport(): Viewport {
  const [vp, setVp] = useState<Viewport>({ w: 1280, h: 800, isMobile: false });

  useEffect(() => {
    const read = () =>
      setVp({
        w: window.innerWidth,
        h: window.innerHeight,
        isMobile: window.innerWidth < 768,
      });
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  return vp;
}
