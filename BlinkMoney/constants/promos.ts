/**
 * Promo carousel content.
 *
 * Copy lives here rather than inside the card component so the carousel is
 * driven by data: the number of slides, the dots and the auto-advance cycle all
 * derive from this array's length, and adding a fourth card is a one-object
 * change with no layout edit.
 *
 * `tone` names a key in ThemePalette.promo rather than carrying colours, so a
 * card cannot introduce a hex that the theme does not know about.
 */

export type PromoToneName = 'green' | 'amber' | 'blue';

export type PromoChip = {
  id: string;
  label: string;
};

/**
 * The large figure some cards show beside the body copy (`~15%`, `9.99%`).
 * Optional -- the amber card leads with a headline number instead.
 */
export type PromoStat = {
  value: string;
  label: string;
};

export type Promo = {
  id: string;
  tone: PromoToneName;
  /** Small line above the headline. Optional. */
  eyebrow?: string;
  /** Headline, rendered upright. */
  title: string;
  /** Second headline line, rendered italic serif for the brand's editorial feel. */
  titleAccent?: string;
  body: string;
  stat?: PromoStat;
  chips: PromoChip[];
  /** Footnote pinned bottom-right. */
  footnote?: string;
  /** Label for the primary action the card drives. */
  cta: string;
};

export const PROMOS: Promo[] = [
  {
    id: 'all-in-one-sip',
    tone: 'green',
    eyebrow: 'Stocks + FD + Gold',
    title: 'All in one click',
    titleAccent: 'SIP',
    body: 'No fund picking. No research. BlinkMoney allocates across multiple asset classes automatically.',
    stat: { value: '~15%', label: 'p.a. returns*' },
    // Two, not three. A third wrapped to a second row and left the block
    // cramped against the card's bottom edge; the dropped claim is the
    // weakest of the three and is made again by the SIP calculator below.
    chips: [
      { id: 'amfi', label: 'AMFI registered' },
      { id: 'start', label: 'Start at ₹21/day' },
    ],
    footnote: '*T&C apply',
    cta: 'Start SIP',
  },
  {
    id: 'ten-crore',
    tone: 'amber',
    title: '10 Cr+',
    titleAccent: 'SIP accounts',
    body: 'Crores of Indians are already investing daily. Every day you wait is a day of compounding missed.',
    chips: [{ id: 'growth', label: 'SIP accounts grew ~35% last year' }],
    footnote: 'The wave has started. Yours hasn’t.',
    cta: 'Join them',
  },
  {
    id: 'instant-credit',
    tone: 'blue',
    eyebrow: 'Start your SIP',
    title: 'Reach ₹25,000',
    titleAccent: 'Unlock instant credit',
    body: 'Invest and stay liquid. Borrow against your portfolio without breaking your SIP — ever.',
    stat: { value: '9.99%', label: 'interest p.a.' },
    chips: [
      { id: 'no-check', label: 'Zero credit check' },
      { id: 'instant', label: 'Instant approval' },
    ],
    footnote: '*T&C apply',
    cta: 'Check eligibility',
  },
];
