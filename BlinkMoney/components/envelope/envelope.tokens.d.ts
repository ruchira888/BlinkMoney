/**
 * Types for envelope.tokens.js. The tokens themselves stay plain CommonJS
 * because tailwind.config.js has to require() them from Node.
 */

export type EnvelopePaletteTokens = {
  paper: string;
  paperShade: string;
  paperEdge: string;
  crease: string;
  lining: string;
  liningShade: string;
  wax: string;
  waxShade: string;
  letter: string;
  letterEdge: string;
  ink: string;
  inkSoft: string;
};

export declare const GEOMETRY: {
  width: number;
  height: number;
  flapHeight: number;
  letterRise: number;
  letterInset: number;
  letterWidth: number;
  letterHeight: number;
  focusRingInset: number;
  depth: number;
  stageHeight: number;
  flapWrapperHeight: number;
  flapWrapperTop: number;
};

export declare const ENVELOPE_PALETTE: {
  light: EnvelopePaletteTokens;
  dark: EnvelopePaletteTokens;
};

export declare const TIMING: {
  open: number;
  hold: number;
  handoff: number;
  sceneOut: number;
  nudge: number;
  confetti: number;
};

export declare const CONFETTI_COLORS: string[];

export type GiftCardPaletteTokens = {
  card: string;
  cardEdge: string;
  hairline: string;
  ink: string;
  accent: string;
  muted: string;
  buttonBg: string;
  buttonText: string;
  backdrop: string;
};

export declare const GIFT_CARD_PALETTE: {
  light: GiftCardPaletteTokens;
  dark: GiftCardPaletteTokens;
};
