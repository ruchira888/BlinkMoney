/**
 * Step 2 of 4: how much, and what to say.
 *
 * The message suggestions exist because a blank box is the point most people
 * abandon a gift flow -- tapping one fills the field and leaves it editable,
 * so it is a starting point rather than a canned choice.
 */

import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FlowFooter } from '@/components/gift-send/flow-footer';
import { PressableScale } from '@/components/ui/pressable-scale';
import { ScreenHeader } from '@/components/ui/screen-header';
import {
  AMOUNT_PRESETS,
  MAX_GIFT,
  MESSAGE_SUGGESTIONS,
  MIN_GIFT,
} from '@/constants/gift-cards';
import { Radius, Spacing, Typography, type ThemePalette } from '@/constants/theme';
import { formatRupees } from '@/lib/sip';
import { useGiftDraft } from '@/providers/gift-draft-provider';
import { useTheme } from '@/providers/theme-provider';

const MESSAGE_LIMIT = 140;

export default function GiftDetailsScreen() {
  const { colors, scheme } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const { amount, message, setAmount, setMessage } = useGiftDraft();

  /** Kept separate from `amount` so the field can hold an in-progress value
   *  like "" or "1" without the draft flickering to 0 as it is typed. */
  const [customText, setCustomText] = useState('');
  const usingPreset = (AMOUNT_PRESETS as readonly number[]).includes(amount);

  const amountValid = amount >= MIN_GIFT && amount <= MAX_GIFT;

  const handleCustom = (text: string) => {
    const digits = text.replace(/[^0-9]/g, '').slice(0, 5);
    setCustomText(digits);
    setAmount(digits.length > 0 ? Number(digits) : 0);
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScreenHeader
        title="Add Details"
        subtitle="Make it personal."
        colors={colors}
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        style={s.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={s.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.label}>Amount</Text>
          <View style={s.presets}>
            {AMOUNT_PRESETS.map((preset) => {
              const on = usingPreset && amount === preset;
              return (
                <PressableScale
                  key={preset}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={formatRupees(preset)}
                  onPress={() => {
                    setAmount(preset);
                    setCustomText('');
                  }}
                  haptic
                  style={[s.preset, on && s.presetOn]}
                >
                  <Text style={[s.presetText, on && s.presetTextOn]}>{formatRupees(preset)}</Text>
                </PressableScale>
              );
            })}
          </View>

          <View style={s.customRow}>
            <Text style={s.currency}>₹</Text>
            <TextInput
              value={customText}
              onChangeText={handleCustom}
              keyboardType="number-pad"
              placeholder="Custom amount"
              placeholderTextColor={colors.textFaint}
              accessibilityLabel="Custom amount"
              maxLength={5}
              style={s.customInput}
            />
          </View>
          {!amountValid ? (
            <Text style={s.hint}>
              Enter between {formatRupees(MIN_GIFT)} and {formatRupees(MAX_GIFT)}.
            </Text>
          ) : null}

          <Text style={[s.label, s.labelSpaced]}>Your message</Text>
          <TextInput
            value={message}
            onChangeText={(text) => setMessage(text.slice(0, MESSAGE_LIMIT))}
            placeholder="Say something they’ll remember."
            placeholderTextColor={colors.textFaint}
            accessibilityLabel="Your message"
            multiline
            style={s.messageInput}
          />
          <Text style={s.counter}>
            {message.length}/{MESSAGE_LIMIT}
          </Text>

          <View style={s.suggestions}>
            {MESSAGE_SUGGESTIONS.map((suggestion) => (
              <PressableScale
                key={suggestion}
                accessibilityRole="button"
                accessibilityLabel={`Use message: ${suggestion}`}
                onPress={() => setMessage(suggestion.slice(0, MESSAGE_LIMIT))}
                style={s.suggestion}
              >
                <Text style={s.suggestionText}>{suggestion}</Text>
              </PressableScale>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <FlowFooter
        label="Preview Gift"
        colors={colors}
        scheme={scheme}
        step={2}
        disabled={!amountValid}
        onPress={() => router.push('/gift-send/preview')}
      />
    </SafeAreaView>
  );
}

function makeStyles(colors: ThemePalette) {
  return StyleSheet.create({
    safe: { flex: 1 },
    fill: { flex: 1 },
    body: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xxl,
    },
    label: { ...Typography.subheading, color: colors.text, marginBottom: Spacing.md },
    labelSpaced: { marginTop: Spacing.xxl },

    presets: { flexDirection: 'row', gap: Spacing.md },
    preset: {
      flex: 1,
      height: 52,
      borderRadius: Radius.md,
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    presetOn: { backgroundColor: colors.accentWash, borderColor: colors.accent },
    presetText: { ...Typography.subheading, color: colors.textMuted },
    presetTextOn: { color: colors.accentInk },

    customRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      marginTop: Spacing.md,
      paddingHorizontal: Spacing.lg,
      height: 52,
      borderRadius: Radius.md,
      backgroundColor: colors.surfaceSunken,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    currency: { ...Typography.subheading, color: colors.textMuted },
    customInput: { flex: 1, ...Typography.subheading, color: colors.text, padding: 0 },
    hint: { ...Typography.caption, color: colors.danger, marginTop: Spacing.sm },

    messageInput: {
      minHeight: 104,
      borderRadius: Radius.md,
      backgroundColor: colors.surfaceSunken,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      padding: Spacing.lg,
      ...Typography.body,
      color: colors.text,
      textAlignVertical: 'top',
    },
    counter: {
      ...Typography.micro,
      color: colors.textFaint,
      alignSelf: 'flex-end',
      marginTop: Spacing.xs,
    },

    suggestions: { gap: Spacing.sm, marginTop: Spacing.md },
    suggestion: {
      borderRadius: Radius.pill,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
    },
    suggestionText: { ...Typography.caption, color: colors.textMuted },
  });
}
