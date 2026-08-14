import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
// React Native's own SafeAreaView is iOS-only -- on Android it renders as a
// plain View, so with edge-to-edge on (app.json) the header sits under the
// status bar and the nav bar covers the tab bar. This one applies real insets
// on both platforms; ExpoRoot already mounts its provider.
import { SafeAreaView } from 'react-native-safe-area-context';

type Frequency = 'Daily' | 'Monthly';
type Duration = '1 Year' | '5 Year' | '10 Year';

const periods: Duration[] = ['1 Year', '5 Year', '10 Year'];

export default function HomeScreen() {
  const router = useRouter();
  const [frequency, setFrequency] = useState<Frequency>('Daily');
  const [duration, setDuration] = useState<Duration>('1 Year');

  const projectedValue = useMemo(() => {
    const values: Record<Frequency, Record<Duration, string>> = {
      Daily: { '1 Year': '₹39,186', '5 Year': '₹2,35,116', '10 Year': '₹5,88,914' },
      Monthly: { '1 Year': '₹1,256', '5 Year': '₹7,536', '10 Year': '₹18,845' },
    };
    return values[frequency][duration];
  }, [frequency, duration]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* No backgroundColor: Android edge-to-edge (app.json) ignores it and
          warns. The status bar sits over the SafeAreaView's own inset, which is
          already this colour. */}
      <StatusBar style="light" />
      <View style={styles.page}>
        <View style={styles.header}>
          <View style={styles.greeting}>
            <View style={styles.profileCircle}>
              <Ionicons name="person-outline" size={27} color="#c6d0c4" />
            </View>
            <Text style={styles.greetingText}>Hello Ruchira{`\n`}Welcome!</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              onPress={() => router.push('/notifications')}
              style={styles.bellButton}
            >
              <Ionicons name="notifications-outline" size={25} color="#c6d0c4" />
              <View style={styles.notificationDot} />
            </Pressable>
            <Pressable accessibilityRole="button" style={styles.helpButton}>
              <Ionicons name="logo-whatsapp" size={25} color="#9ad584" />
              <Text style={styles.helpText}>Help</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.bannerViewport}>
          <View style={styles.banner}>
            <View style={styles.bannerGlow} />
            <Text style={styles.bannerTitle}>Stocks + FD + Gold –</Text>
            <Text style={styles.bannerItalic}>all in one click SIP</Text>
            <View style={styles.bannerRule} />
            <View style={styles.bannerBodyRow}>
              <Text style={styles.bannerBody}>No fund picking. No research.{`\n`}BlinkMoney allocates across multiple{`\n`}asset classes automatically.</Text>
              <View>
                <Text style={styles.returnValue}>~15%</Text>
                <Text style={styles.returnLabel}>p.a. returns*</Text>
              </View>
            </View>
            <View style={styles.badges}>
              <Badge label="AMFI registered" />
              <Badge label="Start at ₹21/day" />
              <Badge label="Daily compounding" />
            </View>
            <Text style={styles.terms}>*T&C apply</Text>
          </View>
        </View>

        <View style={styles.dots}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} /><View style={styles.dot} /><View style={styles.dot} />
        </View>

        <Pressable style={styles.startButton}>
          <Text style={styles.startButtonText}>Start SIP</Text>
        </Pressable>

        <Text style={styles.calculatorTitle}>SIP Calculator</Text>
        <View style={styles.calculator}>
          <View style={styles.resultPanel}>
            <Text style={styles.resultPrompt}><Text style={styles.highlight}>₹100</Text> {frequency.toLowerCase()} for {duration.toLowerCase()} could grow to</Text>
            <Text style={styles.resultValue}>{projectedValue}</Text>
          </View>
          <View style={styles.sliderArea}>
            <View style={styles.sliderTrack}><View style={styles.sliderFill} /></View>
            <View style={styles.sliderKnob} />
          </View>
          <View style={styles.segmented}>
            {(['Daily', 'Monthly'] as Frequency[]).map((item) => (
              <Pressable key={item} onPress={() => setFrequency(item)} style={[styles.segment, frequency === item && styles.segmentSelected]}>
                <Text style={styles.segmentText}>{item}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.segmented}>
            {periods.map((item) => (
              <Pressable key={item} onPress={() => setDuration(item)} style={[styles.period, duration === item && styles.periodSelected]}>
                <Text style={styles.segmentText}>{item}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable><Text style={styles.calculated}>how it is calculated?</Text></Pressable>
        </View>

        <View style={styles.bottomNav}>
          <NavItem icon="home-outline" label="Home" active />
          <NavItem icon="cube-outline" label="Save" />
          <NavItem icon="currency-inr" label="Borrow" material />
          <NavItem icon="gift-outline" label="Rewards" onPress={() => router.push('/rewards')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function Badge({ label }: { label: string }) {
  return <View style={styles.badge}><Text style={styles.badgeText}>{label}</Text></View>;
}

function NavItem({ icon, label, active, material, onPress }: { icon: string; label: string; active?: boolean; material?: boolean; onPress?: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={[styles.navItem, active && styles.navActive]}>
    {material ? <MaterialCommunityIcons name={icon as never} size={27} color="#c3c9c1" /> : <Ionicons name={icon as never} size={26} color="#c3c9c1" />}
    <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
  </Pressable>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#080b08' }, page: { flex: 1, paddingHorizontal: 26, paddingTop: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, greeting: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profileCircle: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#00460b', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#075a10' },
  greetingText: { color: '#d3d6d2', fontSize: 20, lineHeight: 26, fontWeight: '500' }, headerActions: { flexDirection: 'row', alignItems: 'center', gap: 11 }, bellButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#101711', borderWidth: 1, borderColor: '#254024', alignItems: 'center', justifyContent: 'center' }, notificationDot: { position: 'absolute', top: 10, right: 11, width: 7, height: 7, borderRadius: 4, backgroundColor: '#81c75c', borderWidth: 1, borderColor: '#101711' }, helpButton: { height: 56, paddingHorizontal: 18, borderRadius: 30, backgroundColor: '#00500c', flexDirection: 'row', gap: 7, alignItems: 'center' }, helpText: { fontSize: 19, fontWeight: '700', color: '#9acf86' },
  bannerViewport: { marginTop: 24, height: 338, overflow: 'hidden', borderRadius: 17 }, banner: { flex: 1, backgroundColor: '#0b120a', padding: 34, overflow: 'hidden' }, bannerGlow: { position: 'absolute', width: 310, height: 270, right: -65, top: -80, borderRadius: 180, backgroundColor: '#13310b', opacity: .66 },
  bannerTitle: { color: '#e1e5dc', fontFamily: 'serif', fontSize: 30, fontWeight: '700' }, bannerItalic: { color: '#a9d27b', fontFamily: 'serif', fontSize: 31, fontWeight: '700', fontStyle: 'italic', marginTop: 1 }, bannerRule: { height: 1, backgroundColor: '#2a3428', marginTop: 18, marginBottom: 18 },
  bannerBodyRow: { flexDirection: 'row', justifyContent: 'space-between' }, bannerBody: { color: '#d0d3cf', fontSize: 18, lineHeight: 29, flex: 1 }, returnValue: { color: '#86c957', fontFamily: 'serif', fontSize: 55, fontWeight: '700', lineHeight: 61 }, returnLabel: { color: '#a9d27b', fontFamily: 'serif', fontSize: 21, fontWeight: '700', textAlign: 'center' },
  badges: { flexDirection: 'row', gap: 7, marginTop: 25 }, badge: { borderWidth: 1, borderColor: '#3a6631', borderRadius: 16, paddingHorizontal: 9, paddingVertical: 6 }, badgeText: { fontSize: 11, color: '#a6c886' }, terms: { color: '#a1a59f', fontSize: 9, alignSelf: 'flex-end', marginTop: -11 },
  dots: { height: 38, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 9 }, dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#172017' }, activeDot: { width: 36, backgroundColor: '#313c30' },
  startButton: { height: 93, backgroundColor: '#00560b', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }, startButtonText: { color: '#8ac27c', fontWeight: '700', fontSize: 24 }, calculatorTitle: { color: '#e5e7e4', fontWeight: '700', fontSize: 27, marginTop: 38, marginBottom: 14 },
  calculator: { height: 593, borderRadius: 27, backgroundColor: '#111711', padding: 28 }, resultPanel: { height: 174, borderRadius: 20, backgroundColor: '#090d09', borderWidth: 1, borderColor: '#1c231d', alignItems: 'center', paddingTop: 34 }, resultPrompt: { fontSize: 18, color: '#d6d7d5', textAlign: 'center' }, highlight: { color: '#7cc45c' }, resultValue: { color: '#70be4f', fontSize: 48, fontWeight: '800', marginTop: 27 },
  sliderArea: { height: 108, justifyContent: 'center' }, sliderTrack: { height: 14, borderRadius: 8, backgroundColor: '#2a3928' }, sliderFill: { height: 14, borderRadius: 8, width: '100%', backgroundColor: '#4a6347', opacity: .55 }, sliderKnob: { position: 'absolute', left: -5, width: 39, height: 39, borderRadius: 20, backgroundColor: '#080b08', borderWidth: 1, borderColor: '#1d251d' },
  segmented: { height: 64, borderRadius: 14, flexDirection: 'row', backgroundColor: '#090d09', marginBottom: 38 }, segment: { flex: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }, segmentSelected: { borderWidth: 2, borderColor: '#006f12' }, period: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 14 }, periodSelected: { borderWidth: 2, borderColor: '#006f12' }, segmentText: { color: '#d6d7d6', fontSize: 18, fontWeight: '600' }, calculated: { color: '#89c565', fontSize: 17, fontWeight: '600', textDecorationLine: 'underline', textAlign: 'center', marginTop: 5 },
  bottomNav: { height: 56, borderRadius: 30, borderWidth: 2, borderColor: '#076416', backgroundColor: '#080b08', marginTop: 'auto', marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 3 }, navItem: { height: 48, flex: 1, borderRadius: 25, alignItems: 'center', justifyContent: 'center', gap: 0 }, navActive: { backgroundColor: '#005e10' }, navText: { color: '#b9beb8', fontSize: 10, lineHeight: 13 }, navTextActive: { color: '#d4dfd0', fontWeight: '700' },
});
