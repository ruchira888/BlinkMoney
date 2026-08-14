/**
 * Home's top bar: identity on the left, actions on the right.
 *
 * The theme toggle lives here rather than buried in a settings screen because
 * the app opens dark by default and a first-time user on a bright screen needs
 * a way out that they can find without hunting.
 */

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/pressable-scale';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Radius, Spacing, Typography, elevation, type ColorSchemeName, type ThemePalette } from '@/constants/theme';

type Props = {
  name: string;
  colors: ThemePalette;
  scheme: ColorSchemeName;
  isDark: boolean;
  onToggleTheme: () => void;
  onPressNotifications: () => void;
  onPressHelp: () => void;
  /** Shows the unread pip on the bell. */
  hasNotifications?: boolean;
};

export function HomeHeader({
  name,
  colors,
  scheme,
  isDark,
  onToggleTheme,
  onPressNotifications,
  onPressHelp,
  hasNotifications = false,
}: Props) {
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

      <View style={styles.actions}>
        <ThemeToggle isDark={isDark} colors={colors} onToggle={onToggleTheme} />

        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          onPress={onPressNotifications}
          style={[
            styles.iconButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
            elevation(scheme, 1),
          ]}
        >
          <Ionicons name="notifications-outline" size={20} color={colors.text} />
          {hasNotifications ? (
            <View
              style={[
                styles.pip,
                { backgroundColor: colors.accent, borderColor: colors.surface },
              ]}
            />
          ) : null}
        </PressableScale>

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
    // Lets the greeting truncate instead of shoving the actions off-screen on
    // a narrow device.
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pip: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
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
