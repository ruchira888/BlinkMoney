/**
 * Single source of truth for the envelope's geometry and colours.
 *
 * Plain CommonJS on purpose: tailwind.config.js runs in Node and has to
 * require() this, while the components import it through Metro. Keeping one
 * file means the distance the letter travels in the keyframes and the distance
 * the layout actually leaves for it can never drift apart.
 */

// Intrinsic size of the envelope, in px. Sized so the whole stage still fits
// inside a card on a 320px-wide screen (320 - 24 page padding - 16 card
// padding, both sides = 240 usable).
const GEOMETRY = {
  width: 224,
  height: 152,

  // Depth of the triangular flap, measured from the top edge down to its point.
  flapHeight: 90,

  // How far the letter travels upward. The stage reserves exactly this much
  // headroom above the envelope, and the keyframes move it exactly this far.
  //
  // The letter's resting position is fixed by height/letterInset/letterHeight,
  // so the height that actually clears the pocket mouth once risen works out
  // to (letterRise - 4). 134 leaves 130px, which fits a label, an amount and a
  // two-line caption without the caption being cut off at the mouth.
  letterRise: 134,

  // Gap between the bottom of the letter and the bottom of the envelope when
  // the letter is at rest inside it.
  letterInset: 8,

  letterWidth: 198,
  letterHeight: 140,

  // Breathing room around the stage inside the pressable, so a focus ring can
  // be drawn without changing the envelope's own size.
  focusRingInset: 4,

  // Perspective depth. ~1000px reads as a real hinge on an element this wide;
  // much larger flattens the rotation, much smaller distorts it.
  depth: 1000,
};

// Total height the stage must reserve: the envelope itself plus the headroom
// the letter rises into. The open flap lies back flapHeight above the top
// edge, which is less than letterRise, so it is covered by the same headroom.
GEOMETRY.stageHeight = GEOMETRY.height + GEOMETRY.letterRise;

// The rotating flap wrapper is twice the flap's height, so that its own centre
// lands exactly on the fold -- that is what turns an ordinary centre rotation
// into a top-edge hinge, because transform-origin does not exist on native.
// See the long note at the top of tailwind.config.js.
GEOMETRY.flapWrapperHeight = GEOMETRY.flapHeight * 2;
GEOMETRY.flapWrapperTop = GEOMETRY.letterRise - GEOMETRY.flapHeight;

/**
 * Two full palettes rather than one tinted set, so the envelope is legible on
 * this app's near-black green surface and on a light one.
 *
 * `lining` is intentionally nothing like `paper`. It is the inside of the flap,
 * revealed only as the flap turns over, and it is the single detail that makes
 * the motion read as a physical object rather than a rotating rectangle.
 */
const ENVELOPE_PALETTE = {
  light: {
    paper: '#FFFFFF',
    paperShade: '#F2EFE8',
    paperEdge: '#DDD7C9',
    crease: '#CBC4B4',
    lining: '#14352A',
    liningShade: '#0F291F',
    wax: '#16532B',
    waxShade: '#0F3A1E',
    letter: '#FFFFFF',
    letterEdge: '#E2DCCE',
    ink: '#12140F',
    inkSoft: '#5C6057',
  },
  dark: {
    // Warm white rather than pure white: against a near-black app, pure white
    // reads as a lit rectangle instead of as paper.
    paper: '#FAF8F3',
    paperShade: '#EDE8DE',
    paperEdge: '#DAD3C5',
    crease: '#C9C1B1',
    // The flap underside is deep green, not more cream. It is the only colour
    // the envelope reveals as it turns, so it has to differ from the face.
    lining: '#14352A',
    liningShade: '#0F291F',
    wax: '#16532B',
    waxShade: '#0F3A1E',
    letter: '#FBF9F4',
    letterEdge: '#E2DCCE',
    ink: '#12140F',
    inkSoft: '#5C6057',
  },
};

/**
 * Stage timings for the full-screen gift scene, in ms.
 *
 * tailwind.config.js builds its animation durations from these, and the scene
 * uses them to decide when to advance its stage -- so the moment the card is
 * told to appear is by construction the moment the envelope has finished
 * getting out of its way.
 */
const TIMING = {
  // The envelope open itself. Under 900ms on purpose.
  open: 820,

  // Beat between the envelope finishing and the card popping out. Just long
  // enough for the flap to settle -- the card is the payoff, so it arrives
  // straight after the open rather than making anyone read a small letter
  // first.
  hold: 240,

  // The card's pop. Short and slightly springy.
  handoff: 460,

  // The envelope clearing out from under the card. Faster than the pop so it
  // is gone by the time the card is at full size, rather than dissolving
  // behind it.
  sceneOut: 300,

  // One full nudge cycle of the sealed envelope: a small sway, then a rest
  // before it repeats. The rest is most of the cycle -- a continuously
  // wobbling envelope reads as broken rather than inviting.
  nudge: 2600,

  // The confetti burst. Outlives the handoff on purpose, so pieces are still
  // falling behind the card as it settles rather than stopping dead.
  confetti: 1900,
};

/**
 * Confetti colours, taken from the reference. Deliberately unrelated to the
 * app's green palette -- confetti reads as celebration precisely because it
 * does not match the brand.
 */
const CONFETTI_COLORS = [
  '#FF4D9D',
  '#2B5BE8',
  '#3FCB6B',
  '#FFD400',
  '#FF3B30',
  '#7B4DFF',
  '#00C2C7',
  '#FF8A00',
];

/**
 * The certificate card the letter becomes. Cream stock, deep green ink, the
 * palette of a printed gift certificate rather than of the app chrome.
 */
const GIFT_CARD_PALETTE = {
  light: {
    card: '#F0EAE0',
    cardEdge: '#DCD3C4',
    hairline: '#C9BEAB',
    ink: '#123124',
    accent: '#16382A',
    muted: '#6E6A61',
    buttonBg: '#15382B',
    buttonText: '#F3EFE6',
    // Deliberately a good deal deeper than `card`. An off-white backdrop left
    // the cream certificate almost invisible against it.
    backdrop: '#DCD5C8',
  },
  dark: {
    card: '#EFE9DE',
    cardEdge: '#D5CBBA',
    hairline: '#C2B7A3',
    ink: '#102D21',
    accent: '#14352A',
    muted: '#6B675E',
    buttonBg: '#14352A',
    buttonText: '#F3EFE6',
    backdrop: '#050705',
  },
};

module.exports = {
  GEOMETRY,
  ENVELOPE_PALETTE,
  TIMING,
  CONFETTI_COLORS,
  GIFT_CARD_PALETTE,
};
