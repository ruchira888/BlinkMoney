/**
 * Draggable amount slider.
 *
 * Built on Gesture Handler + Reanimated rather than a slider package: both are
 * already dependencies and both ship inside Expo Go, so this adds no native
 * module. The knob tracks the finger entirely on the UI thread; React only
 * hears about the value when it crosses a step boundary, which keeps a fast
 * drag from queueing a re-render per frame.
 *
 * The track is also a tap target -- tapping anywhere jumps the knob there,
 * which is what people expect and what makes the control usable one-handed.
 */

import { useCallback, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

import { Radius, type ThemePalette } from '@/constants/theme';

const TRACK_HEIGHT = 10;
const KNOB_SIZE = 28;

type Props = {
  value: number;
  min: number;
  max: number;
  /** Values snap to multiples of this. */
  step: number;
  onChange: (value: number) => void;
  colors: ThemePalette;
  accessibilityLabel: string;
};

export function AmountSlider({
  value,
  min,
  max,
  step,
  onChange,
  colors,
  accessibilityLabel,
}: Props) {
  const [trackWidth, setTrackWidth] = useState(0);

  /** Live 0..1 position. Owned by the gesture while dragging; otherwise
   *  derived from the `value` prop so external changes still move the knob. */
  const dragProgress = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const knobScale = useSharedValue(1);

  const range = Math.max(1, max - min);
  const propProgress = Math.min(1, Math.max(0, (value - min) / range));

  const progress = useDerivedValue(() =>
    isDragging.value ? dragProgress.value : propProgress
  );

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  }, []);

  /** Runs on the JS thread via runOnJS. Quantises before reporting so the
   *  parent only sees legal values. */
  const report = useCallback(
    (nextProgress: number) => {
      const raw = min + nextProgress * range;
      const snapped = Math.round(raw / step) * step;
      const clamped = Math.min(max, Math.max(min, snapped));
      if (clamped !== value) {
        onChange(clamped);
      }
    },
    [max, min, onChange, range, step, value]
  );

  // `usable` is the distance the knob's centre can travel: the track minus the
  // knob, so the knob's edges stop flush with the track's rather than
  // overhanging it at either end.
  const usable = Math.max(1, trackWidth - KNOB_SIZE);

  /**
   * Horizontal-only, and only once the finger has actually moved sideways.
   *
   * A Pan with minDistance(0) claims the touch the instant it lands, which on
   * a vertically scrolling page means the slider swallows any drag that starts
   * on it and the page cannot be scrolled past. activeOffsetX arms it for
   * sideways movement, and failOffsetY hands a vertical drag straight back to
   * the ScrollView.
   */
  const pan = Gesture.Pan()
    .activeOffsetX([-6, 6])
    .failOffsetY([-12, 12])
    .onStart(() => {
      isDragging.value = true;
      knobScale.value = 1.15;
    })
    .onChange((event) => {
      const next = Math.min(1, Math.max(0, (event.x - KNOB_SIZE / 2) / usable));
      dragProgress.value = next;
      runOnJS(report)(next);
    })
    .onFinalize(() => {
      isDragging.value = false;
      knobScale.value = 1;
    });

  /**
   * Tapping the track jumps the knob there. Separate from the pan because the
   * pan now requires sideways movement before it activates, so a clean tap
   * would otherwise do nothing at all.
   */
  const tap = Gesture.Tap().onEnd((event) => {
    const next = Math.min(1, Math.max(0, (event.x - KNOB_SIZE / 2) / usable));
    dragProgress.value = next;
    runOnJS(report)(next);
  });

  const gesture = Gesture.Race(pan, tap);

  const fillStyle = useAnimatedStyle(() => ({
    width: KNOB_SIZE / 2 + progress.value * usable,
  }));

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * usable }, { scale: knobScale.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <View
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ min, max, now: value }}
        style={styles.hitArea}
        onLayout={handleLayout}
      >
        <View style={[styles.track, { backgroundColor: colors.surfaceSunken }]}>
          <Animated.View
            style={[styles.fill, { backgroundColor: colors.accent }, fillStyle]}
          />
        </View>
        <Animated.View
          style={[
            styles.knob,
            { backgroundColor: colors.accent, borderColor: colors.surface },
            knobStyle,
          ]}
        />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  // Taller than the track so the touch target clears the 44pt minimum without
  // drawing a chunky bar.
  hitArea: {
    height: 44,
    justifyContent: 'center',
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: TRACK_HEIGHT,
    borderRadius: Radius.pill,
  },
  knob: {
    position: 'absolute',
    left: 0,
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: Radius.pill,
    borderWidth: 3,
  },
});
