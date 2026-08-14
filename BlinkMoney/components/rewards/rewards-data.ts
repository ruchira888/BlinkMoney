/**
 * Rewards content.
 *
 * Data, not components, so the tabs are driven by an array rather than by
 * three near-identical blocks of JSX.
 */

export type RewardTab = 'Earn' | 'Redeem' | 'History';

export const REWARD_TABS: RewardTab[] = ['Earn', 'Redeem', 'History'];

export type EarnAction = {
  id: string;
  icon: string;
  title: string;
  body: string;
  points: number;
  /** Already completed today / this cycle. */
  done?: boolean;
};

export const EARN_ACTIONS: EarnAction[] = [
  {
    id: 'checkin',
    icon: 'calendar-outline',
    title: 'Daily Check-in',
    body: 'Open the app, collect points.',
    points: 10,
    done: true,
  },
  {
    id: 'sip',
    icon: 'trending-up-outline',
    title: 'Complete a SIP',
    body: 'Every instalment earns.',
    points: 50,
  },
  {
    id: 'refer',
    icon: 'people-outline',
    title: 'Refer a Friend',
    body: 'They invest, you both earn.',
    points: 250,
  },
];

export type RedeemOption = {
  id: string;
  icon: string;
  title: string;
  body: string;
  cost: number;
};

export const REDEEM_OPTIONS: RedeemOption[] = [
  {
    id: 'cashback',
    icon: 'cash-outline',
    title: '₹50 into your SIP',
    body: 'Straight into your portfolio.',
    cost: 500,
  },
  {
    id: 'gold',
    icon: 'medal-outline',
    title: '0.1g Digital Gold',
    body: 'Added to your holdings.',
    cost: 1200,
  },
  {
    id: 'fee',
    icon: 'pricetag-outline',
    title: 'Fee Waiver',
    body: 'One month, no platform fee.',
    cost: 2000,
  },
];

export type HistoryEntry = {
  id: string;
  title: string;
  when: string;
  delta: number;
};

export const HISTORY: HistoryEntry[] = [
  { id: 'h1', title: 'Daily Check-in', when: 'Today', delta: 10 },
  { id: 'h2', title: 'Gift a Seed sent', when: 'Yesterday', delta: 100 },
  { id: 'h3', title: 'SIP completed', when: '2 days ago', delta: 50 },
  { id: 'h4', title: 'Redeemed ₹50 into SIP', when: 'Last week', delta: -500 },
];

/** Headline balance and the gift counters under it. */
export const REWARDS_SUMMARY = {
  points: 2480,
  giftsSent: 3,
  giftsOpened: 1,
  giftsGrowing: 2,
} as const;
