/**
 * Shared geometry for the evidence ledger rail.
 *
 * Both the rail (which renders the chips) and each chapter (which flies its
 * stamped accusation into the rail) derive positions from these functions, so
 * the handoff lands on the slot without any DOM measurement.
 *
 * Desktop: a vertical stack of slots centered on the right edge.
 * Mobile: a horizontal row of ticks centered along the bottom.
 */

export const DESKTOP_SLOT_H = 40;
export const DESKTOP_RIGHT_PAD = 24;
export const MOBILE_SLOT_W = 30;
export const MOBILE_BOTTOM = 34;

/** Viewport coordinates of slot i's center. */
export function chipTarget(
  i: number,
  count: number,
  w: number,
  h: number,
  isMobile: boolean
): { x: number; y: number } {
  if (isMobile) {
    return {
      x: w / 2 + (i - (count - 1) / 2) * MOBILE_SLOT_W,
      y: h - MOBILE_BOTTOM,
    };
  }
  return {
    // Roughly where the slot's tick sits; the stamp fades out as it arrives.
    x: w - DESKTOP_RIGHT_PAD - 66,
    y: h / 2 + (i - (count - 1) / 2) * DESKTOP_SLOT_H,
  };
}
