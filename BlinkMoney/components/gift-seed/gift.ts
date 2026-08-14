/**
 * The one gift the prototype flows around.
 *
 * Kept in a single place so every screen shows the same amount, sender and
 * message rather than each hard-coding its own copy of them.
 */
export const GIFT = {
  amount: 101,
  amountLabel: '₹101',
  sender: 'Riya',
  senderFull: 'Riya Sharma',
  recipient: 'Aarav',
  occasion: 'Birthday',
  message: 'Wishing you a prosperous journey ahead.',
  vehicle: 'Daily SIP',
  link: 'blink.money/seed/7hk3',
  date: 'Today',
} as const;

/** Growth figures for the tracking screen. */
export const GROWTH = {
  currentLabel: '₹104.32',
  gain: '+₹3.32',
  percent: '+3.3%',
  // Twelve normalised points, oldest first. Gently upward with real wobble --
  // a perfectly smooth curve reads as decoration rather than data.
  series: [0.08, 0.14, 0.11, 0.24, 0.31, 0.27, 0.42, 0.5, 0.46, 0.63, 0.79, 0.92],
} as const;

export const OCCASIONS = ['Birthday', 'Diwali', 'Shagun', 'Just Because'] as const;
export const PRESETS = [501, 1001, 2100] as const;

export const formatAmount = (n: number) => `₹${n.toLocaleString('en-IN')}`;
