/**
 * A one-shot confetti burst: a fall from the top plus a cannon from each side.
 *
 * It plays once and stops -- looping confetti turns a moment of celebration
 * into background noise.
 *
 * Three details are what separate this from falling rectangles:
 *
 *   Tumble. Each piece scales on X by cos(spin), which flattens it to a line
 *   and back as it turns. Real confetti is flat stock catching the light edge
 *   on, and that flicker is most of what the eye reads as "confetti".
 *
 *   Sway. A sine term on X makes pieces drift side to side as they fall
 *   instead of tracking a straight diagonal.
 *
 *   Arc. progress runs linearly and each axis shapes it: x eases out, as a
 *   launch losing speed, while y is a sine lift minus a squared fall, which is
 *   gravity. Side pieces launch upward and drop; top pieces get lift 0.
 *
 * All of it is one shared value per piece and no per-frame JS.
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

const COLORS = [
  '#FF4D9D',
  '#2B5BE8',
  '#3FCB6B',
  '#FFD400',
  '#FF3B30',
  '#7B4DFF',
  '#00C2C7',
  '#FF8A00',
];

const TOP_PIECES = 18;
/** Per side. */
const SIDE_PIECES = 13;
const DURATION = 2300;

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
  width: number;
  height: number;
  /** Rounded pieces read as streamers among the rectangles. */
  round: boolean;
  delay: number;
  /** Turns about the piece's own face, in radians over the whole flight. */
  spin: number;
  /** Turns about the vertical axis -- this is the tumble. */
  flip: number;
  /** Side-to-side drift while falling. */
  sway: number;
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
    const x = piece.dx * (1 - (1 - p) * (1 - p)) + Math.sin(p * Math.PI * 2) * piece.sway;
    const y = piece.fall * p * p - piece.lift * Math.sin(p * Math.PI);

    // Never fully zero: a piece scaled to 0 pops out of existence for a frame
    // instead of turning through its edge.
    const tumble = Math.max(0.15, Math.abs(Math.cos(p * piece.flip)));

    return {
      transform: [
        { translateX: x },
        { translateY: y },
        { rotate: `${p * piece.spin}deg` },
        { scaleX: tumble },
      ],
      // Holds full opacity for most of the flight, then fades at the end.
      opacity: p > 0.8 ? (1 - p) / 0.2 : 1,
    };
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          left: piece.startX,
          top: piece.startY,
          width: piece.width,
          height: piece.height,
          backgroundColor: piece.color,
          borderRadius: piece.round ? Radius.pill : 1,
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
      const round = id % 5 === 0;
      const w = round ? 5 + Math.random() * 3 : 6 + Math.random() * 5;

      return {
        id,
        color: COLORS[id % COLORS.length],
        startX: origin === 'top' ? Math.random() * width : fromLeft ? -16 : width + 16,
        startY: origin === 'top' ? -28 : height * (0.5 + Math.random() * 0.25),
        dx: side
          ? (fromLeft ? 1 : -1) * (width * 0.45 + Math.random() * width * 0.4)
          : (Math.random() - 0.5) * 90,
        fall: side ? height * (0.5 + Math.random() * 0.35) : height * 0.95,
        // Side pieces launch upward first; top pieces only fall.
        lift: side ? height * (0.18 + Math.random() * 0.16) : 0,
        width: w,
        height: round ? w : w * (1.4 + Math.random() * 0.8),
        round,
        delay: side ? Math.random() * 160 : Math.random() * 380,
        spin: (Math.random() - 0.5) * 900,
        // 3 to 8 half-turns over the flight. Varied, so the field flickers
        // rather than pulsing in unison.
        flip: (3 + Math.random() * 5) * Math.PI,
        sway: side ? 0 : 10 + Math.random() * 26,
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
  },
});
