/**
 * Gifts this user has been sent.
 *
 * Static prototype data. There is no endpoint yet and rule 7 rules out
 * pointing one at localhost, so these are plain constants rather than a
 * simulated fetch -- an unopened gift is either here or it is not, and
 * inventing a loading state for a local array would be noise.
 */

import { GIFT_CARDS, type GiftCardDesign } from '@/constants/gift-cards';

export type ReceivedGift = {
  id: string;
  sender: string;
  /** Matches a GIFT_CARDS id. */
  cardId: string;
  amount: number;
  message: string;
  when: string;
  opened: boolean;
};

export const RECEIVED_GIFTS: ReceivedGift[] = [
  {
    id: 'r1',
    sender: 'Ruchira',
    cardId: 'new-beginning',
    amount: 101,
    message: 'For your first step towards building your future.',
    when: 'Just now',
    opened: false,
  },
  {
    id: 'r2',
    sender: 'Meera',
    cardId: 'diwali',
    amount: 501,
    message: 'A shagun to start something of your own.',
    when: 'Last Diwali',
    opened: true,
  },
];

export function findReceivedGift(id: string | undefined): ReceivedGift | undefined {
  return RECEIVED_GIFTS.find((gift) => gift.id === id);
}

export function cardForGift(gift: ReceivedGift): GiftCardDesign {
  return GIFT_CARDS.find((card) => card.id === gift.cardId) ?? GIFT_CARDS[0];
}

/** Drives the badge on the Rewards entry point. */
export const UNOPENED_COUNT = RECEIVED_GIFTS.filter((gift) => !gift.opened).length;

/**
 * Growth on a claimed gift, as a fraction. Small and positive: the point of
 * the screen is that it started working immediately, not that it made money.
 */
export const GROWTH_RATE = 0.0041;
