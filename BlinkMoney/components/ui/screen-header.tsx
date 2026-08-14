/**
 * Back button and title for secondary screens.
 *
 * Takes an onBack rather than calling router.back() itself, so it stays a
 * presentational component and the screen keeps control of where back goes --
 * Rewards replaces the route, Notifications pops it.
 */

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/pressable-scale';
import { Radius, Spacing, Typography, type ThemePalette } from '@/constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  colors: ThemePalette;
  onBack: () => void;
};

export function ScreenHeader({ title, subtitle, colors, onBack }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          style={[styles.back, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </PressableScale>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
      </View>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.heading,
    flexShrink: 1,
  },
  subtitle: {
    ...Typography.body,
  },
});
