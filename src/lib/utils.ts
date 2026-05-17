import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional class names safely with Tailwind conflict resolution.
 *
 * Example:
 * cn("p-2", isActive && "bg-red-500", "p-4")
 * → "bg-red-500 p-4"
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(...inputs));
}

/* -------------------------------------------------------------------------- */
/* Optional Utility Helpers (safe additions, zero breaking changes)           */
/* -------------------------------------------------------------------------- */

/**
 * Format large numbers for UI.
 * 1200 → 1.2K
 */
export function compactNumber(value: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Safe percentage formatter.
 * 0.456 → 46%
 */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Clamp a number between min and max.
 */
export function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Delay helper for animations/testing.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}