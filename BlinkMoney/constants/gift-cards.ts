/**
 * Gift card designs for the Gift a Seed send flow.
 *
 * Light pastel stock with dark ink, matching the reference artwork. Like the
 * promo cards these do not invert with the theme -- a gift card is artwork the
 * recipient receives, not app chrome, so it reads the same on either surface.
 *
 * Because the ink is dark here, the worst case is the *darkest* end of each
 * gradient rather than the lightest. Every ink below is verified against that
 * end: titles clear 6.7:1 and taglines clear 4.6:1 at minimum.
 */

export type GiftCardTone = {
  /** Gradient stops, top-left to bottom-right. */
  from: string;
  to: string;
  /** Soft blooms behind the artwork. */
  bloom: string;
  /** Title ink. */
  ink: string;
  /** Tagline and body ink. */
  inkMuted: string;
  /** The hairline under the title. Ornamental. */
  rule: string;
  /** Motif tint. */
  motif: string;
};

export type GiftCardDesign = {
  id: string;
  /** Shown on the card. */
  title: string;
  /** The line under the rule. */
  tagline: string;
  /** Shown under the card in the picker. */
  occasion: string;
  icon: string;
  /** Ionicons has no cake glyph, so Birthday comes from MaterialCommunityIcons. */
  iconFamily: 'ionicons' | 'material';
  tone: GiftCardTone;
  /** Confetti fleck colours, drawn as small rotated rects. */
  confetti: string[];
};

export const GIFT_CARDS: GiftCardDesign[] = [
  {
    id: 'new-beginning',
    title: 'A New Beginning',
    tagline: 'For new dreams and big tomorrows.',
    occasion: 'Just Because',
    icon: 'leaf',
    iconFamily: 'ionicons',
    tone: {
      from: '#E9F7C9',
      to: '#A9E6C6',
      bloom: '#C8EFA8',
      ink: '#14431C',
      inkMuted: '#2A5D34',
      rule: '#4E8C63',
      motif: '#2E8B45',
    },
    confetti: ['#F5D93B', '#4CAF50', '#29B6D6', '#8BC34A'],
  },
  {
    id: 'diwali',
    title: 'Diwali',
    tagline: 'A shagun for a brighter future.',
    occasion: 'Diwali',
    icon: 'flame',
    iconFamily: 'ionicons',
    tone: {
      from: '#F6A72A',
      to: '#FDECB4',
      bloom: '#FFC85E',
      ink: '#4A2408',
      inkMuted: '#6B3A12',
      rule: '#A2701C',
      motif: '#8A4A12',
    },
    confetti: ['#F5D93B', '#FF5722', '#E91E63', '#FFC107'],
  },
  {
    id: 'birthday',
    title: 'Birthday',
    tagline: 'Celebrate a new chapter.',
    occasion: 'Birthday',
    icon: 'cake-variant',
    iconFamily: 'material',
    tone: {
      from: '#A9D9F6',
      to: '#DCEEFC',
      bloom: '#8FCBF2',
      ink: '#12275A',
      inkMuted: '#26406F',
      rule: '#4A80B8',
      motif: '#1B5E9E',
    },
    confetti: ['#E91E63', '#29B6D6', '#FFC107', '#7B4DFF'],
  },
];

/** The card selected when the flow opens. */
export const DEFAULT_CARD_ID = 'new-beginning';

export const AMOUNT_PRESETS = [51, 101, 201] as const;

export const MIN_GIFT = 21;
export const MAX_GIFT = 25000;

/** Tap-to-fill message starters, so an empty box is never the only option. */
export const MESSAGE_SUGGESTIONS = [
  'For your first step towards building your future.',
  'For your next chapter.',
  'A little something to grow with.',
  'Here’s to growing together.',
];

/** Prototype recipient, matching the rest of the Gift a Seed screens. */
export const GIFT_RECIPIENT = 'Aarushi';

export const GIFT_SENDER = 'Ruchira';
