/**
 * Screen 2: Gift Created.
 *
 * Deliberately sparse. The sender has already done the work; this only has to
 * confirm it and hand them the link.
 */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GIFT } from '@/components/gift-seed/gift';
import { C, PAPER, RADIUS } from '@/components/gift-seed/theme';
import {
  Assurance,
  Card,
  DataRow,
  PrimaryButton,
  SecondaryButton,
  TopBar,
} from '@/components/gift-seed/ui';

export default function GiftConfirmScreen() {
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
          <Text style={s.title}>You&rsquo;ve gifted a Seed!</Text>
          <Text style={s.subtitle}>
            {GIFT.recipient} has started their wealth journey.{'\n'}
            {GIFT.amountLabel} is already invested in their name.
          </Text>
        </View>

        <Card style={s.details}>
          <DataRow label="Amount" value={GIFT.amountLabel} divider={false} strong />
          <DataRow label="Gifted to" value={GIFT.recipient} />
          <DataRow label="Occasion" value={GIFT.occasion} />

          <View style={s.messageBlock}>
            <Text style={s.messageLabel}>Message</Text>
            <Text style={s.messageText}>&ldquo;{GIFT.message}&rdquo;</Text>
          </View>

          <View style={s.linkRow}>
            <Ionicons name="link-outline" size={15} color={C.textFaint} />
            <Text style={s.linkText} numberOfLines={1}>
              {GIFT.link}
            </Text>
            <Ionicons name="copy-outline" size={15} color={C.textMuted} />
          </View>
        </Card>

        <PrimaryButton label="Share Gift Link" icon="share-social-outline" />
        <SecondaryButton label="View Gift" onPress={() => router.push('/gift')} />

        <Assurance text="Small seeds. Big tomorrows." icon="leaf-outline" />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  body: { paddingHorizontal: 18, paddingBottom: 34, gap: 12 },

  hero: { alignItems: 'center', paddingTop: 18, paddingBottom: 6, paddingHorizontal: 10 },
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
  title: {
    color: C.text,
    fontFamily: 'serif',
    fontSize: 26,
    fontWeight: '700',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: C.textMuted,
    fontSize: 13.5,
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },

  details: { paddingTop: 4 },
  messageBlock: {
    borderTopWidth: 1,
    borderTopColor: C.hairline,
    paddingTop: 12,
    marginTop: 2,
    gap: 5,
  },
  messageLabel: { color: C.textMuted, fontSize: 12.5 },
  messageText: { color: PAPER.card, fontFamily: 'serif', fontSize: 14.5, lineHeight: 21 },

  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    height: 42,
    borderRadius: RADIUS.sm,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.hairline,
    paddingHorizontal: 12,
  },
  linkText: { flex: 1, color: C.textMuted, fontSize: 12.5 },
});
