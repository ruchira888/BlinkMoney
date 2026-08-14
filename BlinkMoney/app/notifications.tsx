/**
 * Notifications.
 *
 * Themed via a makeStyles factory memoised on the palette. StyleSheet.create
 * runs at module scope, so a module-level `styles` object bakes in whichever
 * theme was active at import and never repaints -- which is exactly why this
 * screen stayed dark when the toggle was flipped.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/ui/pressable-scale';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Radius, Spacing, Typography, type ThemePalette } from '@/constants/theme';
import { useTheme } from '@/providers/theme-provider';

type Notification = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  when: string;
  /** Gift notifications hand the whole screen over to the gift scene. */
  gift?: { value: string; caption: string };
};

const NOTIFICATIONS: Notification[] = [
  {
    id: 'gift-1',
    icon: 'gift-outline',
    title: 'You received a Seed Gift',
    body: 'Riya sent you a gift. Tap to open it.',
    when: 'Just now',
    gift: { value: '₹101', caption: 'A daily SIP has been started for you.' },
  },
  {
    id: 'sip-1',
    icon: 'trending-up-outline',
    title: 'Your SIP ran today',
    body: '₹100 invested across stocks, FD and gold.',
    when: '2h ago',
  },
  {
    id: 'kyc-1',
    icon: 'shield-checkmark-outline',
    title: 'KYC verified',
    body: 'Your account is fully active.',
    when: 'Yesterday',
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);

  return (
    <SafeAreaView style={[s.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Rule 2: style only, no backgroundColor. */}
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScreenHeader title="Notifications" colors={colors} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {NOTIFICATIONS.map((item) =>
          item.gift ? (
            <PressableScale
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={item.title}
              accessibilityHint="Opens your gift"
              onPress={() => router.push('/gift')}
              haptic
              style={[s.card, s.giftCard]}
            >
              <View style={s.cardRow}>
                <View style={[s.iconCircle, s.giftIconCircle]}>
                  <Ionicons name={item.icon} size={20} color={colors.accentInk} />
                </View>
                <View style={s.cardText}>
                  <Text style={s.cardTitle}>{item.title}</Text>
                  <Text style={s.cardBody}>{item.body}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
              </View>
            </PressableScale>
          ) : (
            <View key={item.id} style={s.card}>
              <View style={s.cardRow}>
                <View style={s.iconCircle}>
                  <Ionicons name={item.icon} size={20} color={colors.textMuted} />
                </View>
                <View style={s.cardText}>
                  <Text style={s.cardTitle}>{item.title}</Text>
                  <Text style={s.cardBody}>{item.body}</Text>
                </View>
                <Text style={s.when}>{item.when}</Text>
              </View>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: ThemePalette) {
  return StyleSheet.create({
    safeArea: { flex: 1 },
    list: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xxxl,
      gap: Spacing.md,
    },
    card: {
      borderRadius: Radius.lg,
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    giftCard: { borderColor: colors.accent },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      padding: Spacing.lg,
    },
    iconCircle: {
      width: 42,
      height: 42,
      borderRadius: Radius.pill,
      backgroundColor: colors.surfaceSunken,
      alignItems: 'center',
      justifyContent: 'center',
    },
    giftIconCircle: { backgroundColor: colors.accentWash },
    cardText: { flex: 1, gap: Spacing.xxs },
    cardTitle: { ...Typography.bodyStrong, color: colors.text },
    cardBody: { ...Typography.caption, color: colors.textMuted },
    when: { ...Typography.micro, color: colors.textFaint },
  });
}
