import React, { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav, wf } from '../src/components/WayfinderUI';

type TravelMode = 'Walk' | 'Bike' | 'Drive';

export default function Home() {
  const [mode, setMode] = useState<TravelMode>('Walk');
  const [startAddress, setStartAddress] = useState('');
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.brand}>BEDFORD  /  WAYFINDER</Text>
        <Text style={styles.title}>Historic Trails</Text>
        <Text style={styles.subtitle}>Explore Bedford one story at a time.</Text>

        <View style={styles.modeRow}>
          {(['Walk', 'Bike', 'Drive'] as const).map((item) => {
            const selected = mode === item;
            return (
              <Pressable key={item} onPress={() => setMode(item)} style={[styles.mode, selected && styles.modeSelected]}>
                <Text style={[styles.modeText, selected && styles.modeTextSelected]}>{item}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.search}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tour starting address or landmark"
            value={startAddress}
            onChangeText={setStartAddress}
            onSubmitEditing={() => router.push({ pathname: '/map', params: { start: startAddress, mode: mode.toLowerCase() } })}
            placeholderTextColor={wf.muted}
          />
        </View>

        <Pressable style={styles.createTour} onPress={() => router.push({ pathname: '/map', params: { start: startAddress, mode: mode.toLowerCase() } })}>
          <Text style={styles.createTourLabel}>Plan my 5-stop tour  →</Text>
        </Pressable>

        <Text style={styles.sectionLabel}>FEATURED TOUR</Text>
        <Pressable style={styles.trailCard} onPress={() => router.push('/tours')}>
          <View style={styles.photoPlaceholder}>
            <Text style={styles.placeholderText}>HISTORICAL PHOTO</Text>
          </View>
          <Text style={styles.cardTitle}>Revolutionary Bedford</Text>
          <Text style={styles.cardSubtitle}>Explore Bedford’s Revolutionary heritage</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>5 stops</Text></View>
            <View style={styles.badge}><Text style={styles.badgeText}>Live routing</Text></View>
          </View>
        </Pressable>

        <Text style={styles.sectionLabel}>OTHER TRAILS</Text>
        <Pressable style={styles.compactCard} onPress={() => router.push('/tours')}>
          <Text style={styles.compactText}>Historic Homes Trail</Text>
          <Text style={styles.arrow}>→</Text>
        </Pressable>
      </ScrollView>
      <BottomNav active="explore" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: wf.background },
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 116, gap: 10 },
  createTour: { backgroundColor: wf.red, borderRadius: 12, height: 48, alignItems: 'center', justifyContent: 'center' },
  createTourLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  brand: { fontSize: 12, lineHeight: 16, fontWeight: '700', color: '#42BDF0' },
  title: { fontSize: 28, lineHeight: 36, fontWeight: '700', color: wf.navy },
  subtitle: { fontSize: 14, lineHeight: 18, color: '#65749A' },
  modeRow: { flexDirection: 'row', gap: 9, height: 40 },
  mode: { flex: 1, height: 40, borderRadius: 12, borderWidth: 1, borderColor: wf.border, alignItems: 'center', justifyContent: 'center', backgroundColor: wf.surface },
  modeSelected: { backgroundColor: wf.blue, borderColor: wf.blue },
  modeText: { fontSize: 14, fontWeight: '700', color: wf.ink },
  modeTextSelected: { color: '#FFFFFF' },
  search: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: wf.border, backgroundColor: wf.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 12 },
  searchIcon: { fontSize: 28, lineHeight: 28, color: wf.primary, transform: [{ rotate: '-15deg' }] },
  searchInput: { flex: 1, fontSize: 14, color: wf.ink, paddingVertical: 0 },
  sectionLabel: { fontSize: 12, lineHeight: 16, fontWeight: '700', color: '#5E6E91' },
  trailCard: { height: 280, borderRadius: 12, borderWidth: 1, borderColor: wf.border, backgroundColor: wf.surface, padding: 12, gap: 10 },
  photoPlaceholder: { height: 122, borderRadius: 10, backgroundColor: wf.lightBlue, justifyContent: 'center', paddingHorizontal: 18 },
  placeholderText: { fontSize: 12, color: wf.muted },
  cardTitle: { fontSize: 20, lineHeight: 26, fontWeight: '700', color: wf.ink },
  cardSubtitle: { fontSize: 12, lineHeight: 16, color: wf.muted },
  badgeRow: { flexDirection: 'row', gap: 8 },
  badge: { width: 100, height: 30, borderRadius: 12, backgroundColor: wf.lightBlue, justifyContent: 'center', paddingHorizontal: 10 },
  badgeText: { fontSize: 12, color: wf.ink },
  compactCard: { height: 53, borderRadius: 12, backgroundColor: wf.lightBlue, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
  compactText: { fontSize: 15, fontWeight: '700', color: wf.navy },
  arrow: { fontSize: 22, fontWeight: '700', color: wf.navy, marginRight: 83 },
});
