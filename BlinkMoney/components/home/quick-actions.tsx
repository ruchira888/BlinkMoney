/**
 * The four shortcut tiles under the calculator.
 *
 * Laid out with flexWrap and a percentage basis rather than a fixed four-across
 * row: on a narrow phone the tiles reflow to two rows instead of crushing the
 * labels to two characters, and on a tablet they stay on one.
 */

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/pressable-scale';
import { Radius, Spacing, Typography, elevation, type ColorSchemeName, type ThemePalette } from '@/constants/theme';

export type QuickAction = {
  id: string;
  label: string;
  icon: string;
  /** MaterialCommunityIcons carries the rupee glyph; the rest are Ionicons. */
  family: 'ionicons' | 'material';
};

export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'funds', label: 'Explore Funds', icon: 'trending-up', family: 'ionicons' },
  { id: 'gold', label: 'Buy Gold', icon: 'gold', family: 'material' },
  { id: 'borrow', label: 'Borrow', icon: 'currency-inr', family: 'material' },
  { id: 'rewards', label: 'Rewards', icon: 'gift-outline', family: 'ionicons' },
];

type Props = {
  colors: ThemePalette;
  scheme: ColorSchemeName;
  onPress: (action: QuickAction) => void;
};

export function QuickActions({ colors, scheme, onPress }: Props) {
  return (
    <View style={styles.grid}>
      {QUICK_ACTIONS.map((action) => (
        <PressableScale
          key={action.id}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          onPress={() => onPress(action)}
          haptic
          style={[
            styles.tile,
            { backgroundColor: colors.surface, borderColor: colors.border },
            elevation(scheme, 1),
          ]}
        >
          <View style={[styles.iconWell, { backgroundColor: colors.accentWash }]}>
            {action.family === 'material' ? (
              <MaterialCommunityIcons
                name={action.icon as never}
                size={20}
                color={colors.accentInk}
              />
            ) : (
              <Ionicons name={action.icon as never} size={20} color={colors.accentInk} />
            )}
          </View>
          <Text style={[styles.label, { color: colors.textMuted }]} numberOfLines={1}>
            {action.label}
          </Text>
        </PressableScale>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  tile: {
    // Just under a quarter, so four fit with the gaps; they wrap to two rows
    // when the row can no longer give each tile a legible width.
    flexGrow: 1,
    flexBasis: '22%',
    minWidth: 76,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconWell: {
    width: 38,
    height: 38,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Typography.micro,
    textAlign: 'center',
  },
});
