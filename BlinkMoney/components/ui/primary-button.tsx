/**
 * The app's primary call to action.
 *
 * One component so the CTA's height, radius, weight and press feel are decided
 * once. The label is passed in because it changes with the promo card on
 * screen -- "Start SIP" on the green card, "Check eligibility" on the blue one.
 */

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/pressable-scale';
import { Radius, Spacing, Typography, elevation, type ColorSchemeName, type ThemePalette } from '@/constants/theme';

type Props = {
  label: string;
  colors: ThemePalette;
  scheme: ColorSchemeName;
  onPress?: () => void;
};

export function PrimaryButton({ label, colors, scheme, onPress }: Props) {
  return (
    <View style={styles.wrapper}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        haptic
        style={[styles.button, { backgroundColor: colors.accent }, elevation(scheme, 2)]}
      >
        <Text style={[styles.label, { color: colors.onAccent }]} numberOfLines={1}>
          {label}
        </Text>
        <Ionicons name="arrow-forward" size={18} color={colors.onAccent} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.xl,
  },
  button: {
    height: 54,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  label: {
    ...Typography.subheading,
  },
});
