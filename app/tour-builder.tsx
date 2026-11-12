import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { BottomNav, wf } from '../src/components/WayfinderUI';
import { useTour } from '../src/context/TourContext';
import type { DirectionsMode } from '../src/services/demoTour';
import { MassachusettsAddressAutocomplete, type MassachusettsAddress } from '../src/components/atoms/MassachusettsAddressAutocomplete';

export default function TourBuilder() {
  const { start, mode: requestedMode, preset } = useLocalSearchParams<{ start?: string; mode?: string; preset?: string }>();
  const { sites, createTour, busy, progress, error } = useTour();
  const [selected, setSelected] = useState<string[]>(preset === 'all' ? sites.map(site => site.id) : []);
  const [address, setAddress] = useState(typeof start === 'string' ? start : '');
  const [selectedOrigin, setSelectedOrigin] = useState<MassachusettsAddress | null>(null);
  const [mode, setMode] = useState<DirectionsMode>(
    requestedMode === 'bike' || requestedMode === 'cycling' ? 'cycling' :
    requestedMode === 'drive' || requestedMode === 'driving' ? 'driving' : 'walking'
  );

  const allSelected = sites.length > 0 && selected.length === sites.length;
  function toggle(id: string) {
    setSelected(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id]);
  }

  async function startTour(useGps: boolean) {
    const ok = await createTour(address, mode, useGps, selected, selectedOrigin?.coordinates);
    if (ok) router.push('/demo-tour');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Text style={styles.back}>‹  Back</Text>
        </Pressable>
        <Text style={styles.brand}>BEDFORD  /  WAYFINDER</Text>
        <Text style={styles.title}>Build Your Guided Tour</Text>
        <Text style={styles.subtitle}>Select the places you’d like to explore. Your route will be built around your choices.</Text>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>CHOOSE HISTORICAL PLACES</Text>
          <Pressable onPress={() => setSelected(allSelected ? [] : sites.map(site => site.id))} accessibilityRole="button">
            <Text style={styles.link}>{allSelected ? 'Clear all' : 'Select all'}</Text>
          </Pressable>
        </View>

        {sites.map(site => {
          const checked = selected.includes(site.id);
          return (
            <Pressable key={site.id} style={[styles.siteCard, checked && styles.selectedCard]}
              onPress={() => toggle(site.id)} accessibilityRole="checkbox" accessibilityState={{ checked }}>
              <Image source={{ uri: site.photoUrl }} style={styles.photo} resizeMode="cover" accessibilityLabel={'Photo of ' + site.name} />
              <View style={styles.siteCopy}>
                <Text style={styles.siteTitle}>{site.name}</Text>
                <Text numberOfLines={2} style={styles.siteDescription}>{site.description}</Text>
                <Text style={styles.mediaLabel}>Photo · History · Audio</Text>
              </View>
              <Ionicons name={checked ? 'checkbox' : 'square-outline'} size={24} color={checked ? wf.blue : wf.muted} />
            </Pressable>
          );
        })}
        <Text style={styles.count}>{selected.length} {selected.length === 1 ? 'place' : 'places'} selected</Text>

        <Text style={styles.sectionTitle}>TRAVEL MODE</Text>
        <View style={styles.modeRow}>
          {(['walking','cycling','driving'] as const).map(value => (
            <Pressable key={value} style={[styles.mode, value === mode && styles.activeMode]} onPress={() => setMode(value)}>
              <Text style={[styles.modeText, value === mode && styles.activeModeText]}>
                {value === 'walking' ? 'Walk' : value === 'cycling' ? 'Bike' : 'Drive'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>STARTING LOCATION</Text>
        <MassachusettsAddressAutocomplete
          value={address}
          onChangeText={(text) => { setAddress(text); setSelectedOrigin(null); }}
          onSelect={(choice) => { setAddress(choice.label); setSelectedOrigin(choice); }}
          selected={selectedOrigin !== null}
        />

        <Pressable disabled={busy || selected.length === 0 || !selectedOrigin} style={[styles.cta, (busy || selected.length === 0 || !selectedOrigin) && styles.disabled]}
          onPress={() => void startTour(false)}>
          {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.ctaText}>Start My Guided Tour  →</Text>}
        </Pressable>

        <Pressable disabled={busy || selected.length === 0} style={[styles.gps, (busy || selected.length === 0) && styles.disabled]}
          onPress={() => void startTour(true)}>
          <Ionicons name="locate-outline" size={19} color={wf.blue} />
          <Text style={styles.gpsText}>Or start from my current location</Text>
        </Pressable>
        {busy && <Text style={styles.note}>{progress}</Text>}
        {!!error && <Text style={styles.error}>{error}</Text>}
        <Text style={styles.note}>Select one or more places. You can add more locations as the Wayfinder collection grows. The location search is limited to Massachusetts. GPS is requested only if you choose your current location.</Text>
      </ScrollView>
      <BottomNav active="explore" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: wf.background },
  content: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 116, gap: 12 },
  back: { color: wf.blue, fontSize: 13, marginBottom: 5 },
  brand: { color: wf.cyan, fontSize: 12, fontWeight: '700', letterSpacing: 0.4 },
  title: { color: wf.navy, fontSize: 28, lineHeight: 36, fontWeight: '700' },
  subtitle: { color: wf.muted, fontSize: 14, lineHeight: 20 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  sectionTitle: { color: '#5E6E91', fontSize: 12, fontWeight: '700', letterSpacing: 0.4, marginTop: 8 },
  link: { color: wf.blue, fontSize: 13, fontWeight: '700' },
  siteCard: { borderRadius: 12, borderWidth: 1, borderColor: wf.border, backgroundColor: wf.surface, flexDirection: 'row', gap: 11, alignItems: 'center', padding: 10 },
  selectedCard: { borderColor: wf.blue, backgroundColor: wf.lightBlue },
  photo: { width: 72, height: 70, borderRadius: 9, backgroundColor: wf.lightBlue },
  siteCopy: { flex: 1, gap: 4 },
  siteTitle: { color: wf.navy, fontSize: 15, fontWeight: '700' },
  siteDescription: { color: wf.muted, fontSize: 12, lineHeight: 16 },
  mediaLabel: { color: wf.blue, fontSize: 11 },
  count: { color: wf.muted, fontSize: 13 },
  modeRow: { flexDirection: 'row', gap: 9, height: 42 },
  mode: { flex: 1, borderRadius: 12, borderColor: wf.border, borderWidth: 1, backgroundColor: wf.surface, alignItems: 'center', justifyContent: 'center' },
  activeMode: { borderColor: wf.blue, backgroundColor: wf.blue },
  modeText: { color: wf.ink, fontSize: 14, fontWeight: '700' },
  activeModeText: { color: '#FFFFFF' },
  input: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: wf.border, backgroundColor: wf.surface, paddingHorizontal: 14, color: wf.ink, fontSize: 14 },
  cta: { minHeight: 48, backgroundColor: wf.red, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  ctaText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  disabled: { opacity: 0.5 },
  gps: { borderRadius: 12, backgroundColor: wf.lightBlue, minHeight: 46, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  gpsText: { color: wf.blue, fontWeight: '700', fontSize: 13 },
  note: { color: wf.muted, fontSize: 12, lineHeight: 18 },
  error: { color: '#A82B32', fontSize: 13, lineHeight: 18 },
});
