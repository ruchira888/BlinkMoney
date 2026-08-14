/**
 * Screen 8: Rewards.
 *
 * Gift a Seed lives inside the existing Rewards section rather than beside it.
 * The GIFTED tab is selected by default when a seed gift is waiting; the
 * app's existing reward categories keep their place underneath.
 */
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/gift-seed/bottom-nav';
import { GIFT } from '@/components/gift-seed/gift';
import { C, RADIUS } from '@/components/gift-seed/theme';
import { ScreenTitle, TopBar } from '@/components/gift-seed/ui';

type Tab = 'GIFTED' | 'EARNED';

const CATEGORIES: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
}[] = [
  { icon: 'people-outline', title: 'Refer & Earn', body: 'Invite friends, grow together.' },
  { icon: 'flame-outline', title: 'Streak Rewards', body: 'Keep investing, earn more.' },
  { icon: 'ribbon-outline', title: 'Milestone Rewards', body: 'Unlock as you grow.' },
];

export default function RewardsScreen() {
  // GIFTED is the default because a seed gift is waiting; without one, EARNED
  // would be the sensible landing tab.
  const [tab, setTab] = useState<Tab>('GIFTED');

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="light" />
      <TopBar onBack={() => router.replace('/')} />

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <ScreenTitle title="Your Rewards" subtitle="Good things grow here." />

        <View style={s.tabs}>
          {(['GIFTED', 'EARNED'] as Tab[]).map((t) => {
            const on = t === tab;
            return (
              <Pressable
                key={t}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                accessibilityLabel={t}
                onPress={() => setTab(t)}
                style={[s.tab, on && s.tabActive]}
              >
                <Text style={[s.tabText, on && s.tabTextActive]}>{t}</Text>
              </Pressable>
            );
          })}
        </View>

        {tab === 'GIFTED' ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Gift a Seed, ${GIFT.amountLabel}, gifted by ${GIFT.sender}`}
            onPress={() => router.push('/gift')}
            style={s.gifted}
          >
            <View style={s.giftedTop}>
              <View style={s.giftedIcon}>
                <Ionicons name="gift-outline" size={20} color={C.greenBright} />
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
              <Ionicons name="chevron-forward" size={15} color={C.textMuted} />
            </View>
          </Pressable>
        ) : (
          <View style={s.empty}>
            <Text style={s.emptyText}>
              Rewards you earn by investing will appear here.
            </Text>
          </View>
        )}

        <Text style={s.sectionLabel}>More ways to grow</Text>
        {CATEGORIES.map((c) => (
          <Pressable key={c.title} accessibilityRole="button" accessibilityLabel={c.title} style={s.row}>
            <View style={s.rowIcon}>
              <Ionicons name={c.icon} size={19} color={C.textMuted} />
            </View>
            <View style={s.rowText}>
              <Text style={s.rowTitle}>{c.title}</Text>
              <Text style={s.rowBody}>{c.body}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={C.textFaint} />
          </Pressable>
        ))}
      </ScrollView>

      <BottomNav active="Rewards" />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  body: { paddingHorizontal: 18, paddingBottom: 24, gap: 10 },

  tabs: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: C.hairline,
    padding: 4,
    gap: 4,
    marginTop: 4,
  },
  tab: { flex: 1, height: 38, borderRadius: RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
  tabActive: { backgroundColor: C.green },
  tabText: { color: C.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },
  tabTextActive: { color: C.text },

  gifted: {
    backgroundColor: C.cardElevated,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: C.greenLine,
    padding: 14,
    gap: 12,
  },
  giftedTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  giftedIcon: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.sm,
    backgroundColor: C.greenDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftedText: { flex: 1, gap: 1 },
  giftedAmount: { color: C.text, fontFamily: 'serif', fontSize: 24, fontWeight: '700' },
  giftedTitle: { color: C.text, fontSize: 13.5, fontWeight: '600' },
  giftedBy: { color: C.textMuted, fontSize: 12 },
  status: {
    backgroundColor: C.greenDim,
    borderWidth: 1,
    borderColor: C.green,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  statusText: { color: C.text, fontSize: 10.5, fontWeight: '700' },
  giftedFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: C.hairline,
    paddingTop: 10,
  },
  giftedFootText: { color: C.textMuted, fontSize: 12.5, fontWeight: '600' },

  empty: {
    backgroundColor: C.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: C.hairline,
    padding: 22,
    alignItems: 'center',
  },
  emptyText: { color: C.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 19 },

  sectionLabel: {
    color: C.textFaint,
    fontSize: 11.5,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 10,
    marginLeft: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: C.hairline,
    padding: 13,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.sm,
    backgroundColor: C.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { color: C.text, fontSize: 14, fontWeight: '600' },
  rowBody: { color: C.textMuted, fontSize: 12 },
});
