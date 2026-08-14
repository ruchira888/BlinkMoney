/**
 * Screen 9: Investment / Growth.
 *
 * The retention screen. One number, one line, three supporting figures.
 */
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GIFT, GROWTH } from '@/components/gift-seed/gift';
import { InvestmentChart } from '@/components/gift-seed/investment-chart';
import { C, RADIUS } from '@/components/gift-seed/theme';
import { Card, PrimaryButton, ScreenTitle, SecondaryButton, TopBar } from '@/components/gift-seed/ui';

export default function GiftGrowthScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="light" />
      <TopBar onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))} />

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <ScreenTitle title="Your Seed is Growing" subtitle="Track your journey." />

        <Card style={s.main}>
          <View style={s.valueRow}>
            <View>
              <Text style={s.valueLabel}>Current Value</Text>
              <Text style={s.value}>{GROWTH.currentLabel}</Text>
            </View>
            <View style={s.pill}>
              <Text style={s.pillText}>{GROWTH.percent}</Text>
            </View>
          </View>

          <InvestmentChart series={GROWTH.series} height={104} />

          <View style={s.stats}>
            <Stat label="From gifting" value={GIFT.amountLabel} />
            <View style={s.statDivider} />
            <Stat label="Current value" value={GROWTH.currentLabel} />
            <View style={s.statDivider} />
            <Stat label="Growth" value={GROWTH.gain} accent />
          </View>
        </Card>

        <Card style={s.quote}>
          <Text style={s.quoteText}>&ldquo;Patience grows wealth.&rdquo;</Text>
        </Card>

        <PrimaryButton label="View Full Portfolio" style={s.cta} />
        <SecondaryButton
          label="Say Thank You"
          icon="heart-outline"
          onPress={() => router.push('/gift-thanks')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={s.stat}>
      <Text style={s.statLabel}>{label}</Text>
      <Text style={[s.statValue, accent && s.statValueAccent]}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  body: { paddingHorizontal: 18, paddingBottom: 34, gap: 12 },

  main: { gap: 14, backgroundColor: C.cardAlt },
  valueRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  valueLabel: { color: C.textMuted, fontSize: 12.5 },
  value: { color: C.text, fontFamily: 'serif', fontSize: 34, fontWeight: '700', marginTop: 2 },
  pill: {
    backgroundColor: C.greenDim,
    borderWidth: 1,
    borderColor: C.green,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillText: { color: C.text, fontSize: 12, fontWeight: '700' },

  stats: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, gap: 3 },
  statDivider: { width: 1, height: 28, backgroundColor: C.hairline },
  statLabel: { color: C.textFaint, fontSize: 11, textAlign: 'center' },
  statValue: { color: C.text, fontSize: 14, fontWeight: '700', textAlign: 'center' },
  statValueAccent: { color: C.greenBright },

  quote: { alignItems: 'center', paddingVertical: 16 },
  quoteText: { color: C.textMuted, fontFamily: 'serif', fontSize: 15 },

  cta: { marginTop: 4 },
});
