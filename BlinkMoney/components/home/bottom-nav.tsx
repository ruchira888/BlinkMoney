/**
 * Floating bottom navigation bar.
 *
 * This is presentation only -- it takes an active id and an onPress and knows
 * nothing about routing. Rule 5 is the reason: the bar is rendered inside a
 * screen, and keeping navigation hooks out of it means it stays safe to move
 * anywhere in the tree later, including above a navigator.
 *
 * It applies its own bottom safe-area inset. Android edge-to-edge is on, so
 * without this the gesture bar sits on top of the tabs.
 */

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/ui/pressable-scale';
import { Radius, Spacing, Typography, elevation, type ColorSchemeName, type ThemePalette } from '@/constants/theme';

export type NavItem = {
  id: string;
  label: string;
  icon: string;
  family: 'ionicons' | 'material';
};

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'home', family: 'ionicons' },
  { id: 'save', label: 'Save', icon: 'cube-outline', family: 'ionicons' },
  { id: 'borrow', label: 'Borrow', icon: 'currency-inr', family: 'material' },
  { id: 'rewards', label: 'Rewards', icon: 'gift-outline', family: 'ionicons' },
];

type Props = {
  activeId: string;
  colors: ThemePalette;
  scheme: ColorSchemeName;
  onPress: (item: NavItem) => void;
};

export function BottomNav({ activeId, colors, scheme, onPress }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrapper,
        // Sit above the gesture bar, but keep a floor so the bar does not hug
        // the screen edge on a device that reports no bottom inset.
        { paddingBottom: Math.max(insets.bottom, Spacing.md) },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.bar,
          { backgroundColor: colors.surface, borderColor: colors.borderStrong },
          elevation(scheme, 3),
        ]}
      >
        {NAV_ITEMS.map((item) => {
          const active = item.id === activeId;
          const tint = active ? colors.onAccent : colors.textMuted;
          return (
            <PressableScale
              key={item.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={item.label}
              onPress={() => onPress(item)}
              haptic
              style={[styles.item, active && { backgroundColor: colors.accent }]}
            >
              {item.family === 'material' ? (
                <MaterialCommunityIcons name={item.icon as never} size={20} color={tint} />
              ) : (
                <Ionicons name={item.icon as never} size={20} color={tint} />
              )}
              <Text
                style={[styles.label, { color: tint }, active && styles.labelActive]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.xl,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.xs,
    gap: Spacing.xs,
  },
  item: {
    flex: 1,
    height: 48,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  label: {
    ...Typography.micro,
  },
  labelActive: {
    fontWeight: '700',
  },
});
