/**
 * SIP projection maths.
 *
 * Pure functions, no React. The old home screen shipped a hardcoded lookup
 * table of six precomputed figures, which meant the slider could not actually
 * change the answer and the numbers silently drifted from the ~15% the promo
 * card advertises. Computing it means the card and the calculator cannot
 * disagree.
 */

/** The blended return the promo card advertises, as a decimal. */
export const ASSUMED_ANNUAL_RETURN = 0.15;

export type Frequency = 'Daily' | 'Monthly';

export const FREQUENCIES: Frequency[] = ['Daily', 'Monthly'];

/** Contribution periods per year, per frequency. */
const PERIODS_PER_YEAR: Record<Frequency, number> = {
  Daily: 365,
  Monthly: 12,
};

export type Horizon = {
  label: string;
  years: number;
};

export const HORIZONS: Horizon[] = [
  { label: '1 Year', years: 1 },
  { label: '5 Years', years: 5 },
  { label: '10 Years', years: 10 },
];

/**
 * Future value of an annuity-due: each contribution is made at the start of
 * its period, which is how a SIP actually debits, so every instalment earns
 * one extra period of growth versus an ordinary annuity.
 *
 *   FV = P · [((1 + r)^n − 1) / r] · (1 + r)
 *
 * The r = 0 branch guards the division; with no growth the future value is
 * simply everything paid in.
 */
export function projectSip(
  amountPerPeriod: number,
  frequency: Frequency,
  years: number,
  annualReturn: number = ASSUMED_ANNUAL_RETURN
): { invested: number; futureValue: number; gain: number } {
  const periodsPerYear = PERIODS_PER_YEAR[frequency];
  const n = Math.round(periodsPerYear * years);
  const r = annualReturn / periodsPerYear;

  const invested = amountPerPeriod * n;
  const futureValue =
    r === 0 ? invested : amountPerPeriod * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);

  return {
    invested: Math.round(invested),
    futureValue: Math.round(futureValue),
    gain: Math.round(futureValue - invested),
  };
}

/**
 * Indian digit grouping (₹1,23,456 rather than ₹123,456).
 *
 * Uses the en-IN locale where the runtime provides it, and falls back to a
 * manual lakh/crore grouping otherwise -- Android's Hermes build ships a
 * trimmed ICU on some devices, and a silently wrong currency format on a
 * money screen is worse than a slightly plainer one.
 */
export function formatRupees(value: number): string {
  const rounded = Math.round(value);
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(rounded);
  } catch {
    return `₹${groupIndian(rounded)}`;
  }
}

function groupIndian(value: number): string {
  const digits = Math.abs(value).toString();
  if (digits.length <= 3) {
    return (value < 0 ? '-' : '') + digits;
  }
  // Last three digits, then pairs.
  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return (value < 0 ? '-' : '') + `${grouped},${last3}`;
}
