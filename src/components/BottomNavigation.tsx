import React from 'react';
import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tabs = [
  { title: 'Explore', icon: '◈', href: '/' },
  { title: 'Map', icon: '⌖', href: '/map' },
  { title: 'Saved', icon: '▱', href: '/saved' },
  { title: 'More', icon: '⋯', href: '/more' },
] as const;

export function BottomNavigation() {
  const path = usePathname();
  const insets = useSafeAreaInsets();
  const active = path === '/demo-tour' || path === '/tours' || path.startsWith('/site/') ? '/' : path;
  return <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]} accessibilityRole="tablist">
    {tabs.map(tab => {
      const selected = active === tab.href;
      return <Pressable key={tab.title}
        onPress={() => { if (!selected || path !== tab.href) router.replace(tab.href); }}
        accessibilityRole="tab"
        accessibilityLabel={tab.title}
        accessibilityState={{ selected }}
        style={styles.tab}>
        <Text style={[styles.icon, selected && styles.selected]}>{tab.icon}</Text>
        <Text style={[styles.text, selected && styles.selected]}>{tab.title}</Text>
      </Pressable>;
    })}
  </View>;
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', backgroundColor: '#fff', paddingTop: 8, paddingHorizontal: 14, borderTopWidth: 1, borderColor: '#DAE3DC' },
  tab: { flex: 1, minHeight: 55, alignItems: 'center', justifyContent: 'center', gap: 3, borderRadius: 12 },
  icon: { fontSize: 23, color: '#667973', lineHeight: 27 },
  text: { fontSize: 12, fontWeight: '600', color: '#667973' },
  selected: { color: '#194A41', fontWeight: '700' },
});
