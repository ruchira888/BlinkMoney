/**
 * Step 1 of 4: pick a card for the occasion.
 */

import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CardPicker } from '@/components/gift-send/card-picker';
import { FlowFooter } from '@/components/gift-send/flow-footer';
import { ScreenHeader } from '@/components/ui/screen-header';
import { GIFT_CARDS } from '@/constants/gift-cards';
import { Spacing } from '@/constants/theme';
import { useGiftDraft } from '@/providers/gift-draft-provider';
import { useTheme } from '@/providers/theme-provider';

export default function ChooseCardScreen() {
  const { colors, scheme } = useTheme();
  const { setCardId } = useGiftDraft();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScreenHeader
        title="Give a Gift"
        subtitle="Pick a card for the occasion."
        colors={colors}
        onBack={() => router.back()}
      />

      <View style={styles.body}>
        <CardPicker
          designs={GIFT_CARDS}
          colors={colors}
          onSelect={(design) => setCardId(design.id)}
        />
      </View>

      <FlowFooter
        label="Continue"
        colors={colors}
        scheme={scheme}
        step={1}
        onPress={() => router.push('/gift-send/details')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: Spacing.xl,
  },
});
