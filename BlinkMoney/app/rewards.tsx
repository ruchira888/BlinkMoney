/**
 * Rewards — the entry point for Gift a Seed.
 *
 * Points balance, the three earn/redeem/history tabs, the Gift a Seed call to
 * action, and a summary of gifts already sent. Gifting lives inside Rewards
 * rather than beside it, so the loop is send → they grow → you both earn.
 *
 * Styles come from a makeStyles factory memoised on the palette. A module-level
 * StyleSheet.create bakes in whichever theme was active at import and never
 * repaints.
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav, type NavItem } from '@/components/home/bottom-nav';
import {
  EARN_ACTIONS,
  HISTORY,
  REDEEM_OPTIONS,
  REWARDS_SUMMARY,
  REWARD_TABS,
  type RewardTab,
} from '@/components/rewards/rewards-data';
import { PressableScale } from '@/components/ui/pressable-scale';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SegmentedControl, type SegmentOption } from '@/components/ui/segmented-control';
import { Radius, Spacing, Typography, elevation, type ThemePalette } from '@/constants/theme';
import { useTheme } from '@/providers/theme-provider';

/** Clears the floating nav bar. */
const SCROLL_BOTTOM_PADDING = 108;

const TAB_OPTIONS: SegmentOption<RewardTab>[] = REWARD_TABS.map((value) => ({
  value,
  label: value,
}));

export default function RewardsScreen() {
  const [tab, setTab] = useState<RewardTab>('Earn');
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
        <View style={[s.balance, elevation(scheme, 2)]}>
          <View style={s.balanceIcon}>
            <Ionicons name="sparkles" size={22} color={colors.accentInk} />
          </View>
          <View style={s.balanceText}>
            <Text style={s.balanceLabel}>Your points</Text>
            <Text style={s.balanceValue}>{REWARDS_SUMMARY.points.toLocaleString('en-IN')}</Text>
          </View>
          <Text style={s.balanceHint}>Keep investing.{'\n'}Earn more.</Text>
        </View>

        <SegmentedControl
          options={TAB_OPTIONS}
          value={tab}
          onChange={setTab}
          colors={colors}
          accessibilityLabel="Rewards sections"
        />

        {tab === 'Earn'
          ? EARN_ACTIONS.map((action) => (
              <View key={action.id} style={s.row}>
                <View style={s.rowIcon}>
                  <Ionicons name={action.icon as never} size={19} color={colors.accentInk} />
                </View>
                <View style={s.rowText}>
                  <Text style={s.rowTitle}>{action.title}</Text>
                  <Text style={s.rowBody}>{action.body}</Text>
                </View>
                {action.done ? (
                  <View style={s.done}>
                    <Ionicons name="checkmark" size={14} color={colors.accentInk} />
                  </View>
                ) : (
                  <Text style={s.points}>+{action.points}</Text>
                )}
              </View>
            ))
          : null}

        {tab === 'Redeem'
          ? REDEEM_OPTIONS.map((option) => {
              const affordable = REWARDS_SUMMARY.points >= option.cost;
              return (
                <PressableScale
                  key={option.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${option.title}, ${option.cost} points`}
                  accessibilityState={{ disabled: !affordable }}
                  disabled={!affordable}
                  haptic={affordable}
                  style={[s.row, !affordable && s.rowDim]}
                >
                  <View style={s.rowIcon}>
                    <Ionicons name={option.icon as never} size={19} color={colors.accentInk} />
                  </View>
                  <View style={s.rowText}>
                    <Text style={s.rowTitle}>{option.title}</Text>
                    <Text style={s.rowBody}>
                      {affordable ? option.body : `Need ${option.cost - REWARDS_SUMMARY.points} more`}
                    </Text>
                  </View>
                  <Text style={s.points}>{option.cost}</Text>
                </PressableScale>
              );
            })
          : null}

        {tab === 'History'
          ? HISTORY.map((entry) => (
              <View key={entry.id} style={s.row}>
                <View style={s.rowText}>
                  <Text style={s.rowTitle}>{entry.title}</Text>
                  <Text style={s.rowBody}>{entry.when}</Text>
                </View>
                <Text style={[s.points, entry.delta < 0 && s.pointsSpent]}>
                  {entry.delta > 0 ? `+${entry.delta}` : entry.delta}
                </Text>
              </View>
            ))
          : null}

        <Text style={s.sectionLabel}>Give someone a head start</Text>

        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Gift a Seed"
          accessibilityHint="Send someone a gift that gets invested"
          onPress={() => router.push('/gift-send/card')}
          haptic
          style={[s.gift, elevation(scheme, 2)]}
        >
          <View style={s.giftIcon}>
            <Ionicons name="gift" size={22} color={colors.onAccent} />
          </View>
          <View style={s.rowText}>
            <Text style={s.giftTitle}>Gift a Seed</Text>
            <Text style={s.giftBody}>Send ₹51 and up. They claim it, it starts growing.</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.accentInk} />
        </PressableScale>

        <Text style={s.sectionLabel}>Your gifts</Text>
        <View style={s.stats}>
          <View style={s.stat}>
            <Text style={s.statValue}>{REWARDS_SUMMARY.giftsSent}</Text>
            <Text style={s.statLabel}>Sent</Text>
          </View>
          <View style={s.stat}>
            <Text style={s.statValue}>{REWARDS_SUMMARY.giftsOpened}</Text>
            <Text style={s.statLabel}>Opened</Text>
          </View>
          <View style={s.stat}>
            <Text style={s.statValue}>{REWARDS_SUMMARY.giftsGrowing}</Text>
            <Text style={s.statLabel}>Growing</Text>
          </View>
        </View>

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
      paddingBottom: Spacing.xxl,
      gap: Spacing.md,
    },

    balance: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      backgroundColor: colors.surface,
      borderRadius: Radius.xl,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.accent,
      padding: Spacing.xl,
    },
    balanceIcon: {
      width: 46,
      height: 46,
      borderRadius: Radius.pill,
      backgroundColor: colors.accentWash,
      alignItems: 'center',
      justifyContent: 'center',
    },
    balanceText: { flex: 1 },
    balanceLabel: { ...Typography.caption, color: colors.textMuted },
    balanceValue: { ...Typography.display, color: colors.text },
    balanceHint: { ...Typography.micro, color: colors.textFaint, textAlign: 'right' },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      backgroundColor: colors.surface,
      borderRadius: Radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      padding: Spacing.lg,
    },
    rowDim: { opacity: 0.55 },
    rowIcon: {
      width: 38,
      height: 38,
      borderRadius: Radius.sm,
      backgroundColor: colors.surfaceSunken,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowText: { flex: 1, gap: Spacing.xxs },
    rowTitle: { ...Typography.bodyStrong, color: colors.text },
    rowBody: { ...Typography.caption, color: colors.textMuted },
    points: { ...Typography.bodyStrong, color: colors.accentInk },
    pointsSpent: { color: colors.textFaint },
    done: {
      width: 26,
      height: 26,
      borderRadius: Radius.pill,
      backgroundColor: colors.accentWash,
      alignItems: 'center',
      justifyContent: 'center',
    },

    sectionLabel: {
      ...Typography.micro,
      color: colors.textFaint,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      marginTop: Spacing.md,
      marginLeft: Spacing.xxs,
    },

    gift: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      backgroundColor: colors.surface,
      borderRadius: Radius.xl,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.accent,
      padding: Spacing.lg,
    },
    giftIcon: {
      width: 46,
      height: 46,
      borderRadius: Radius.pill,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    giftTitle: { ...Typography.subheading, color: colors.text },
    giftBody: { ...Typography.caption, color: colors.textMuted },

    stats: { flexDirection: 'row', gap: Spacing.md },
    stat: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: Radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      paddingVertical: Spacing.lg,
      alignItems: 'center',
      gap: Spacing.xxs,
    },
    statValue: { ...Typography.title, color: colors.text },
    statLabel: { ...Typography.micro, color: colors.textMuted },
  });
}
