/**
 * The app's bottom navigation, unchanged in appearance from the home screen:
 * black bar, muted icons, a dark green pill on the active item.
 */
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { C } from './theme';

type Tab = 'Home' | 'Save' | 'Borrow' | 'Rewards';

const TABS: { label: Tab; icon: string; material?: boolean; href: string }[] = [
  { label: 'Home', icon: 'home-outline', href: '/' },
  { label: 'Save', icon: 'cube-outline', href: '/' },
  { label: 'Borrow', icon: 'currency-inr', material: true, href: '/' },
  { label: 'Rewards', icon: 'gift-outline', href: '/rewards' },
];

export function BottomNav({ active }: { active: Tab }) {
  return (
    <View style={s.bar}>
      {TABS.map((t) => {
        const on = t.label === active;
        return (
          <Pressable
            key={t.label}
            accessibilityRole="button"
            accessibilityLabel={t.label}
            accessibilityState={{ selected: on }}
            onPress={() => router.replace(t.href as never)}
            style={[s.item, on && s.itemActive]}
          >
            {t.material ? (
              <MaterialCommunityIcons
                name={t.icon as never}
                size={22}
                color={on ? C.text : C.textMuted}
              />
            ) : (
              <Ionicons name={t.icon as never} size={21} color={on ? C.text : C.textMuted} />
            )}
            <Text style={[s.label, on && s.labelActive]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    height: 56,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: C.green,
    backgroundColor: C.bg,
    marginHorizontal: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 3,
  },
  item: {
    height: 46,
    flex: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemActive: { backgroundColor: C.green },
  label: { color: C.textMuted, fontSize: 9.5, lineHeight: 13 },
  labelActive: { color: C.text, fontWeight: '700' },
});
