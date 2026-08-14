/**
 * Screen 7: Success.
 *
 * Confirms the money moved and immediately shows it doing something, so the
 * screen ends on growth rather than on a receipt.
 */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GIFT, GROWTH } from '@/components/gift-seed/gift';
import { InvestmentChart } from '@/components/gift-seed/investment-chart';
import { C, RADIUS } from '@/components/gift-seed/theme';
import { Card, DataRow, PrimaryButton, SecondaryButton, TopBar } from '@/components/gift-seed/ui';

export default function GiftSuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="light" />
      <TopBar onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))} />

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <View style={s.check}>
            <Ionicons name="checkmark" size={26} color={C.text} />
          </View>
          <Text style={s.title}>All Set.</Text>
          <Text style={s.subtitle}>Your seed has been planted.</Text>
        </View>

        <Card style={s.summary}>
          <View style={s.amountBlock}>
            <Text style={s.amount}>{GIFT.amountLabel}</Text>
            <Text style={s.amountLabel}>Amount invested</Text>
          </View>
          <DataRow label="From" value={GIFT.sender} />
          <DataRow label="Date" value={GIFT.date} />
        </Card>

        <Card style={s.chartCard}>
          <Text style={s.chartLabel}>Projected growth</Text>
          <InvestmentChart series={GROWTH.series} height={88} />
          <Text style={s.chartFoot}>Every big tree starts with a small seed.</Text>
        </Card>

        <PrimaryButton
          label="View My Portfolio"
          onPress={() => router.push('/gift-growth')}
          style={s.cta}
        />
        <SecondaryButton label="Back to Rewards" onPress={() => router.replace('/rewards')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  body: { paddingHorizontal: 18, paddingBottom: 34, gap: 12 },

  hero: { alignItems: 'center', paddingTop: 20, paddingBottom: 8 },
  check: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.green,
    borderWidth: 1,
    borderColor: C.greenBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: C.text, fontFamily: 'serif', fontSize: 30, fontWeight: '700', marginTop: 16 },
  subtitle: { color: C.textMuted, fontSize: 14, marginTop: 6 },

  summary: { paddingTop: 4 },
  amountBlock: { alignItems: 'center', paddingVertical: 12 },
  amount: { color: C.text, fontFamily: 'serif', fontSize: 40, fontWeight: '700' },
  amountLabel: { color: C.textMuted, fontSize: 12.5, marginTop: 2 },

  chartCard: { gap: 10, backgroundColor: C.cardAlt, borderRadius: RADIUS.lg },
  chartLabel: { color: C.textMuted, fontSize: 12.5, fontWeight: '600' },
  chartFoot: { color: C.textFaint, fontSize: 11.5, textAlign: 'center' },

  cta: { marginTop: 4 },
});
