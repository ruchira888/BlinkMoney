/**
 * Rewards — two things you can do, and nothing else.
 *
 * Give a gift, or open the ones you have been sent. The earn/redeem/history
 * tabs and the gift counters that used to be here are gone: this screen is the
 * doorway to the gifting loop, and every extra row on it was competition for
 * the only two actions that matter.
 *
 * Styles come from a makeStyles factory memoised on the palette. A module-level
 * StyleSheet.create bakes in whichever theme was active at import and never
 * repaints.
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav, type NavItem } from '@/components/home/bottom-nav';
import { PressableScale } from '@/components/ui/pressable-scale';
import { ScreenHeader } from '@/components/ui/screen-header';
import { UNOPENED_COUNT } from '@/constants/received-gifts';
import { Radius, Spacing, Typography, elevation, type ThemePalette } from '@/constants/theme';
import { useTheme } from '@/providers/theme-provider';

/** Clears the floating nav bar. */
const SCROLL_BOTTOM_PADDING = 108;

export default function RewardsScreen() {
  const { colors, scheme, isDark } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);

  const handleNav = (item: NavItem) => {
    if (item.id === 'home') {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Rule 2: style only, no backgroundColor. */}
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScreenHeader
        title="Rewards"
        subtitle="Small steps. Bigger future."
        colors={colors}
        onBack={() => router.replace('/')}
      />

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Gift a Seed"
          accessibilityHint="Send someone a gift that gets invested"
          onPress={() => router.push('/gift-send/card')}
          haptic
          style={[s.option, elevation(scheme, 2)]}
        >
          <View style={[s.optionIcon, { backgroundColor: colors.accent }]}>
            <Ionicons name="gift" size={24} color={colors.onAccent} />
          </View>
          <View style={s.optionText}>
            <Text style={s.optionTitle}>Gift a Seed</Text>
            <Text style={s.optionBody}>
              Send someone a head start. They claim it, it starts growing.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.accentInk} />
        </PressableScale>

        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={
            UNOPENED_COUNT > 0
              ? `Received gifts, ${UNOPENED_COUNT} waiting to be opened`
              : 'Received gifts'
          }
          accessibilityHint="Open gifts your friends have sent you"
          onPress={() => router.push('/gift-received')}
          haptic
          style={[s.option, elevation(scheme, 2)]}
        >
          <View style={[s.optionIcon, { backgroundColor: colors.accentWash }]}>
            <Ionicons name="mail-open" size={24} color={colors.accentInk} />
          </View>
          <View style={s.optionText}>
            <View style={s.titleRow}>
              <Text style={s.optionTitle}>Received Gifts</Text>
              {UNOPENED_COUNT > 0 ? (
                <View style={s.badge}>
                  <Text style={s.badgeText}>{UNOPENED_COUNT}</Text>
                </View>
              ) : null}
            </View>
            <Text style={s.optionBody}>Check the gifts your friends have sent you.</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.accentInk} />
        </PressableScale>

        <View style={{ height: SCROLL_BOTTOM_PADDING }} />
      </ScrollView>

      <BottomNav activeId="rewards" colors={colors} scheme={scheme} onPress={handleNav} />
    </SafeAreaView>
  );
}

function makeStyles(colors: ThemePalette) {
  return StyleSheet.create({
    safe: { flex: 1 },
    body: {
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.sm,
      gap: Spacing.lg,
    },

    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: Radius.xl,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.accent,
      padding: Spacing.xl,
    },
    optionIcon: {
      width: 52,
      height: 52,
      borderRadius: Radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionText: { flex: 1, gap: Spacing.xs },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    optionTitle: { ...Typography.subheading, color: colors.text },
    optionBody: { ...Typography.caption, color: colors.textMuted },

    badge: {
      minWidth: 20,
      height: 20,
      paddingHorizontal: Spacing.xs,
      borderRadius: Radius.pill,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: { ...Typography.micro, color: colors.onAccent, fontWeight: '700' },
  });
}
