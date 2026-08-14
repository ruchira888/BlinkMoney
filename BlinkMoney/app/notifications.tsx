import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Notification = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  when: string;
  /** Gift notifications reveal the envelope when tapped. */
  gift?: { value: string; caption: string };
};

const NOTIFICATIONS: Notification[] = [
  {
    id: 'gift-1',
    icon: 'gift-outline',
    title: 'You received a Seed Gift',
    body: 'Riya sent you a gift. Tap to open it.',
    when: 'Just now',
    gift: { value: '₹101', caption: 'A daily SIP has been started for you.' },
  },
  {
    id: 'sip-1',
    icon: 'trending-up-outline',
    title: 'Your SIP ran today',
    body: '₹100 invested across stocks, FD and gold.',
    when: '2h ago',
  },
  {
    id: 'kyc-1',
    icon: 'shield-checkmark-outline',
    title: 'KYC verified',
    body: 'Your account is fully active.',
    when: 'Yesterday',
  },
];

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#c6d0c4" />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {NOTIFICATIONS.map((item) =>
          item.gift ? (
            <GiftNotification key={item.id} item={item} />
          ) : (
            <PlainNotification key={item.id} item={item} />
          ),
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * A notification carrying a gift. Tapping it hands the whole screen over to
 * the gift scene, rather than expanding inline -- the envelope, the confetti
 * and the certificate are the moment, and a notification row is too small a
 * frame for it.
 */
function GiftNotification({ item }: { item: Notification }) {
  const router = useRouter();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.title}
      accessibilityHint="Opens your gift"
      onPress={() => router.push('/gift')}
      style={[styles.card, styles.giftCard]}
    >
      <View style={styles.cardRow}>
        <View style={[styles.iconCircle, styles.giftIconCircle]}>
          <Ionicons name={item.icon} size={22} color="#9ad584" />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardBody}>{item.body}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#6f7a6e" />
      </View>
    </Pressable>
  );
}

function PlainNotification({ item }: { item: Notification }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <View style={styles.iconCircle}>
          <Ionicons name={item.icon} size={22} color="#c6d0c4" />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardBody}>{item.body}</Text>
        </View>
        <Text style={styles.when}>{item.when}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#080b08' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#101711',
    borderWidth: 1,
    borderColor: '#254024',
  },
  headerTitle: { color: '#e5e7e4', fontSize: 22, fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingBottom: 32, gap: 12 },
  card: {
    borderRadius: 18,
    backgroundColor: '#0f150f',
    borderWidth: 1,
    borderColor: '#1d271d',
    overflow: 'hidden',
  },
  giftCard: { borderColor: '#2f5b2c' },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#141c14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftIconCircle: { backgroundColor: '#123010' },
  cardText: { flex: 1, gap: 3 },
  cardTitle: { color: '#e2e6e0', fontSize: 15, fontWeight: '700' },
  cardBody: { color: '#a4ada2', fontSize: 13, lineHeight: 18 },
  when: { color: '#6f7a6e', fontSize: 11 },
});
