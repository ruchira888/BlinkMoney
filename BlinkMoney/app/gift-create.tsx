/**
 * Screen 1: Create Gift.
 *
 * Occasion, amount, message, and a preview that looks like the physical card
 * the recipient will actually get -- so the sender sees what they are sending.
 */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatAmount, GIFT, OCCASIONS, PRESETS } from '@/components/gift-seed/gift';
import { C, PAPER, RADIUS } from '@/components/gift-seed/theme';
import { Card, PrimaryButton, ScreenTitle, TopBar } from '@/components/gift-seed/ui';

const OCCASION_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  Birthday: 'gift-outline',
  Diwali: 'flame-outline',
  Shagun: 'ribbon-outline',
  'Just Because': 'heart-outline',
};

export default function GiftCreateScreen() {
  const router = useRouter();
  const [occasion, setOccasion] = useState<string>(OCCASIONS[0]);
  const [amount, setAmount] = useState('101');
  // Typed explicitly: GIFT is `as const`, so inference would pin this to the
  // literal default and reject any edit.
  const [message, setMessage] = useState<string>(GIFT.message);

  const numeric = Number(amount.replace(/[^0-9]/g, '')) || 0;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="light" />
      <TopBar onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))} />

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <ScreenTitle
          title="Gift a Seed"
          subtitle="Plant the seeds of wealth for someone special."
        />

        {/* ---------------------------------------------------- occasion */}
        <Card style={s.block}>
          <Text style={s.label}>Select Occasion</Text>
          <View style={s.occasionRow}>
            {OCCASIONS.map((o) => {
              const active = o === occasion;
              return (
                <Pressable
                  key={o}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={o}
                  onPress={() => setOccasion(o)}
                  style={[s.occasion, active && s.occasionActive]}
                >
                  <Ionicons
                    name={OCCASION_ICON[o]}
                    size={19}
                    color={active ? C.text : C.textMuted}
                  />
                  <Text style={[s.occasionText, active && s.occasionTextActive]} numberOfLines={1}>
                    {o}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* ------------------------------------------------------ amount */}
        <Card style={s.block}>
          <Text style={s.label}>Gift Amount</Text>
          <View style={s.amountField}>
            <Text style={s.rupee}>₹</Text>
            <TextInput
              value={amount}
              onChangeText={(t) => setAmount(t.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              accessibilityLabel="Gift amount in rupees"
              style={s.amountInput}
              placeholderTextColor={C.textFaint}
              maxLength={7}
            />
          </View>
          <View style={s.presetRow}>
            {PRESETS.map((p) => (
              <Pressable
                key={p}
                accessibilityRole="button"
                accessibilityLabel={`Set amount to ${formatAmount(p)}`}
                onPress={() => setAmount(String(p))}
                style={[s.preset, numeric === p && s.presetActive]}
              >
                <Text style={[s.presetText, numeric === p && s.presetTextActive]}>
                  {formatAmount(p)}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        {/* ----------------------------------------------------- message */}
        <Card style={s.block}>
          <Text style={s.label}>Personal Message</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Write a message for them..."
            placeholderTextColor={C.textFaint}
            multiline
            accessibilityLabel="Personal message"
            style={s.messageInput}
            maxLength={140}
          />
        </Card>

        {/* ----------------------------------------------------- preview */}
        <Text style={[s.label, s.previewLabel]}>Preview</Text>
        <View style={s.preview}>
          <Text style={s.previewEyebrow}>{occasion.toUpperCase()}</Text>
          <Text style={s.previewAmount}>{formatAmount(numeric)}</Text>
          <View style={s.previewRule} />
          <Text style={s.previewMessage} numberOfLines={3}>
            &ldquo;{message || GIFT.message}&rdquo;
          </Text>
          <Text style={s.previewFoot}>A small seed for a bigger tomorrow.</Text>
        </View>

        <PrimaryButton
          label="Generate Gift Link"
          onPress={() => router.push('/gift-confirm')}
          style={s.cta}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  body: { paddingHorizontal: 18, paddingBottom: 34, gap: 12 },
  block: { gap: 10 },
  label: { color: C.textMuted, fontSize: 12.5, fontWeight: '600' },

  occasionRow: { flexDirection: 'row', gap: 8 },
  occasion: {
    flex: 1,
    height: 66,
    borderRadius: RADIUS.md,
    backgroundColor: C.cardAlt,
    borderWidth: 1,
    borderColor: C.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 3,
  },
  occasionActive: { backgroundColor: C.greenDim, borderColor: C.green },
  occasionText: { color: C.textMuted, fontSize: 10.5, fontWeight: '600' },
  occasionTextActive: { color: C.text },

  amountField: {
    height: 56,
    borderRadius: RADIUS.md,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
  },
  rupee: { color: C.textMuted, fontSize: 19, fontFamily: 'serif' },
  amountInput: {
    flex: 1,
    // Flex children default to min-content width; without this the input keeps
    // its intrinsic width and the digits spill past the field's border.
    minWidth: 0,
    color: C.text,
    fontSize: 24,
    fontFamily: 'serif',
    fontWeight: '700',
    textAlign: 'right',
    padding: 0,
  },
  presetRow: { flexDirection: 'row', gap: 8 },
  preset: {
    flex: 1,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetActive: { borderColor: C.green, backgroundColor: C.greenDim },
  presetText: { color: C.textMuted, fontSize: 12.5, fontWeight: '600' },
  presetTextActive: { color: C.text },

  messageInput: {
    minHeight: 74,
    borderRadius: RADIUS.md,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.hairline,
    padding: 12,
    color: C.text,
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: 'top',
  },

  previewLabel: { marginTop: 6, marginLeft: 2 },
  // The preview is the only warm-white surface on this screen, so the sender
  // sees the actual stock the recipient will open.
  preview: {
    backgroundColor: PAPER.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: PAPER.cardEdge,
    padding: 18,
    alignItems: 'center',
  },
  previewEyebrow: { color: PAPER.accent, fontSize: 9.5, letterSpacing: 2, fontWeight: '700' },
  previewAmount: {
    color: PAPER.ink,
    fontFamily: 'serif',
    fontSize: 38,
    fontWeight: '700',
    marginTop: 6,
  },
  previewRule: { height: 1, alignSelf: 'stretch', backgroundColor: PAPER.cardEdge, marginVertical: 14 },
  previewMessage: {
    color: PAPER.ink,
    fontFamily: 'serif',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  previewFoot: { color: PAPER.inkFaint, fontSize: 11, marginTop: 10 },

  cta: { marginTop: 8 },
});
