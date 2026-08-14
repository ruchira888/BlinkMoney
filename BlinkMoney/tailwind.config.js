const plugin = require('tailwindcss/plugin');
const {
  GEOMETRY,
  ENVELOPE_PALETTE,
  TIMING,
  GIFT_CARD_PALETTE,
} = require('./components/envelope/envelope.tokens.js');

/**
 * The envelope-opening sequence lives entirely in this file.
 *
 * Detected stack: NativeWind v4 -> Tailwind CSS v3, so this is the
 * config-driven path: @keyframes are declared here, not in a stylesheet, and
 * the utilities that reference them are registered alongside so the
 * choreography stays in one place. Nothing below should be duplicated into a
 * component as an arbitrary value.
 *
 * ---------------------------------------------------------------------------
 * ONE TIMELINE, THREE VIEWS
 * ---------------------------------------------------------------------------
 * The flap and the letter are not independent animations. The flap has to pass
 * behind the letter at a precise instant of the letter's rise, so both run on
 * the SAME duration (DURATION) with matching percentages and no delay -- the
 * letter simply holds still for the first 44% rather than being pushed later
 * with animation-delay. That keeps the crossing frame-exact instead of
 * depending on two timelines staying in step.
 *
 * ---------------------------------------------------------------------------
 * REACT NATIVE DIFFERENCES FROM THE WEB
 * ---------------------------------------------------------------------------
 * 1. perspective is not inherited, and is not even a real property here.
 *    React Native has no `transform-style: preserve-3d`, so a perspective set
 *    on the parent does NOT reach the child -- it must sit in the animated
 *    element's own transform list. (Verified: as a standalone declaration it
 *    is reported as IncompatibleNativeProperty and dropped.) Every keyframe
 *    below therefore carries perspective() inside its own transform, and
 *    `envelope-stage` also declares it so react-native-web matches on the web.
 *
 * 2. THERE IS NO transform-origin. It is likewise dropped on native as an
 *    IncompatibleNativeProperty, so the hinge cannot be expressed in CSS at
 *    all. The usual CSS fallback -- translate down, rotate, translate back --
 *    does not survive either: this parser stores a keyframe's transform as one
 *    track per function name, so two translateY() calls in a single transform
 *    collapse into one track with two conflicting values at the same progress.
 *
 *    The pivot is therefore GEOMETRIC, and `envelope-flap` only works inside
 *    the structure EnvelopeFlap builds: the rotating element is a wrapper
 *    twice the flap's height, with the flap artwork occupying only its bottom
 *    half. That places the wrapper's own centre exactly on the flap's fold, so
 *    an ordinary centre rotation IS a top-edge hinge. Rotating a plain
 *    flap-sized box instead will spin it about its middle and look wrong.
 *
 * 3. Transform lists must be identical in shape across every keyframe of an
 *    animation -- same functions, same order -- or the interpolation is
 *    dropped. That is why frames that "don't move" still restate their full
 *    transform.
 *
 *    Related: never write the single-argument `scale()`. The parser routes it
 *    through a shorthand handler that reads transform.value[0] and [1], which
 *    are undefined for the one-argument form, so BOTH axes come out undefined
 *    and the entire scale track is dropped without any warning -- the element
 *    animates every other property and simply never scales. Always write
 *    `scaleX(n) scaleY(n)`, which parse correctly.
 * 4. Tailwind's stock motion-safe:/motion-reduce: variants are broken under
 *    NativeWind: they compile to `prefers-reduced-motion: no-preference` and
 *    `: reduce`, and the native runtime only implements the BOOLEAN form of
 *    that feature (a value form always tests false, so the styles would never
 *    apply). Both variants are redefined at the bottom of this file to the
 *    boolean form, which the runtime does support.
 */

// Total length of the open. Kept under 900ms on purpose -- this is an
// interaction that some users will trigger repeatedly, not a cutscene.
// Comes from envelope.tokens.js, which the gift scene also reads to decide
// when the envelope has finished and the card may take over.
const DURATION = `${TIMING.open}ms`;
const HANDOFF = `${TIMING.handoff}ms`;
const SCENE_OUT = `${TIMING.sceneOut}ms`;
const NUDGE = `${TIMING.nudge}ms`;

// The instant the flap crosses from in front of the letter to behind it.
// Must stay just after LETTER_RELEASE so the letter is already moving.
const CROSSING = '46%';

// The point the letter is released and starts to rise.
const LETTER_RELEASE = '44%';

// How far the letter travels, and the depth applied to every rotating layer.
// Both come from envelope.tokens.js, which the components lay out from too, so
// the distance animated here is by construction the distance reserved there.
const LETTER_RISE = `-${GEOMETRY.letterRise}px`;
const DEPTH = `${GEOMETRY.depth}px`;

// The instant the flap passes edge-on to the viewer. rotateX reaches 90deg
// here, so the flap is a zero-width line and its two faces can be swapped
// without the change being visible. Derived from the flap's own curve rather
// than guessed: the swing covers 0->150deg over the first 42%, so 90deg falls
// at 42 * (90/150) = 25.2%.
const EDGE_ON = '25%';

/**
 * Responsible for: the flap's hinge swing, from sealed flat against the
 * envelope to lying fully back on itself, AND the single moment it crosses
 * behind the letter.
 *
 * The rotation runs past 90deg to 180deg so the flap lies back rather than
 * standing upright, revealing its lining underside on the way. transform-origin
 * is set by the `envelope-flap` utility rather than here, because it is a
 * static property of the element, not something that animates.
 *
 * The z-index step is choreography SHARED with envelope-letter. z-index cannot
 * meaningfully interpolate, so it steps at CROSSING -- held at its start value
 * right up to that frame, then held at its end value. Getting this wrong is
 * what makes an envelope look like it has a rendering bug: the letter appears
 * to slide up over a still-closed envelope.
 */
const flapKeyframes = {
  '0%': {
    transform: `perspective(${DEPTH}) rotateX(0deg)`,
    zIndex: '30',
  },
  '42%': {
    transform: `perspective(${DEPTH}) rotateX(150deg)`,
    zIndex: '30',
  },
  [CROSSING]: {
    transform: `perspective(${DEPTH}) rotateX(162deg)`,
    zIndex: '0',
  },
  '100%': {
    transform: `perspective(${DEPTH}) rotateX(180deg)`,
    zIndex: '0',
  },
};

/**
 * Responsible for: the letter's rise up out of the envelope pocket.
 *
 * This element animates transform ONLY. The readable content inside it fades
 * on a separate child (envelope-content) because stacking a second animation
 * that also drives transform on this element would silently cancel the rise.
 *
 * The hold from 0% to LETTER_RELEASE is what sequences the two parts: the flap
 * gets the first 44% to itself, then the letter moves while the flap finishes
 * settling. Percentages are matched to flapKeyframes deliberately.
 */
const letterKeyframes = {
  '0%': {
    transform: `perspective(${DEPTH}) translateY(0px)`,
  },
  [LETTER_RELEASE]: {
    transform: `perspective(${DEPTH}) translateY(0px)`,
  },
  '100%': {
    transform: `perspective(${DEPTH}) translateY(${LETTER_RISE})`,
  },
};

/**
 * Responsible for: the letter's content becoming readable, and nothing else.
 *
 * Split off from envelope-letter purely so that the rise (transform) and the
 * reveal (opacity) never share an element -- see the note on letterKeyframes.
 * It stays hidden until the letter has cleared the envelope mouth so text is
 * never seen through the pocket.
 */
const contentKeyframes = {
  '0%': { opacity: '0' },
  '55%': { opacity: '0' },
  '100%': { opacity: '1' },
};

/**
 * Responsible for: showing the flap's paper face while it is turned toward the
 * viewer, and nothing else.
 *
 * React Native has no backface-visibility (it is dropped on native alongside
 * transform-origin), so a rotated element keeps rendering the same pixels
 * instead of hiding its back. The flap therefore carries two stacked
 * artworks -- a face and a lining -- and swaps which one is visible at the
 * frame the flap is edge-on and infinitely thin. Stepped, not faded: a
 * cross-fade here would show both papers blended through each other.
 */
const flapFaceKeyframes = {
  '0%': { opacity: '1' },
  [EDGE_ON]: { opacity: '1' },
  '26%': { opacity: '0' },
  '100%': { opacity: '0' },
};

/**
 * Responsible for: revealing the flap's lining underside once the flap has
 * turned past edge-on. The exact inverse of flapFaceKeyframes, stepping at the
 * same frame so there is never a moment where both or neither is visible.
 */
const flapLiningKeyframes = {
  '0%': { opacity: '0' },
  [EDGE_ON]: { opacity: '0' },
  '26%': { opacity: '1' },
  '100%': { opacity: '1' },
};

/**
 * Responsible for: the wax seal breaking as the flap first lifts.
 *
 * Fades out inside the opening beat so the seal never appears to float
 * detached from the flap it was holding down.
 */
const sealKeyframes = {
  '0%': { opacity: '1' },
  '18%': { opacity: '1' },
  '34%': { opacity: '0' },
  '100%': { opacity: '0' },
};

/**
 * Responsible for: handing the screen over from the opened envelope to the
 * certificate card -- the envelope scene shrinking back and fading out.
 *
 * Runs on a wrapper *around* the envelope, never on the envelope's own layers.
 * Those are still holding their end-of-open transforms via fill-mode forwards,
 * and a second animation touching transform on the same element would cancel
 * them and snap the flap shut mid-fade.
 */
const sceneOutKeyframes = {
  '0%': {
    opacity: '1',
    transform: `perspective(${DEPTH}) scaleX(1) scaleY(1)`,
  },
  '100%': {
    opacity: '0',
    transform: `perspective(${DEPTH}) scaleX(0.82) scaleY(0.82)`,
  },
};

/**
 * Responsible for: the certificate card arriving in the envelope's place.
 *
 * Starts slightly small and low so it reads as coming forward out of the same
 * spot the letter occupied, rather than as a new screen being pushed.
 */
const cardInKeyframes = {
  '0%': {
    opacity: '0',
    transform: `perspective(${DEPTH}) scaleX(0.7) scaleY(0.7) translateY(20px)`,
  },
  // Overshoots past full size, then settles back. That overshoot is what makes
  // it read as popping out rather than fading up, and it is why this is worth
  // four frames instead of two.
  '42%': {
    opacity: '1',
    transform: `perspective(${DEPTH}) scaleX(1.06) scaleY(1.06) translateY(-8px)`,
  },
  '72%': {
    opacity: '1',
    transform: `perspective(${DEPTH}) scaleX(0.985) scaleY(0.985) translateY(2px)`,
  },
  '100%': {
    opacity: '1',
    transform: `perspective(${DEPTH}) scaleX(1) scaleY(1) translateY(0px)`,
  },
};

/**
 * Responsible for: the sealed envelope's invitation -- a small sway, left then
 * right then left, that says "this is tappable".
 *
 * Deliberately mostly rest. The sway occupies the first ~28% of the cycle and
 * the remainder holds still, so it repeats as an occasional nudge rather than
 * a permanent wobble. The angles are small on purpose; anything larger reads
 * as an error shake.
 *
 * Runs on a wrapper around the envelope, never on its own layers -- those have
 * their own transforms, and a second animation on the same element would
 * cancel them.
 */
const nudgeKeyframes = {
  '0%': { transform: `perspective(${DEPTH}) translateX(0px) rotate(0deg)` },
  '5%': { transform: `perspective(${DEPTH}) translateX(-4px) rotate(-2.4deg)` },
  '11%': { transform: `perspective(${DEPTH}) translateX(4px) rotate(2.4deg)` },
  '17%': { transform: `perspective(${DEPTH}) translateX(-3px) rotate(-1.7deg)` },
  '23%': { transform: `perspective(${DEPTH}) translateX(2px) rotate(1deg)` },
  '28%': { transform: `perspective(${DEPTH}) translateX(0px) rotate(0deg)` },
  '100%': { transform: `perspective(${DEPTH}) translateX(0px) rotate(0deg)` },
};

/**
 * Responsible for: the "Open this" cue drifting toward its arrow, so the
 * prompt reads as pointing at something rather than sitting inert.
 */
const cuePulseKeyframes = {
  '0%': { transform: `perspective(${DEPTH}) translateX(0px)` },
  '5%': { transform: `perspective(${DEPTH}) translateX(3px)` },
  '11%': { transform: `perspective(${DEPTH}) translateX(-2px)` },
  '20%': { transform: `perspective(${DEPTH}) translateX(0px)` },
  '100%': { transform: `perspective(${DEPTH}) translateX(0px)` },
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Mirrors of the palettes in envelope.tokens.js, so a colour can be
      // reached either as a Tailwind class or as an SVG fill prop without
      // being written down twice. `envelope-*` is the light set and
      // `envelope-dark-*` the dark one; the dark: variant selects between them.
      colors: {
        envelope: ENVELOPE_PALETTE.light,
        'envelope-dark': ENVELOPE_PALETTE.dark,
        gift: GIFT_CARD_PALETTE.light,
        'gift-dark': GIFT_CARD_PALETTE.dark,
      },
    },
  },
  plugins: [
    plugin(({ addBase, addUtilities, addVariant }) => {
      // The @keyframes are emitted through addBase rather than
      // theme.extend.keyframes on purpose. Tailwind only prints a themed
      // keyframe when a matching `animate-*` class is found in the scanned
      // content, and the utilities below reference the animations by name
      // instead -- so via the theme the blocks silently never reach the
      // stylesheet and every animation resolves to nothing. Emitting them here
      // makes them unconditional, which is what "one definition" requires.
      addBase({
        '@keyframes envelope-flap': flapKeyframes,
        '@keyframes envelope-letter': letterKeyframes,
        '@keyframes envelope-content': contentKeyframes,
        '@keyframes envelope-flap-face': flapFaceKeyframes,
        '@keyframes envelope-flap-lining': flapLiningKeyframes,
        '@keyframes envelope-seal': sealKeyframes,
        '@keyframes gift-scene-out': sceneOutKeyframes,
        '@keyframes gift-card-in': cardInKeyframes,
        '@keyframes envelope-nudge': nudgeKeyframes,
        '@keyframes gift-cue-pulse': cuePulseKeyframes,
      });

      // See note 3 at the top of this file.
      //
      // These deliberately do NOT reuse the names motion-safe / motion-reduce.
      // Tailwind registers those as core variants and a plugin cannot shadow
      // them -- attempting it leaves the stock `prefers-reduced-motion:
      // no-preference` / `: reduce` in the output, which the native runtime
      // evaluates as false forever. Distinct names mean there is no class that
      // looks like it guards motion but silently does nothing.
      //
      // motion-ok      == the user has NOT asked for reduced motion
      // motion-reduced == the user HAS asked for reduced motion
      //
      // Both compile to the boolean form, which is valid CSS on web and is the
      // one form react-native-css-interop implements on native.
      addVariant('motion-ok', '@media not (prefers-reduced-motion)');
      addVariant('motion-reduced', '@media (prefers-reduced-motion)');

      addUtilities({
        /**
         * The perspective container. Owns the depth for the layers inside it
         * and nothing else -- it never rotates itself.
         *
         * On the web this is what makes the child's rotateX read as a hinge.
         * On native the perspective in the child's own transform does that job
         * (see note 1 at the top of this file); this is kept so both platforms
         * describe the same scene.
         */
        '.envelope-stage': {
          perspective: DEPTH,
          position: 'relative',
        },

        /**
         * The hinge swing plus the paint-order crossing, per flapKeyframes.
         *
         * Deliberately carries no transform-origin: it is dropped on native
         * (see note 2 at the top of this file), so declaring it here would
         * pivot correctly on web and silently wrongly on native -- the exact
         * kind of split behaviour this file exists to prevent. The top-edge
         * pivot comes from the double-height wrapper EnvelopeFlap renders, on
         * both platforms alike.
         */
        '.envelope-flap': {
          animation: `envelope-flap ${DURATION} cubic-bezier(0.4, 0, 0.2, 1) forwards`,
        },

        /**
         * The rise. Held for the first 44% of the shared timeline so the flap
         * leads, then travels up out of the pocket.
         */
        '.envelope-letter': {
          animation: `envelope-letter ${DURATION} cubic-bezier(0.22, 1, 0.36, 1) forwards`,
        },

        /** The readable content's fade. Opacity only, by design. */
        '.envelope-content': {
          animation: `envelope-content ${DURATION} linear forwards`,
        },

        /**
         * The flap's two faces. Applied to the stacked artworks inside
         * envelope-flap, and timed to swap while the flap is edge-on.
         */
        '.envelope-flap-face': {
          animation: `envelope-flap-face ${DURATION} linear forwards`,
        },
        '.envelope-flap-lining': {
          animation: `envelope-flap-lining ${DURATION} linear forwards`,
        },

        /** The wax seal breaking. */
        '.envelope-seal': {
          animation: `envelope-seal ${DURATION} linear forwards`,
        },

        /**
         * The hand-off, on the wrapper around the whole envelope. Eased in so
         * the envelope accelerates away rather than dissolving evenly, which
         * keeps attention on the card arriving.
         */
        '.gift-scene-out': {
          animation: `gift-scene-out ${SCENE_OUT} cubic-bezier(0.4, 0, 1, 1) forwards`,
        },

        /**
         * The certificate card popping out. The easing is near-linear on the
         * way up because the overshoot in the keyframes already supplies the
         * spring -- adding an ease-out curve on top flattens the pop.
         */
        '.gift-card-in': {
          animation: `gift-card-in ${HANDOFF} cubic-bezier(0.34, 0.8, 0.36, 1) forwards`,
        },

        /**
         * The sealed envelope's invitation. Loops indefinitely, because it has
         * to still be inviting the tap a few seconds after the screen opens.
         */
        '.envelope-nudge': {
          animation: `envelope-nudge ${NUDGE} ease-in-out infinite`,
        },

        /** The "Open this" cue, nudging in time with the envelope. */
        '.gift-cue-pulse': {
          animation: `gift-cue-pulse ${NUDGE} ease-in-out infinite`,
        },
      });


      // Static resting states, used for the reduced-motion path and for the
      // closed state. These are the same end values the keyframes reach, so
      // "instant" and "animated" cannot drift apart.
      addUtilities({
        '.envelope-flap-open': {
          transform: `perspective(${DEPTH}) rotateX(180deg)`,
          zIndex: '0',
        },
        '.envelope-flap-closed': {
          transform: `perspective(${DEPTH}) rotateX(0deg)`,
          zIndex: '30',
        },
        '.envelope-letter-open': {
          transform: `perspective(${DEPTH}) translateY(${LETTER_RISE})`,
        },
        '.envelope-letter-closed': {
          transform: `perspective(${DEPTH}) translateY(0px)`,
        },
        '.envelope-flap-face-open': { opacity: '0' },
        '.envelope-flap-face-closed': { opacity: '1' },
        '.envelope-flap-lining-open': { opacity: '1' },
        '.envelope-flap-lining-closed': { opacity: '0' },
        '.envelope-seal-open': { opacity: '0' },
        '.envelope-seal-closed': { opacity: '1' },
        '.gift-scene-gone': { opacity: '0' },
        '.gift-card-shown': {
          opacity: '1',
          transform: `perspective(${DEPTH}) scaleX(1) scaleY(1) translateY(0px)`,
        },
      });

    }),
  ],
};
