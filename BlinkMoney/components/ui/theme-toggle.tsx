/**
 * Light/dark switch.
 *
 * The icon crossfades and counter-rotates rather than swapping instantly, so
 * the change of theme reads as one continuous event together with the colours
 * animating underneath it.
 *
 * Both icons are always mounted and animated by opacity. Swapping which icon
 * is rendered would make the crossfade impossible, since one of the two would
 * always be missing mid-transition.
 */

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  withTiming,
} from 'react-native-reanimated';

import { PressableScale } from '@/components/ui/pressable-scale';
import { Duration, Radius, type ThemePalette } from '@/constants/theme';

type Props = {
  isDark: boolean;
  colors: ThemePalette;
  onToggle: () => void;
};

const SIZE = 40;

export function ThemeToggle({ isDark, colors, onToggle }: Props) {
  const reduceMotion = useReducedMotion();

  /** 0 = light, 1 = dark. Derived from the prop so it can never disagree with
   *  the theme actually in effect. */
  const progress = useDerivedValue(() =>
    reduceMotion
      ? (isDark ? 1 : 0)
      : withTiming(isDark ? 1 : 0, { duration: Duration.base })
  );

  const sunStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ rotate: `${progress.value * 90}deg` }, { scale: 1 - progress.value * 0.4 }],
  }));

  const moonStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { rotate: `${(1 - progress.value) * -90}deg` },
      { scale: 0.6 + progress.value * 0.4 },
    ],
  }));

  return (
    <PressableScale
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onPress={onToggle}
      haptic
      style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.iconStack}>
        <Animated.View style={[styles.icon, sunStyle]}>
          <Ionicons name="sunny" size={20} color={colors.accentInk} />
        </Animated.View>
        <Animated.View style={[styles.icon, moonStyle]}>
          <Ionicons name="moon" size={18} color={colors.accentInk} />
        </Animated.View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStack: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
