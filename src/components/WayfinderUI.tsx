import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

export const wf = {
  background: '#F8FAF8',
  surface: '#FFFFFF',
  ink: '#1E2C2B',
  navy: '#172651',
  muted: '#667973',
  primary: '#194A41',
  blue: '#2D4BAA',
  cyan: '#4FC6E9',
  red: '#F52F35',
  border: '#DAE3DC',
  subtle: '#EEF4F0',
  map: '#F3F9FC',
  lightBlue: '#F4FAFD',
};

type BottomNavProps = { active?: 'explore' | 'map' | 'saved' | 'more' };

export function BottomNav({ active = 'explore' }: BottomNavProps) {
  const items = [
    { key: 'explore', label: 'Explore', icon: '◉', go: () => router.replace('/') },
    { key: 'map', label: 'Map', icon: '▥', go: () => router.push('/map') },
    { key: 'saved', label: 'Saved', icon: '⌑', go: undefined },
    { key: 'more', label: 'More', icon: '○', go: undefined },
  ] as const;

  return (
    <View style={styles.bottomNav}>
      {items.map((item) => {
        const selected = item.key === active;
        return (
          <Pressable
            key={item.key}
            onPress={item.go}
            style={styles.navItem}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            <Text style={[styles.navIcon, selected && styles.navActive]}>{item.icon}</Text>
            <Text style={[styles.navLabel, selected && styles.navActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function RoutePreview() {
  return (
    <View style={styles.routeCard}>
      <Text style={styles.routeLabel}>ROUTE PREVIEW · ILLUSTRATIVE</Text>
      <View style={[styles.roadH, { top: 68 }]} />
      <View style={[styles.roadH, { top: 141 }]} />
      <View style={[styles.roadV, { left: 71 }]} />
      <View style={[styles.roadV, { left: 236 }]} />
      <View style={[styles.routeH, { top: 84, left: 80, width: 166 }]} />
      <View style={[styles.routeV, { top: 84, left: 77, height: 92 }]} />
      <View style={[styles.routeV, { top: 84, left: 242, height: 64 }]} />
      <View style={[styles.routeH, { top: 145, left: 245, width: 43 }]} />
      <View style={[styles.pin, { top: 163, left: 65 }]}><Text style={styles.pinText}>1</Text></View>
      <View style={[styles.pin, { top: 71, left: 230 }]}><Text style={styles.pinText}>2</Text></View>
      <View style={[styles.pin, { top: 133, left: 273 }]}><Text style={styles.pinText}>3</Text></View>
      <Text style={styles.routeFoot}>GPS & route details appear during the tour</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 16,
    height: 74,
    borderWidth: 1,
    borderColor: wf.border,
    borderRadius: 12,
    backgroundColor: wf.surface,
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navItem: { width: 80, height: 62, alignItems: 'center', justifyContent: 'center', gap: 3 },
  navIcon: { fontSize: 26, lineHeight: 28, color: wf.primary, fontWeight: '500' },
  navLabel: { fontSize: 12, lineHeight: 16, color: wf.muted },
  navActive: { color: wf.primary },
  routeCard: {
    height: 240,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: wf.map,
    position: 'relative',
  },
  routeLabel: { position: 'absolute', left: 11, top: 11, fontSize: 12, fontWeight: '700', color: wf.muted },
  routeFoot: { position: 'absolute', left: 11, bottom: 7, fontSize: 12, color: wf.muted },
  roadH: { position: 'absolute', left: 10, right: 10, height: 18, backgroundColor: '#FFFFFF' },
  roadV: { position: 'absolute', top: 37, bottom: 27, width: 18, backgroundColor: '#FFFFFF' },
  routeH: { position: 'absolute', height: 6, borderRadius: 3, backgroundColor: wf.cyan },
  routeV: { position: 'absolute', width: 6, borderRadius: 3, backgroundColor: wf.cyan },
  pin: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: wf.cyan,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinText: { color: wf.blue, fontSize: 13, fontWeight: '700' },
});
