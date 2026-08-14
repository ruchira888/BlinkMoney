/**
 * A rupee figure that counts to its new value.
 *
 * Deliberately animated in JS with requestAnimationFrame rather than on the UI
 * thread. Reanimated cannot set a Text node's children directly -- the usual
 * workaround is animating a TextInput's `text` prop through animatedProps,
 * which brings a caret, a different baseline and Fabric-specific quirks to
 * what is only ever a read-only label.
 *
 * The cost of doing it in JS is bounded because this component is memoised and
 * owns a single Text node: a tick re-renders this and nothing else. Its parent
 * card, the slider and the carousel are untouched.
 */

import { memo, useEffect, useRef, useState } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { Duration } from '@/constants/theme';
import { formatRupees } from '@/lib/sip';

type Props = {
  value: number;
  style?: StyleProp<TextStyle>;
};

/** Ease-out cubic: fast off the mark, settling gently, so the figure reads as
 *  arriving rather than as ticking at a constant rate. */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function AnimatedRupeesComponent({ value, style }: Props) {
  const reduceMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState(value);

  /** The value the last animation started from. A ref so that retargeting
   *  mid-flight starts from where the number actually is on screen, instead of
   *  snapping back to the previous target. */
  const fromRef = useRef(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduceMotion) {
      fromRef.current = value;
      setDisplayed(value);
      return;
    }

    const from = fromRef.current;
    const delta = value - from;
    if (delta === 0) {
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / Duration.slow);
      const current = from + delta * easeOutCubic(t);

      fromRef.current = current;
      setDisplayed(current);

      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
        setDisplayed(value);
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [reduceMotion, value]);

  return (
    <Text style={style} accessibilityLabel={formatRupees(value)} numberOfLines={1}>
      {formatRupees(displayed)}
    </Text>
  );
}

export const AnimatedRupees = memo(AnimatedRupeesComponent);
