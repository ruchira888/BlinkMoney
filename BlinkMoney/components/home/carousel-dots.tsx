/**
 * Page indicator for the promo carousel.
 *
 * Driven off the same scrollX shared value as the slides rather than off an
 * activeIndex state, so the pill stretches continuously under the thumb during
 * a drag instead of snapping only once the page has settled. That also means
 * the dots cost no React re-renders while scrolling -- the whole animation runs
 * on the UI thread.
 */

import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { Radius, Spacing, type ThemePalette } from '@/constants/theme';

const DOT_SIZE = 8;
const DOT_ACTIVE_WIDTH = 28;

type DotProps = {
  index: number;
  scrollX: SharedValue<number>;
  slideWidth: number;
  colors: ThemePalette;
};

function DotComponent({ index, scrollX, slideWidth, colors }: DotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * slideWidth, index * slideWidth, (index + 1) * slideWidth];

    const width = interpolate(
      scrollX.value,
      inputRange,
      [DOT_SIZE, DOT_ACTIVE_WIDTH, DOT_SIZE],
      Extrapolation.CLAMP
    );

    const backgroundColor = interpolateColor(scrollX.value, inputRange, [
      colors.dotIdle,
      colors.dotActive,
      colors.dotIdle,
    ]);

    return { width, backgroundColor };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const Dot = memo(DotComponent);

type Props = {
  count: number;
  scrollX: SharedValue<number>;
  slideWidth: number;
  colors: ThemePalette;
};

function CarouselDotsComponent({ count, scrollX, slideWidth, colors }: Props) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {Array.from({ length: count }, (_, index) => (
        <Dot key={index} index={index} scrollX={scrollX} slideWidth={slideWidth} colors={colors} />
      ))}
    </View>
  );
}

export const CarouselDots = memo(CarouselDotsComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: Spacing.xxxl,
  },
  dot: {
    height: DOT_SIZE,
    borderRadius: Radius.pill,
  },
});
