/**
 * A one-shot confetti burst: a fall from the top plus a cannon from each side.
 *
 * It plays once and stops -- looping confetti turns a moment of celebration
 * into background noise.
 *
 * The arc is the whole trick and it is two lines. `progress` runs linearly,
 * and each axis shapes it differently: x eases out (the launch losing speed)
 * while y is a sine lift minus a squared fall (gravity). That gives the side
 * pieces a real launch-and-drop without a second animation or any per-frame
 * JS -- top pieces just get lift 0 and fall straight down.
 *
 * Colours are unrelated to the brand palette on purpose. Confetti reads as
 * celebration precisely because it does not match the app.
 *
 * Renders nothing under Reduce Motion. There is no static fallback because
 * frozen confetti is meaningless; the success tick carries the message.
 */

import { memo, useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { Radius } from '@/constants/theme';

const COLORS = ['#FF4D9D', '#2B5BE8', '#3FCB6B', '#FFD400', '#FF3B30', '#7B4DFF', '#00C2C7', '#FF8A00'];

const TOP_PIECES = 14;
/** Per side. */
const SIDE_PIECES = 11;
const DURATION = 2100;

type Piece = {
  id: number;
  color: string;
  startX: number;
  startY: number;
  /** Horizontal travel, signed. */
  dx: number;
  /** Downward travel. */
  fall: number;
  /** Peak of the arc. 0 for pieces that only fall. */
  lift: number;
  size: number;
  delay: number;
  spin: number;
};

function ConfettiPiece({ piece }: { piece: Piece }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      piece.delay,
      // Linear on purpose: the shaping happens per-axis in the style below.
      withTiming(1, { duration: DURATION, easing: Easing.linear })
    );
  }, [piece.delay, progress]);

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      transform: [
        { translateX: piece.dx * (1 - (1 - p) * (1 - p)) },
        { translateY: piece.fall * p * p - piece.lift * Math.sin(p * Math.PI) },
        { rotate: `${p * piece.spin}deg` },
      ],
      // Holds full opacity for most of the flight, then fades at the end.
      opacity: p > 0.78 ? (1 - p) / 0.22 : 1,
    };
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          left: piece.startX,
          top: piece.startY,
          width: piece.size,
          height: piece.size * 1.6,
          backgroundColor: piece.color,
        },
        style,
      ]}
    />
  );
}

function ConfettiBurstComponent() {
  const reduceMotion = useReducedMotion();
  const { width, height } = useWindowDimensions();

  const pieces = useMemo<Piece[]>(() => {
    const make = (id: number, origin: 'top' | 'left' | 'right'): Piece => {
      const side = origin !== 'top';
      const fromLeft = origin === 'left';
      return {
        id,
        color: COLORS[id % COLORS.length],
        startX: origin === 'top' ? Math.random() * width : fromLeft ? -16 : width + 16,
        startY: origin === 'top' ? -24 : height * (0.5 + Math.random() * 0.25),
        dx: side
          ? (fromLeft ? 1 : -1) * (width * 0.45 + Math.random() * width * 0.4)
          : (Math.random() - 0.5) * 120,
        fall: side ? height * (0.5 + Math.random() * 0.35) : height * 0.95,
        // Side pieces launch upward first; top pieces only fall.
        lift: side ? height * (0.18 + Math.random() * 0.16) : 0,
        size: 6 + Math.random() * 5,
        delay: side ? Math.random() * 160 : Math.random() * 340,
        spin: (Math.random() - 0.5) * 720,
      };
    };

    return [
      ...Array.from({ length: TOP_PIECES }, (_, i) => make(i, 'top')),
      ...Array.from({ length: SIDE_PIECES }, (_, i) => make(TOP_PIECES + i, 'left')),
      ...Array.from({ length: SIDE_PIECES }, (_, i) =>
        make(TOP_PIECES + SIDE_PIECES + i, 'right')
      ),
    ];
  }, [height, width]);

  if (reduceMotion) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((piece) => (
        <ConfettiPiece key={piece.id} piece={piece} />
      ))}
    </View>
  );
}

export const ConfettiBurst = memo(ConfettiBurstComponent);

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    borderRadius: Radius.xs,
  },
});
