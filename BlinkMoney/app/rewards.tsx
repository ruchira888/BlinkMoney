/**
 * Rewards.
 *
 * Gift a Seed lives inside the existing Rewards section rather than beside it.
 * The GIFTED tab is selected by default when a seed gift is waiting; the
 * app's existing reward categories keep their place underneath.
 *
 * Styles come from a makeStyles factory memoised on the palette. A module-level
 * StyleSheet.create would bake in whichever theme was active at import, which
 * is why this screen previously stayed dark when the toggle was flipped.
 *
 * It now uses the themed BottomNav from components/home rather than the
 * gift-seed one, so there is a single nav bar in the app instead of two that
 * have to be kept in sync.
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav, type NavItem } from '@/components/home/bottom-nav';
import { GIFT } from '@/components/gift-seed/gift';
import { PressableScale } from '@/components/ui/pressable-scale';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Radius, Spacing, Typography, type ThemePalette } from '@/constants/theme';
import { useTheme } from '@/providers/theme-provider';

type Tab = 'GIFTED' | 'EARNED';

const TABS: Tab[] = ['GIFTED', 'EARNED'];

const CATEGORIES: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
}[] = [
  { icon: 'people-outline', title: 'Refer & Earn', body: 'Invite friends, grow together.' },
  { icon: 'flame-outline', title: 'Streak Rewards', body: 'Keep investing, earn more.' },
  { icon: 'ribbon-outline', title: 'Milestone Rewards', body: 'Unlock as you grow.' },
];

/** Clears the floating nav bar. */
const SCROLL_BOTTOM_PADDING = 108;

export default function RewardsScreen() {
  // GIFTED is the default because a seed gift is waiting; without one, EARNED
  // would be the sensible landing tab.
  const [tab, setTab] = useState<Tab>('GIFTED');
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
        title="Your Rewards"
        subtitle="Good things grow here."
        colors={colors}
        onBack={() => router.replace('/')}
      />

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.tabs}>
          {TABS.map((t) => {
            const on = t === tab;
            return (
              <PressableScale
                key={t}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                accessibilityLabel={t}
                onPress={() => setTab(t)}
                haptic
                style={[s.tab, on && s.tabActive]}
              >
                <Text style={[s.tabText, on && s.tabTextActive]}>{t}</Text>
              </PressableScale>
            );
          })}
        </View>

        {tab === 'GIFTED' ? (
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={`Gift a Seed, ${GIFT.amountLabel}, gifted by ${GIFT.sender}`}
            onPress={() => router.push('/gift')}
            haptic
            style={s.gifted}
          >
            <View style={s.giftedTop}>
              <View style={s.giftedIcon}>
                <Ionicons name="gift-outline" size={20} color={colors.accentInk} />
              </View>
              <View style={s.giftedText}>
                <Text style={s.giftedAmount}>{GIFT.amountLabel}</Text>
                <Text style={s.giftedTitle}>Gift a Seed</Text>
                <Text style={s.giftedBy}>Gifted by {GIFT.sender}</Text>
              </View>
              <View style={s.status}>
                <Text style={s.statusText}>Invested</Text>
              </View>
            </View>
            <View style={s.giftedFoot}>
              <Text style={s.giftedFootText}>Open your envelope</Text>
              <Ionicons name="chevron-forward" size={15} color={colors.textMuted} />
            </View>
          </PressableScale>
        ) : (
          <View style={s.empty}>
            <Text style={s.emptyText}>Rewards you earn by investing will appear here.</Text>
          </View>
        )}

        <Text style={s.sectionLabel}>More ways to grow</Text>
        {CATEGORIES.map((category) => (
          <PressableScale
            key={category.title}
            accessibilityRole="button"
            accessibilityLabel={category.title}
            style={s.row}
          >
            <View style={s.rowIcon}>
              <Ionicons name={category.icon} size={19} color={colors.textMuted} />
            </View>
            <View style={s.rowText}>
              <Text style={s.rowTitle}>{category.title}</Text>
              <Text style={s.rowBody}>{category.body}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textFaint} />
          </PressableScale>
        ))}

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

    tabs: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceSunken,
      borderRadius: Radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      padding: Spacing.xs,
      gap: Spacing.xs,
    },
    tab: {
      flex: 1,
      height: 38,
      borderRadius: Radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabActive: { backgroundColor: colors.accent },
    tabText: {
      ...Typography.micro,
      color: colors.textMuted,
      fontWeight: '700',
      letterSpacing: 1.2,
    },
    tabTextActive: { color: colors.onAccent },

    gifted: {
      backgroundColor: colors.surface,
      borderRadius: Radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.accent,
      padding: Spacing.lg,
      gap: Spacing.md,
    },
    giftedTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
    giftedIcon: {
      width: 42,
      height: 42,
      borderRadius: Radius.sm,
      backgroundColor: colors.accentWash,
      alignItems: 'center',
      justifyContent: 'center',
    },
    giftedText: { flex: 1, gap: 1 },
    giftedAmount: { ...Typography.title, color: colors.text },
    giftedTitle: { ...Typography.bodyStrong, color: colors.text },
    giftedBy: { ...Typography.caption, color: colors.textMuted },
    status: {
      backgroundColor: colors.accentWash,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.accent,
      borderRadius: Radius.pill,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
    },
    statusText: { ...Typography.micro, color: colors.accentInk, fontWeight: '700' },
    giftedFoot: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      paddingTop: Spacing.sm,
    },
    giftedFootText: { ...Typography.caption, color: colors.textMuted, fontWeight: '600' },

    empty: {
      backgroundColor: colors.surface,
      borderRadius: Radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      padding: Spacing.xxl,
      alignItems: 'center',
    },
    emptyText: { ...Typography.caption, color: colors.textMuted, textAlign: 'center' },

    sectionLabel: {
      ...Typography.micro,
      color: colors.textFaint,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      marginTop: Spacing.sm,
      marginLeft: Spacing.xxs,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      backgroundColor: colors.surface,
      borderRadius: Radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      padding: Spacing.md,
    },
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
  });
}
