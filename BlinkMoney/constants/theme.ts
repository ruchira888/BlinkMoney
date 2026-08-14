/**
 * BlinkMoney design tokens.
 *
 * Single source of truth for colour, spacing, radii, type and motion. Rule 6:
 * components import from here and never hardcode a hex, a gap or a corner.
 *
 * The palette is expressed as two complete sets rather than one set with a few
 * dark overrides. A financial surface inverts more than its background -- the
 * promo cards, the elevation model and the "money green" accent all shift, and
 * expressing that as a diff makes it impossible to read either theme whole.
 *
 * `Colors` and `Fonts` at the bottom are the Expo scaffold's exports, kept
 * because use-theme-color.ts, collapsible.tsx and explore.tsx still consume
 * them.
 */

import { Platform } from 'react-native';

/* -------------------------------------------------------------------------- */
/* Scale                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * 4pt grid. Every margin, padding and gap in the app is one of these -- there
 * is no `marginTop: 13` anywhere.
 */
export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

export const Radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 28,
  /** Fully rounded. Large finite value rather than a fraction so it survives
   *  being used on any element size without Android clipping artefacts. */
  pill: 999,
} as const;

/**
 * Type ramp. `lineHeight` is always set explicitly: Android's default leading
 * differs from iOS's, and a ramp without it drifts between platforms.
 */
export const Typography = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: '800' },
  title: { fontSize: 26, lineHeight: 32, fontWeight: '700' },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '700' },
  subheading: { fontSize: 17, lineHeight: 23, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
  micro: { fontSize: 11, lineHeight: 15, fontWeight: '500' },
} as const;

/**
 * Motion, in ms. Durations are shared with the carousel so the auto-advance
 * interval and the transition that services it can never disagree.
 */
export const Duration = {
  instant: 120,
  fast: 180,
  base: 260,
  slow: 420,
  /** How long a promo card rests before the carousel advances. */
  carouselDwell: 1500,
  /** The slide itself. */
  carouselSlide: 520,
  /** Idle time after a manual swipe before auto-advance resumes, so the
   *  carousel does not yank the card out from under a reading thumb. */
  carouselResume: 5000,
} as const;

/* -------------------------------------------------------------------------- */
/* Palette                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * The promo cards keep their own identity in both themes -- the green, amber
 * and blue cards are the brand's, not the surface's. In dark they are deepened
 * rather than re-hued, so the carousel still reads as the same three cards.
 */
export type PromoTone = {
  /** Gradient stops, top-left to bottom-right. */
  from: string;
  to: string;
  /** The decorative glow blooming behind the artwork. */
  glow: string;
  /** Body copy on this card. */
  ink: string;
  /** Headline and emphasised figures. */
  inkStrong: string;
  /** Muted footnotes and T&C. */
  inkMuted: string;
  /** Outline chips sitting on the card. */
  chipBorder: string;
  chipInk: string;
  /** Translucent white fill behind a chip, as in the reference art. */
  chipBg: string;
};

/**
 * The promo cards do NOT invert with the theme.
 *
 * They are brand artwork sitting on the surface, not part of it -- the same
 * reason a photograph is not re-tinted in dark mode.
 *
 * Colours match the supplied reference art: bright, saturated gradients with
 * large bold pure-white type. This is a deliberate brand choice over a
 * measured one. White on these grounds runs 1.8:1 to 3.2:1, below WCAG AA,
 * and no ink colour fixes that without darkening the cards away from the
 * reference. It is survivable here because every string on these cards is
 * large and bold, and none of it is the only place its information appears --
 * but do not copy this palette onto small or body text elsewhere in the app.
 */

export const PROMO_TONES = {
  green: {
    from: '#8FD64A',
    to: '#3EA83B',
    glow: '#B6F07A',
    ink: '#FFFFFF',
    inkStrong: '#FFFFFF',
    inkMuted: '#FFFFFF',
    chipBorder: 'rgba(255,255,255,0.45)',
    chipInk: '#FFFFFF',
    chipBg: 'rgba(255,255,255,0.22)',
  },
  amber: {
    from: '#FFB13D',
    to: '#EE7C17',
    glow: '#FFD08A',
    ink: '#FFFFFF',
    inkStrong: '#FFFFFF',
    inkMuted: '#FFFFFF',
    chipBorder: 'rgba(255,255,255,0.45)',
    chipInk: '#FFFFFF',
    chipBg: 'rgba(255,255,255,0.22)',
  },
  blue: {
    from: '#7CC0F7',
    to: '#3D93E6',
    glow: '#B6DEFB',
    ink: '#FFFFFF',
    inkStrong: '#FFFFFF',
    inkMuted: '#FFFFFF',
    chipBorder: 'rgba(255,255,255,0.45)',
    chipInk: '#FFFFFF',
    chipBg: 'rgba(255,255,255,0.22)',
  },
} as const satisfies Record<string, PromoTone>;

export type ThemePalette = {
  /** App background, behind everything. */
  background: string;
  /** Raised surfaces: the calculator, the nav bar. */
  surface: string;
  /** Recessed wells inside a surface: the result panel, segmented tracks. */
  surfaceSunken: string;
  /** Hairlines and card outlines. */
  border: string;
  /** A stronger outline, for the focused segment and the nav bar. */
  borderStrong: string;

  text: string;
  textMuted: string;
  textFaint: string;

  /** Brand green: the primary CTA fill. */
  accent: string;
  /** Text and icons sitting on `accent`. */
  onAccent: string;
  /** Green used for figures and links on the app surface, not on `accent`. */
  accentInk: string;
  /** Low-opacity green wash for selected states. */
  accentWash: string;

  /** Avatar / identity chip. */
  avatarBg: string;
  avatarInk: string;

  /** Carousel dots. */
  dotIdle: string;
  dotActive: string;

  /** Skeleton base and its sweeping highlight. */
  skeleton: string;
  skeletonSheen: string;

  /** Error state. */
  danger: string;

  /** Android elevation / iOS shadow colour. */
  shadow: string;

  promo: {
    green: PromoTone;
    amber: PromoTone;
    blue: PromoTone;
  };
};

const light: ThemePalette = {
  background: '#EAF4EA',
  surface: '#FFFFFF',
  surfaceSunken: '#F1F7F1',
  border: '#DCE8DC',
  borderStrong: '#BFDCC2',

  text: '#0E1A10',
  textMuted: '#4C5D4F',
  textFaint: '#8A9A8C',

  accent: '#2FB457',
  onAccent: '#062B12',
  accentInk: '#12833B',
  accentWash: '#DFF3E4',

  avatarBg: '#0C6B2A',
  avatarInk: '#DFF3E4',

  dotIdle: '#C4DBC6',
  dotActive: '#2FB457',

  skeleton: '#DCE8DC',
  skeletonSheen: '#EEF6EE',

  danger: '#B3261E',

  shadow: '#0E1A10',

  promo: PROMO_TONES,
};

const dark: ThemePalette = {
  background: '#070B07',
  surface: '#101710',
  surfaceSunken: '#0A0F0A',
  border: '#1E2A1F',
  borderStrong: '#2F4531',

  text: '#E7EDE7',
  textMuted: '#A3B2A5',
  textFaint: '#6C7C6E',

  accent: '#2FB457',
  onAccent: '#04220D',
  accentInk: '#7FD79B',
  accentWash: '#12351C',

  avatarBg: '#0C6B2A',
  avatarInk: '#DFF3E4',

  dotIdle: '#243026',
  dotActive: '#4FC873',

  skeleton: '#182118',
  skeletonSheen: '#243026',

  danger: '#F2B8B5',

  shadow: '#000000',

  // Same artwork as light -- see PROMO_TONES.
  promo: PROMO_TONES,
};

export const Palettes = { light, dark } as const;

export type ColorSchemeName = keyof typeof Palettes;

/* -------------------------------------------------------------------------- */
/* Elevation                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Shadows are expressed per-theme because a drop shadow is close to invisible
 * on a near-black surface -- dark elevation leans on the border token instead
 * of trying to cast a darker shadow onto an already-dark ground.
 */
export function elevation(scheme: ColorSchemeName, level: 1 | 2 | 3) {
  const shadow = Palettes[scheme].shadow;
  if (scheme === 'dark') {
    return { elevation: 0 } as const;
  }
  const spec = {
    1: { radius: 6, opacity: 0.06, height: 2, elevation: 2 },
    2: { radius: 14, opacity: 0.09, height: 6, elevation: 5 },
    3: { radius: 24, opacity: 0.13, height: 10, elevation: 9 },
  }[level];
  return {
    shadowColor: shadow,
    shadowOpacity: spec.opacity,
    shadowRadius: spec.radius,
    shadowOffset: { width: 0, height: spec.height },
    elevation: spec.elevation,
  };
}

/* -------------------------------------------------------------------------- */
/* Expo scaffold exports (still consumed by the starter components)            */
/* -------------------------------------------------------------------------- */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
