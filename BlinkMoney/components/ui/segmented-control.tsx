/**
 * Generic segmented control with a sliding selection pill.
 *
 * The pill is one animated element that moves, rather than a background that
 * appears and disappears per segment. That is what makes the selection feel
 * like a single object being moved instead of two things blinking.
 *
 * Generic over the option value so callers keep their union types
 * (Frequency, Horizon) end to end instead of stringly-typing the selection.
 */

import { useCallback, useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  withTiming,
} from 'react-native-reanimated';

import { PressableScale } from '@/components/ui/pressable-scale';
import { Duration, Radius, Spacing, Typography, type ThemePalette } from '@/constants/theme';

export type SegmentOption<T> = {
  value: T;
  label: string;
};

type Props<T> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  colors: ThemePalette;
  accessibilityLabel: string;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  colors,
  accessibilityLabel,
}: Props<T>) {
  /** Measured rather than assumed: the pill has to match the real segment
   *  width, which depends on the parent's padding and the device width. */
  const [trackWidth, setTrackWidth] = useState(0);
  const reduceMotion = useReducedMotion();

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  }, []);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );
  // onLayout reports the track's border-box width, but the segments live
  // inside its padding -- divide the content box, or the pill runs wider than
  // the segment it is meant to sit under and overhangs the last one.
  const contentWidth = Math.max(0, trackWidth - PILL_INSET * 2);
  const segmentWidth = options.length > 0 ? contentWidth / options.length : 0;

  const pillStyle = useAnimatedStyle(() => {
    const x = segmentWidth * selectedIndex;
    return {
      width: segmentWidth,
      transform: [
        { translateX: reduceMotion ? x : withTiming(x, { duration: Duration.base }) },
      ],
    };
  });

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      onLayout={handleLayout}
      style={[styles.track, { backgroundColor: colors.surfaceSunken }]}
    >
      {/* Only drawn once measured -- a zero-width pill flashing at x=0 on the
          first frame is visible on a slow device. */}
      {segmentWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.pill, { backgroundColor: colors.accentWash, borderColor: colors.accent }, pillStyle]}
        />
      ) : null}

      {options.map((option) => {
        const selected = option.value === value;
        return (
          <PressableScale
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            onPress={() => onChange(option.value)}
            haptic
            style={styles.segment}
          >
            <Text
              style={[
                styles.label,
                { color: selected ? colors.accentInk : colors.textMuted },
                selected && styles.labelSelected,
              ]}
              numberOfLines={1}
            >
              {option.label}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}

const TRACK_HEIGHT = 46;
const PILL_INSET = 3;

const styles = StyleSheet.create({
  track: {
    height: TRACK_HEIGHT,
    borderRadius: Radius.md,
    flexDirection: 'row',
    padding: PILL_INSET,
  },
  pill: {
    position: 'absolute',
    top: PILL_INSET,
    left: PILL_INSET,
    height: TRACK_HEIGHT - PILL_INSET * 2,
    borderRadius: Radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  label: {
    ...Typography.caption,
  },
  labelSelected: {
    fontWeight: '700',
  },
});
