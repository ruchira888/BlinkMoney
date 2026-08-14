/**
 * A large tappable row on Rewards.
 *
 * The press treatment is three things moving together rather than one, which
 * is what the good versions of this pattern do -- the whole card dips, a veil
 * lightens its surface, and the chevron slides forward. Any one alone reads as
 * a state change; together they read as the row being pushed.
 *
 * All of it runs on the UI thread off a single shared value, so the press
 * stays responsive even while the JS thread handles the navigation the press
 * just triggered -- which is exactly the moment a JS-driven press animation
 * would stutter.
 */

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {
  Duration,
  Glass,
  Radius,
  Spacing,
  Typography,
  elevation,
  type ColorSchemeName,
  type ThemePalette,
} from '@/constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Firm and quick. A slow spring on a tap target reads as lag, not polish. */
const SPRING = { damping: 20, stiffness: 340, mass: 0.6 } as const;

type Props = {
  icon: string;
  title: string;
  body: string;
  /** Rendered as a count pill beside the title. Omit or 0 to hide. */
  badge?: number;
  /** Fills the icon well with the accent instead of the wash. */
  emphasis?: boolean;
  colors: ThemePalette;
  scheme: ColorSchemeName;
  accessibilityLabel: string;
  accessibilityHint?: string;
  onPress: () => void;
};

export function OptionCard({
  icon,
  title,
  body,
  badge,
  emphasis = false,
  colors,
  scheme,
  accessibilityLabel,
  accessibilityHint,
  onPress,
}: Props) {
  const reduceMotion = useReducedMotion();
  const pressed = useSharedValue(0);

  const handlePressIn = useCallback(() => {
    pressed.value = reduceMotion ? 1 : withSpring(1, SPRING);
    Haptics.selectionAsync().catch(() => {});
  }, [pressed, reduceMotion]);

  const handlePressOut = useCallback(() => {
    pressed.value = reduceMotion ? 0 : withSpring(0, SPRING);
  }, [pressed, reduceMotion]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pressed.value, [0, 1], [1, 0.975]) }],
  }));

  /** The veil is a sibling overlay rather than an animated backgroundColor:
   *  colour interpolation on a surface this large is more expensive than
   *  fading a flat layer over it. */
  const veilStyle = useAnimatedStyle(() => ({
    opacity: reduceMotion ? 0 : withTiming(pressed.value * 0.6, { duration: Duration.instant }),
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(pressed.value, [0, 1], [0, 5]) }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.accent },
        elevation(scheme, 2),
        cardStyle,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[styles.veil, { backgroundColor: Glass.press }, veilStyle]}
      />

      <View
        style={[
          styles.iconWell,
          { backgroundColor: emphasis ? colors.accent : colors.accentWash },
        ]}
      >
        <Ionicons
          name={icon as never}
          size={24}
          color={emphasis ? colors.onAccent : colors.accentInk}
        />
      </View>

      <View style={styles.text}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {badge ? (
            <View style={[styles.badge, { backgroundColor: colors.accent }]}>
              <Text style={[styles.badgeText, { color: colors.onAccent }]}>{badge}</Text>
            </View>
          ) : null}
        </View>
        <Text style={[styles.body, { color: colors.textMuted }]}>{body}</Text>
      </View>

      <Animated.View style={chevronStyle}>
        <Ionicons name="chevron-forward" size={18} color={colors.accentInk} />
      </Animated.View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.xl,
    overflow: 'hidden',
  },
  veil: {
    ...StyleSheet.absoluteFillObject,
  },
  iconWell: {
    width: 52,
    height: 52,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: Spacing.xs },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  title: { ...Typography.subheading },
  body: { ...Typography.caption },
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: Spacing.xs,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { ...Typography.micro, fontWeight: '700' },
});
