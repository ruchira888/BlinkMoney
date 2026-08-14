/**
 * Gift card designs for the Gift a Seed send flow.
 *
 * The cards are artwork assets rather than something drawn in code, so a
 * design change is a file swap, not a component edit. Title and tagline are
 * baked into the image; they stay here only for the accessibility label and
 * the picker's caption.
 */

/** Height / width of the card assets. All three are within a hair of this. */
export const GIFT_CARD_ASPECT = 1.62;

export type GiftCardDesign = {
  id: string;
  /** Baked into the image; kept for screen readers. */
  title: string;
  /** Baked into the image; kept for screen readers. */
  tagline: string;
  /** Caption under the card in the picker. */
  occasion: string;
  /** require()d png. */
  image: number;
};

export const GIFT_CARDS: GiftCardDesign[] = [
  {
    id: 'new-beginning',
    title: 'A New Beginning',
    tagline: 'For new dreams and big tomorrows.',
    occasion: 'Just Because',
    image: require('@/assets/images/card-new-beginning.png'),
  },
  {
    id: 'diwali',
    title: 'Diwali',
    tagline: 'A shagun for a brighter future.',
    occasion: 'Diwali',
    image: require('@/assets/images/card-diwali.png'),
  },
  {
    id: 'birthday',
    title: 'Birthday',
    tagline: 'Celebrate a new chapter.',
    occasion: 'Birthday',
    image: require('@/assets/images/card-birthday.png'),
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
