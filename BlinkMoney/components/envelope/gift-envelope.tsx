/**
 * The envelope. Every sealed-message surface in the app renders this component
 * -- there is no second implementation anywhere.
 *
 * All motion comes from the utilities defined in tailwind.config.js. The only
 * thing this file does at runtime is swap which class name is on each layer;
 * there is no Animated value, no timing code, and no arbitrary delay written
 * inline. If the choreography needs changing, it changes in the config.
 *
 * LAYERING
 * --------
 * Paint order is set by explicit zIndex on sibling layers, listed here back to
 * front. The flap is the only one whose zIndex moves, and it moves from inside
 * its keyframes:
 *
 *   10  back panel      the rear wall
 *   20  letter          rises out
 *   25  front pocket    occludes the letter from the mouth down
 *   30 -> 0  flap       starts above the letter, crosses behind it mid-swing
 *   40  wax seal        breaks early, so it never floats free of the flap
 */
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

import {
  EnvelopeBackPanel,
  EnvelopeFlapFace,
  EnvelopeFlapLining,
  EnvelopeFrontPocket,
  EnvelopeLetterCard,
  EnvelopeWaxSeal,
} from './envelope-parts';
import { ENVELOPE_PALETTE, GEOMETRY } from './envelope.tokens';

/**
 * Each layer's class in both states.
 *
 * The `motion-ok:` / `motion-reduced:` pair is how the reduced-motion path is
 * expressed. Tailwind's stock motion-safe:/motion-reduce: are NOT used --
 * under NativeWind they compile to a media form the native runtime always
 * evaluates as false, so they would silently drop every rule they guard. See
 * the note in tailwind.config.js.
 *
 * Under reduced motion each layer jumps straight to the same resting value its
 * keyframes would have ended on, so the two paths cannot drift apart.
 */
const LAYER_CLASSES = {
  flap: {
    open: 'motion-ok:envelope-flap motion-reduced:envelope-flap-open',
    closed: 'envelope-flap-closed',
  },
  flapFace: {
    open: 'motion-ok:envelope-flap-face motion-reduced:envelope-flap-face-open',
    closed: 'envelope-flap-face-closed',
  },
  flapLining: {
    open: 'motion-ok:envelope-flap-lining motion-reduced:envelope-flap-lining-open',
    closed: 'envelope-flap-lining-closed',
  },
  letter: {
    open: 'motion-ok:envelope-letter motion-reduced:envelope-letter-open',
    closed: 'envelope-letter-closed',
  },
  content: {
    open: 'motion-ok:envelope-content motion-reduced:opacity-100',
    closed: 'opacity-0',
  },
  seal: {
    open: 'motion-ok:envelope-seal motion-reduced:envelope-seal-open',
    closed: 'envelope-seal-closed',
  },
} as const;

const cls = (layer: keyof typeof LAYER_CLASSES, open: boolean) =>
  LAYER_CLASSES[layer][open ? 'open' : 'closed'];

export type GiftEnvelopeProps = {
  /** Small label on the letter, e.g. "Reward unlocked". */
  label?: string;
  /** The headline value, e.g. "Rs 500". */
  value: string;
  /** Supporting line under the value. */
  caption?: string;
  /** Fires once, the first time the envelope is opened. */
  onOpen?: () => void;
  /** Render already-open, for surfaces that show a previously claimed gift. */
  defaultOpen?: boolean;
  /**
   * Take over the press instead of opening in place. Used where the envelope
   * is an entry point to the full-screen gift scene rather than the reveal
   * itself, so the sequence is never played twice in two different frames.
   */
  onPress?: () => void;
  /**
   * Drive the open state from outside instead of holding it internally.
   *
   * Required whenever the surface around the envelope also changes state when
   * it opens: that re-render can remount this component, which silently resets
   * internal state and leaves the envelope sealed while everything else
   * celebrates. Where one thing owns the sequence, it should own this too.
   */
  open?: boolean;
};

export function GiftEnvelope({
  label = 'You received a gift',
  value,
  caption,
  onOpen,
  defaultOpen = false,
  onPress,
  open: controlledOpen,
}: GiftEnvelopeProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = setUncontrolledOpen;
  const scheme = useColorScheme() ?? 'light';
  const palette = ENVELOPE_PALETTE[scheme === 'dark' ? 'dark' : 'light'];

  // Opening is one-way. A gift is opened once, and animating the close would
  // mean a second set of keyframes for a state nobody asks for -- while
  // toggling without them would snap shut and read as a glitch.
  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    if (open) return;
    if (!isControlled) setOpen(true);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    onOpen?.();
  };

  const { width, stageHeight, flapHeight, flapWrapperHeight, flapWrapperTop } = GEOMETRY;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={open ? `${label}. ${value}${caption ? `. ${caption}` : ''}` : label}
      accessibilityHint={open && !onPress ? undefined : 'Opens your gift'}
      accessibilityState={{ expanded: open, disabled: open && !onPress }}
      onPress={handlePress}
      // The focus ring is a real, visible state and lives on the control
      // itself. The border is always present and merely changes colour, so
      // focusing never reflows the envelope inside it. The colour is the
      // app's restrained accent green, not a bright ring -- it has to be
      // visible without becoming the loudest thing on a near-black screen.
      className="items-center justify-center rounded-3xl border-2 border-transparent focus:border-[#1F7A28]"
      style={{
        width: width + GEOMETRY.focusRingInset * 2,
        height: stageHeight + GEOMETRY.focusRingInset * 2,
      }}
    >
      {/*
        The perspective container. On web this is what makes the flap's rotateX
        read as a hinge; on native perspective cannot be inherited, so each
        animated layer carries its own inside its transform (see
        tailwind.config.js). Declared here regardless so both platforms
        describe the same scene.
      */}
      <View className="envelope-stage" style={{ width, height: stageHeight }}>
        {/* --- 10: the rear wall ------------------------------------------ */}
        <View style={[styles.envelopeLayer, { zIndex: 10 }]} pointerEvents="none">
          <EnvelopeBackPanel palette={palette} />
        </View>

        {/* --- 20: the letter --------------------------------------------- */}
        <View
          className={cls('letter', open)}
          style={[styles.letterLayer, { zIndex: 20 }]}
          pointerEvents="none"
        >
          <EnvelopeLetterCard palette={palette} />

          {/*
            The content fades on its own element. Putting this opacity on the
            letter itself would mean two animations driving one element, and
            the second would silently cancel the rise.
          */}
          <View className={cls('content', open)} style={styles.letterContent}>
            <Text style={[styles.letterLabel, { color: palette.inkSoft }]} numberOfLines={1}>
              {label}
            </Text>
            <Text style={[styles.letterValue, { color: palette.ink }]} numberOfLines={1}>
              {value}
            </Text>
            {caption ? (
              <Text style={[styles.letterCaption, { color: palette.inkSoft }]} numberOfLines={2}>
                {caption}
              </Text>
            ) : null}
          </View>
        </View>

        {/* --- 25: the pocket the letter slides out of --------------------- */}
        <View style={[styles.envelopeLayer, { zIndex: 25 }]} pointerEvents="none">
          <EnvelopeFrontPocket palette={palette} />
        </View>

        {/*
          --- 30 -> 0: the flap ------------------------------------------
          This wrapper is twice the flap's height with the artwork in its
          bottom half, so its own centre sits exactly on the fold. That is what
          makes a plain centre rotation behave as a top-edge hinge: React
          Native drops transform-origin entirely, and the usual
          translate/rotate/translate substitute collapses in this parser
          because a keyframe stores one track per transform function.
        */}
        <View
          className={cls('flap', open)}
          style={{
            position: 'absolute',
            top: flapWrapperTop,
            left: 0,
            width,
            height: flapWrapperHeight,
          }}
          pointerEvents="none"
        >
          <View style={{ position: 'absolute', top: flapHeight, left: 0, width, height: flapHeight }}>
            {/*
              Two stacked faces, swapped at the frame the flap is edge-on.
              React Native has no backface-visibility, so a rotated element
              keeps showing the same pixels instead of revealing its reverse.
            */}
            <View className={cls('flapFace', open)} style={StyleSheet.absoluteFill}>
              <EnvelopeFlapFace palette={palette} />
            </View>
            <View className={cls('flapLining', open)} style={StyleSheet.absoluteFill}>
              <EnvelopeFlapLining palette={palette} />
            </View>
          </View>
        </View>

        {/* --- 40: the wax seal ------------------------------------------- */}
        <View
          className={cls('seal', open)}
          style={{
            position: 'absolute',
            top: GEOMETRY.letterRise + flapHeight - 21,
            left: width / 2 - 21,
            zIndex: 40,
          }}
          pointerEvents="none"
        >
          <EnvelopeWaxSeal palette={palette} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // The envelope body sits at the bottom of the stage; the space above it is
  // the headroom the letter rises into.
  envelopeLayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: GEOMETRY.width,
    height: GEOMETRY.height,
  },
  letterLayer: {
    position: 'absolute',
    bottom: GEOMETRY.letterInset,
    left: (GEOMETRY.width - GEOMETRY.letterWidth) / 2,
    width: GEOMETRY.letterWidth,
    height: GEOMETRY.letterHeight,
  },
  letterContent: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  letterLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  letterValue: {
    fontSize: 30,
    fontWeight: '800',
    marginTop: 6,
  },
  letterCaption: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
});
