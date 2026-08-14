/**
 * App-wide colour scheme.
 *
 * The app is dark only. There is no toggle and no light/dark switching, so the
 * scheme is a constant rather than state -- nothing can change it at runtime,
 * and pretending otherwise with a setter nobody calls would be dead weight.
 *
 * This stays a provider rather than a plain import because every screen and
 * component already reads its palette through useTheme, and a single hook is
 * the seam to change if the app ever does gain a light mode.
 *
 * Rule 5: this wraps <Stack> and calls no navigation hooks, which is what
 * makes it safe to mount above the navigator.
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { Palettes, type ColorSchemeName, type ThemePalette } from '@/constants/theme';

type ThemeContextValue = {
  scheme: ColorSchemeName;
  colors: ThemePalette;
  /** Always true. Kept so callers reading it for StatusBar style still work. */
  isDark: boolean;
};

const SCHEME: ColorSchemeName = 'dark';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const value = useMemo<ThemeContextValue>(
    () => ({
      scheme: SCHEME,
      colors: Palettes[SCHEME],
      isDark: true,
    }),
    []
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Throws rather than falling back to a default palette. A silent fallback
 * produces a screen that renders in the wrong colours with no error, which is
 * harder to spot than a missing-provider crash on first run.
 */
export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used inside <ThemeProvider>.');
  }
  return value;
}
