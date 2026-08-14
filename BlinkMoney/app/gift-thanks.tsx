/**
 * Screen 10: Thank You.
 *
 * Closes the loop back to the sender, and quietly opens the next one by
 * offering to send a seed onward.
 */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GIFT } from '@/components/gift-seed/gift';
import { C, RADIUS } from '@/components/gift-seed/theme';
import { PrimaryButton, SecondaryButton, TopBar } from '@/components/gift-seed/ui';

export default function GiftThanksScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="light" />
      <TopBar onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))} />

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <View style={s.mark}>
            <Ionicons name="heart-outline" size={30} color={C.greenBright} />
          </View>
          <Text style={s.title}>Thank You, {GIFT.sender}.</Text>
          <Text style={s.subtitle}>
            Your gift means a lot.{'\n'}Together, we grow.
          </Text>
        </View>

        <PrimaryButton label="Send a Thank You" icon="paper-plane-outline" />
        <SecondaryButton label="Share My Progress" icon="share-social-outline" />

        <View style={s.onward}>
          <Text style={s.onwardLabel}>Keep the momentum going</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send a Seed to someone"
            onPress={() => router.push('/gift-create')}
            style={s.onwardRow}
          >
            <View style={s.onwardIcon}>
              <Ionicons name="gift-outline" size={18} color={C.greenBright} />
            </View>
            <View style={s.onwardText}>
              <Text style={s.onwardTitle}>Send a Seed</Text>
              <Text style={s.onwardBody}>Start someone else&rsquo;s journey.</Text>
            </View>
            <Ionicons name="chevron-forward" size={17} color={C.textFaint} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  body: { paddingHorizontal: 18, paddingBottom: 34, gap: 12 },

  hero: { alignItems: 'center', paddingTop: 34, paddingBottom: 14 },
  mark: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: C.greenDim,
    borderWidth: 1,
    borderColor: C.greenLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: C.text,
    fontFamily: 'serif',
    fontSize: 29,
    fontWeight: '700',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: { color: C.textMuted, fontSize: 14, lineHeight: 21, marginTop: 8, textAlign: 'center' },

  onward: { marginTop: 10, gap: 8 },
  onwardLabel: { color: C.textFaint, fontSize: 11.5, letterSpacing: 1.2, textTransform: 'uppercase' },
  onwardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: C.hairline,
    padding: 13,
  },
  onwardIcon: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.sm,
    backgroundColor: C.greenDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onwardText: { flex: 1, gap: 2 },
  onwardTitle: { color: C.text, fontSize: 14.5, fontWeight: '700' },
  onwardBody: { color: C.textMuted, fontSize: 12.5 },
});
