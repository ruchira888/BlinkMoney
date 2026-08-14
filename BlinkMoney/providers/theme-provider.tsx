/**
 * App-wide colour scheme.
 *
 * Rule 5: this provider wraps <Stack>, so it must not call useNavigation,
 * useRoute, useFocusEffect or useNavigationState -- directly or through a hook
 * it imports. It holds scheme state and nothing else, which is what keeps it
 * safe to mount above the navigator.
 *
 * The app opens dark by design rather than following the OS. The scheme lives
 * in memory only: there is no AsyncStorage in this project and adding a native
 * module purely to remember a toggle is not worth the Expo Go risk, so a
 * reload returns to dark.
 */

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { Palettes, type ColorSchemeName, type ThemePalette } from '@/constants/theme';

type ThemeContextValue = {
  scheme: ColorSchemeName;
  colors: ThemePalette;
  /** True when `scheme === 'dark'`, for the many `isDark ? a : b` reads. */
  isDark: boolean;
  toggle: () => void;
  setScheme: (next: ColorSchemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [scheme, setScheme] = useState<ColorSchemeName>('dark');

  const toggle = useCallback(() => {
    setScheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      scheme,
      colors: Palettes[scheme],
      isDark: scheme === 'dark',
      toggle,
      setScheme,
    }),
    [scheme, toggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Throws rather than falling back to a default palette. A silent fallback here
 * produces a screen that renders in the wrong theme with no error, which is
 * far harder to spot than a missing-provider crash on first run.
 */
export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used inside <ThemeProvider>.');
  }
  return value;
}
