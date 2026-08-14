/**
 * A Pressable that dips under the finger.
 *
 * Every tappable surface in the app routes through this so the press feel is
 * one decision rather than per-component guesswork. The scale runs as a spring
 * on the UI thread, so it stays responsive even while the JS thread is busy
 * handling whatever the press triggered.
 *
 * Haptics are opt-in per instance and fire on press-in, matching the moment
 * the visual dip starts. `expo-haptics` is a no-op on unsupported hardware, so
 * this needs no platform branch.
 */

import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Firm and quick -- a slow spring on a button reads as lag, not as polish. */
const SPRING = { damping: 18, stiffness: 320, mass: 0.6 } as const;

const PRESSED_SCALE = 0.96;

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** Fire a selection tick on press-in. Reserve for primary actions. */
  haptic?: boolean;
};

export function PressableScale({ style, haptic = false, onPressIn, onPressOut, ...rest }: Props) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const handlePressIn = useCallback<NonNullable<PressableProps['onPressIn']>>(
    (event) => {
      if (!reduceMotion) {
        scale.value = withSpring(PRESSED_SCALE, SPRING);
      }
      if (haptic) {
        // Fire-and-forget: a failed haptic must never break a tap.
        Haptics.selectionAsync().catch(() => {});
      }
      onPressIn?.(event);
    },
    [haptic, onPressIn, reduceMotion, scale]
  );

  const handlePressOut = useCallback<NonNullable<PressableProps['onPressOut']>>(
    (event) => {
      scale.value = withSpring(1, SPRING);
      onPressOut?.(event);
    },
    [onPressOut, scale]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
    />
  );
}
