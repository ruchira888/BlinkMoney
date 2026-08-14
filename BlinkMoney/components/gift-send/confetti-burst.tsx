/**
 * A one-shot confetti burst.
 *
 * Deliberately small: eighteen pieces, each a single animated View driving one
 * transform on the UI thread. It plays once and stops -- looping confetti
 * turns a moment of celebration into background noise.
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
const PIECES = 18;
const FALL_DURATION = 1900;

type Piece = {
  id: number;
  color: string;
  startX: number;
  drift: number;
  size: number;
  delay: number;
  spin: number;
};

type PieceProps = { piece: Piece; travel: number };

/** Module level: each piece owns a shared value and an animated style. */
function ConfettiPiece({ piece, travel }: PieceProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      piece.delay,
      withTiming(1, { duration: FALL_DURATION, easing: Easing.out(Easing.quad) })
    );
  }, [piece.delay, progress]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: progress.value * travel },
      { translateX: progress.value * piece.drift },
      { rotate: `${progress.value * piece.spin}deg` },
    ],
    // Holds full opacity for most of the fall, then fades out at the end.
    opacity: progress.value > 0.75 ? (1 - progress.value) * 4 : 1,
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          left: piece.startX,
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

  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: PIECES }, (_, id) => ({
        id,
        color: COLORS[id % COLORS.length],
        startX: Math.random() * width,
        drift: (Math.random() - 0.5) * 120,
        size: 6 + Math.random() * 5,
        delay: Math.random() * 320,
        spin: (Math.random() - 0.5) * 720,
      })),
    [width]
  );

  if (reduceMotion) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((piece) => (
        <ConfettiPiece key={piece.id} piece={piece} travel={height * 0.9} />
      ))}
    </View>
  );
}

export const ConfettiBurst = memo(ConfettiBurstComponent);

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: -24,
    borderRadius: Radius.xs,
  },
});
