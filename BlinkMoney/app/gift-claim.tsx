/**
 * Screen 6: Claim.
 *
 * The trust screen. The emotional moment has happened; this one has to answer
 * "what actually is this?" before asking for a tap.
 */
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GIFT } from '@/components/gift-seed/gift';
import { C } from '@/components/gift-seed/theme';
import {
  Assurance,
  Card,
  DataRow,
  FeatureRow,
  PrimaryButton,
  ScreenTitle,
  SecondaryButton,
  TopBar,
} from '@/components/gift-seed/ui';

export default function GiftClaimScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="light" />
      <TopBar onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))} />

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <ScreenTitle title="Your Seed is Ready" subtitle="Claim it and start growing." />

        <Card style={s.summary}>
          <DataRow label="Amount" value={GIFT.amountLabel} divider={false} strong />
          <DataRow label="Gifted by" value={GIFT.sender} />
          <DataRow label="Investment" value={GIFT.vehicle} />
        </Card>

        <Text style={s.explain}>
          Your gift has already been invested. You can start watching it grow immediately.
        </Text>

        <Card style={s.features}>
          <FeatureRow
            icon="stats-chart-outline"
            title="Auto Invested"
            body="Goes into your BlinkMoney portfolio automatically."
          />
          <View style={s.featureDivider} />
          <FeatureRow
            icon="trending-up-outline"
            title="Grows Over Time"
            body="Watch your wealth grow with time."
          />
          <View style={s.featureDivider} />
          <FeatureRow
            icon="shield-checkmark-outline"
            title="Secure & Regulated"
            body="Backed by SEBI registered partners."
          />
        </Card>

        <PrimaryButton
          label="Claim & Start Growing"
          onPress={() => router.push('/gift-success')}
          style={s.cta}
        />
        <SecondaryButton label="Learn More" />

        <Assurance text="This amount will be invested in your BlinkMoney account." />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  body: { paddingHorizontal: 18, paddingBottom: 34, gap: 12 },
  summary: { paddingTop: 4 },
  explain: {
    color: C.textMuted,
    fontSize: 13.5,
    lineHeight: 20,
    paddingHorizontal: 2,
  },
  features: { gap: 14 },
  featureDivider: { height: 1, backgroundColor: C.hairline },
  cta: { marginTop: 4 },
});
