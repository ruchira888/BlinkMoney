/**
 * Screens 3-5: the recipient's moment.
 *
 *   sealed    white envelope on black, "Tap to open"
 *   opening   flap hinges back, the card rises out of it
 *   card      the envelope drops away and the card is the only thing left
 *
 * JavaScript only advances the stage. Every piece of motion is a class from
 * tailwind.config.js, which NativeWind compiles onto Reanimated -- the flap
 * hinge, the rise, the hand-off and the settle all live there, so the
 * choreography is in one file rather than spread across components.
 */
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GiftEnvelope } from '@/components/envelope';
import { TIMING } from '@/components/envelope/envelope.tokens';
import { GIFT } from '@/components/gift-seed/gift';
import { GiftRevealCard } from '@/components/gift-seed/gift-reveal-card';
import { RadialPool } from '@/components/gift-seed/radial-pool';
import { C } from '@/components/gift-seed/theme';
import { Assurance, PrimaryButton } from '@/components/gift-seed/ui';

type Stage = 'sealed' | 'opening' | 'card';

export default function GiftScreen() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('sealed');
  const [reduceMotion, setReduceMotion] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((on) => alive && setReduceMotion(on));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const handleOpen = () => {
    if (stage !== 'sealed') return;
    setStage('opening');
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    // Under reduced motion the envelope is already open on the first frame, so
    // only the beat needed to read it is worth keeping.
    const wait = reduceMotion ? TIMING.hold : TIMING.open + TIMING.hold;
    timer.current = setTimeout(() => setStage('card'), wait);
  };

  /** Tapping during the opening skips ahead. */
  const skip = () => {
    if (stage !== 'opening') return;
    if (timer.current) clearTimeout(timer.current);
    setStage('card');
  };

  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const showCard = stage === 'card';

  return (
    <View style={s.screen}>
      <StatusBar style="light" />
      <SafeAreaView style={s.safe}>
        <View style={s.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={close}
            hitSlop={10}
            style={s.topIcon}
          >
            <Ionicons name="close" size={22} color={C.textMuted} />
          </Pressable>
          <Text style={s.wordmark}>BlinkMoney</Text>
          <View style={s.topIcon} />
        </View>

        <Pressable style={s.stage} onPress={skip}>
          {/*
            A very soft pool behind the envelope. Not a glow effect -- it
            exists so the white paper has something to sit on rather than
            floating on flat black. It brightens slightly as the card arrives,
            which is the only "light" in the whole sequence.
          */}
          <RadialPool size={showCard ? 420 : 360} opacity={showCard ? 1 : 0.8} />

          {/*
            Three states on one wrapper, never two at once: it sways while
            sealed, holds still while opening, and drops away once the card has
            arrived. It must be a wrapper, because the envelope's own layers
            are already driving their own transforms.
          */}
          <View
            className={
              showCard
                ? 'motion-ok:gift-scene-out motion-reduced:gift-scene-gone'
                : stage === 'sealed'
                  ? 'motion-ok:envelope-nudge'
                  : undefined
            }
            style={s.centred}
            pointerEvents={showCard ? 'none' : 'auto'}
          >
            <GiftEnvelope
              label="A Seed Gift for You"
              value={GIFT.amountLabel}
              caption={`Gifted by ${GIFT.sender}`}
              open={stage !== 'sealed'}
              onPress={handleOpen}
            />
          </View>

          {stage === 'sealed' ? (
            <View style={s.copy} pointerEvents="box-none">
              <Text style={s.title}>A Seed Gift for You</Text>
              <Text style={s.subtitle}>Someone believes in your tomorrow.</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Tap to open"
                onPress={handleOpen}
                style={s.cue}
              >
                <View className="motion-ok:gift-cue-pulse" style={s.cueInner}>
                  <Ionicons name="hand-left-outline" size={15} color={C.textMuted} />
                  <Text style={s.cueText}>Tap to open</Text>
                </View>
              </Pressable>
            </View>
          ) : null}

          {showCard ? (
            <ScrollView
              style={StyleSheet.absoluteFill}
              contentContainerStyle={s.cardScroll}
              showsVerticalScrollIndicator={false}
            >
              <View
                className="motion-ok:gift-card-in motion-reduced:gift-card-shown"
                style={s.cardHolder}
              >
                <GiftRevealCard
                  amount={GIFT.amountLabel}
                  message={GIFT.message}
                  sender={GIFT.sender}
                />
                <PrimaryButton
                  label="Continue"
                  onPress={() => router.push('/gift-claim')}
                  style={s.continue}
                />
              </View>
            </ScrollView>
          ) : null}
        </Pressable>

        {stage === 'sealed' ? (
          <View style={s.footer}>
            <Assurance text="Secure Transaction     ·     SEBI Registered" icon="shield-checkmark-outline" />
          </View>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg, overflow: 'hidden' },
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 46,
  },
  topIcon: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  wordmark: { color: C.greenBright, fontSize: 15, fontWeight: '700' },

  stage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centred: { position: 'absolute', alignItems: 'center' },

  // The copy sits below the envelope, which is centred and brings its own
  // height, so it is offset from the bottom rather than stacked in flow.
  copy: { position: 'absolute', bottom: '14%', alignItems: 'center', paddingHorizontal: 24 },
  title: { color: C.text, fontFamily: 'serif', fontSize: 25, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: C.textMuted, fontSize: 13.5, marginTop: 7, textAlign: 'center' },
  cue: { marginTop: 22 },
  cueInner: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  cueText: { color: C.textMuted, fontSize: 12.5, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: '600' },

  cardScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  cardHolder: { width: '100%', alignItems: 'center' },
  continue: { alignSelf: 'stretch', maxWidth: 330, marginTop: 20 },

  footer: { paddingBottom: 18, paddingHorizontal: 24 },
});
