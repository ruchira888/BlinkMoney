/**
 * Shimmering placeholder block.
 *
 * A sweeping highlight rather than a pulsing opacity: a sweep communicates
 * direction and therefore progress, while a pulse reads as a broken element.
 * The whole animation is a single shared value driving one transform, so a
 * screenful of these costs one UI-thread animation each and zero re-renders.
 *
 * With Reduce Motion on the sweep is dropped and the block renders as a flat
 * fill, which still communicates "content is coming" without moving.
 */

import { useEffect } from 'react';
import { StyleSheet, View, type DimensionValue, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Radius, type ThemePalette } from '@/constants/theme';

const SWEEP_DURATION = 1200;

type Props = {
  width?: DimensionValue;
  height: number;
  radius?: number;
  colors: ThemePalette;
  style?: ViewStyle;
};

export function Skeleton({ width = '100%', height, radius = Radius.sm, colors, style }: Props) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, { duration: SWEEP_DURATION, easing: Easing.inOut(Easing.quad) }),
      -1,
      false
    );
  }, [progress, reduceMotion]);

  const sheenStyle = useAnimatedStyle(() => ({
    // Travels from fully off the left edge to fully off the right.
    transform: [{ translateX: (progress.value * 2 - 1) * 220 }],
    opacity: 0.65,
  }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      style={[
        styles.base,
        { width, height, borderRadius: radius, backgroundColor: colors.skeleton },
        style,
      ]}
    >
      {reduceMotion ? null : (
        <Animated.View
          style={[styles.sheen, { backgroundColor: colors.skeletonSheen }, sheenStyle]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  // Deliberately not absoluteFill: that pins left *and* right, which fights the
  // fixed width the sweep needs in order to travel.
  sheen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 120,
  },
});
