"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type LedgerState = {
  /** One flag per chapter — true once its accusation has been stamped in. */
  collected: boolean[];
  /** Mark chapter i collected/uncollected (scrubbing back un-collects). */
  mark: (i: number, value: boolean) => void;
  /** The finale hides the rail while it pulls the evidence center-stage. */
  railHidden: boolean;
  setRailHidden: (hidden: boolean) => void;
};

const LedgerContext = createContext<LedgerState | null>(null);

export function LedgerProvider({
  count,
  children,
}: {
  count: number;
  children: ReactNode;
}) {
  const [collected, setCollected] = useState<boolean[]>(() =>
    Array(count).fill(false)
  );
  const [railHidden, setRailHidden] = useState(false);

  const mark = useCallback((i: number, value: boolean) => {
    setCollected((prev) => {
      if (prev[i] === value) return prev;
      const next = [...prev];
      next[i] = value;
      return next;
    });
  }, []);

  const state = useMemo(
    () => ({ collected, mark, railHidden, setRailHidden }),
    [collected, mark, railHidden]
  );

  return (
    <LedgerContext.Provider value={state}>{children}</LedgerContext.Provider>
  );
}

export function useLedger(): LedgerState {
  const ctx = useContext(LedgerContext);
  if (!ctx) throw new Error("useLedger must be used inside <LedgerProvider>");
  return ctx;
}
