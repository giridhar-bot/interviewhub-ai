/**
 * Design Tokens — InterviewHub AI
 *
 * Single source of truth for spacing, breakpoints, shadows,
 * container sizes, and z-index scale used across the app.
 */

// ─── Spacing (4px base) ──────────────────────────
export const spacing = {
  xs: "0.25rem",   // 4px
  sm: "0.5rem",    // 8px
  md: "1rem",      // 16px
  lg: "1.5rem",    // 24px
  xl: "2rem",      // 32px
  "2xl": "3rem",   // 48px
  "3xl": "4rem",   // 64px
} as const;

// ─── Breakpoints ─────────────────────────────────
export const breakpoints = {
  sm: 640,   // Mobile landscape
  md: 768,   // Tablet
  lg: 1024,  // Desktop
  xl: 1280,  // Wide desktop
  "2xl": 1536,
} as const;

// ─── Grid Columns ────────────────────────────────
export const grid = {
  mobile: 4,
  tablet: 8,
  desktop: 12,
} as const;

// ─── Container Sizes ─────────────────────────────
export const containers = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  wide: "1440px",
} as const;

// ─── Shadows ─────────────────────────────────────
export const shadows = {
  card: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
  dropdown: "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)",
  modal: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  floating: "0 25px 50px -12px rgb(0 0 0 / 0.15)",
} as const;

// ─── Z-Index Scale ───────────────────────────────
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  overlay: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
} as const;

// ─── Icon Sizes ──────────────────────────────────
export const iconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
} as const;

// ─── Transition Durations ────────────────────────
export const durations = {
  fast: "150ms",
  normal: "200ms",
  slow: "300ms",
  slower: "500ms",
} as const;
