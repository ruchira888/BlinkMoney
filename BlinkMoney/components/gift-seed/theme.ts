/**
 * Design tokens for the Gift a Seed experience.
 *
 * Black surfaces, white type, deep green as an accent only. Nothing here is
 * neon or gradient; the one deliberate colour contrast in the whole feature is
 * the white paper envelope against the near-black app.
 */

export const C = {
  bg: '#050705',
  surface: '#0B100C',
  card: '#111711',
  cardAlt: '#141A14',
  cardElevated: '#181F18',

  // Restrained deep green. Used for CTAs, active states and small details --
  // never for body copy or whole headings.
  green: '#176B20',
  greenBright: '#1F7A28',
  greenDim: '#123F17',
  greenLine: '#254024',

  text: '#F2F2EA',
  textMuted: '#A7AAA5',
  textFaint: '#70746F',

  hairline: '#1D271D',
} as const;

/** The paper stock: warm white envelope and card, read against the black app. */
export const PAPER = {
  envelope: '#FAF8F3',
  envelopeShade: '#EDE8DE',
  envelopeEdge: '#DAD3C5',
  crease: '#C9C1B1',
  // Flap underside. Deep green rather than more cream, so the fold reads as a
  // real turn of paper the moment it opens.
  lining: '#14352A',
  liningShade: '#0F291F',
  wax: '#16532B',
  waxShade: '#0F3A1E',

  card: '#FBF9F4',
  cardEdge: '#E2DCCE',
  ink: '#12140F',
  inkMuted: '#5C6057',
  inkFaint: '#8A8D84',
  accent: '#16532B',
} as const;

export const RADIUS = { sm: 10, md: 14, lg: 18, xl: 24, pill: 999 } as const;

export const SPACE = { xs: 6, sm: 10, md: 14, lg: 18, xl: 24, xxl: 32 } as const;

/**
 * Type scale. Serif is reserved for display moments (amounts, screen titles);
 * everything functional is the system sans.
 */
export const TYPE = {
  display: { fontFamily: 'serif', fontWeight: '700' as const },
  title: { fontFamily: 'serif', fontWeight: '700' as const },
  body: { fontWeight: '500' as const },
} as const;
