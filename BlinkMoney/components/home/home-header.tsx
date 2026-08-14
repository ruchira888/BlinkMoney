/**
 * Home's top bar: identity on the left, help on the right.
 *
 * The theme toggle and the notification bell used to live here. Both are gone:
 * the app is dark only, and there is nothing to notify about that the Rewards
 * entry point does not already surface.
 */

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/pressable-scale';
import { Radius, Spacing, Typography, type ThemePalette } from '@/constants/theme';

type Props = {
  name: string;
  colors: ThemePalette;
  onPressHelp: () => void;
};

export function HomeHeader({ name, colors, onPressHelp }: Props) {
  const initial = name.trim().charAt(0).toUpperCase() || 'U';

  return (
    <View style={styles.row}>
      <View style={styles.identity}>
        <View style={[styles.avatar, { backgroundColor: colors.avatarBg }]}>
          <Text style={[styles.avatarText, { color: colors.avatarInk }]}>{initial}</Text>
        </View>
        <View style={styles.greeting}>
          <Text style={[styles.hello, { color: colors.text }]} numberOfLines={1}>
            Hello {name} 👋
          </Text>
          <Text style={[styles.tagline, { color: colors.textMuted }]} numberOfLines={1}>
            Let’s grow your money
          </Text>
        </View>
      </View>

      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Chat with support on WhatsApp"
        onPress={onPressHelp}
        haptic
        style={[styles.help, { backgroundColor: colors.accentWash }]}
      >
        <Ionicons name="logo-whatsapp" size={17} color={colors.accentInk} />
        <Text style={[styles.helpText, { color: colors.accentInk }]}>Help</Text>
      </PressableScale>
    </View>
  );
}

const AVATAR = 44;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    // Lets the greeting truncate instead of shoving Help off-screen on a
    // narrow device.
    flexShrink: 1,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...Typography.heading,
  },
  greeting: {
    flexShrink: 1,
  },
  hello: {
    ...Typography.subheading,
  },
  tagline: {
    ...Typography.caption,
  },
  help: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
    height: 40,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill,
  },
  helpText: {
    ...Typography.caption,
    fontWeight: '700',
  },
});
