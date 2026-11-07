import React, { useCallback, useEffect, useRef, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { Camera, GeoJSONSource, Layer, Map, Marker } from '@maplibre/maplibre-react-native';
import type { CameraRef } from '@maplibre/maplibre-react-native';
import { BottomNav, wf } from '../src/components/WayfinderUI';
import { TOUR_SITES } from '../src/data/tourSites';
import { useTour } from '../src/context/TourContext';
import { HistoricPointSheet } from '../src/components/molecules/HistoricPointSheet';

const styleUrl = process.env.EXPO_PUBLIC_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/liberty';

export default function ExploreMap() {
  const { sites, plan } = useTour();
  const insets = useSafeAreaInsets();
  const camera = useRef<CameraRef>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [styleReady, setStyleReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const selectedSite = sites.find(site => site.id === selectedId);

  // Expo Router keeps earlier stack screens mounted. Release the native renderer
  // when moving from Map to the builder/detail pages instead of rendering behind them.
  useFocusEffect(useCallback(() => {
    setIsFocused(true);
    return () => {
      setIsFocused(false);
      setStyleReady(false);
      void Speech.stop();
    };
  }, []));

  async function closePreview() {
    await Speech.stop();
    setPlaying(false);
    setSelectedId(null);
  }

  async function openPreview(id: string) {
    await Speech.stop();
    setPlaying(false);
    setSelectedId(id);
  }

  async function toggleNarration() {
    if (!selectedSite) return;
    await Speech.stop();
    if (playing) { setPlaying(false); return; }
    setPlaying(true);
    Speech.speak(selectedSite.narration, {
      language: 'en-US', rate: 0.9,
      onDone: () => setPlaying(false),
      onStopped: () => setPlaying(false),
      onError: () => setPlaying(false),
    });
  }

  async function showDetails() {
    if (!selectedSite) return;
    const siteId = selectedSite.id;
    await Speech.stop();
    setPlaying(false);
    router.push({ pathname: '/site/[id]', params: { id: siteId } });
  }

  useEffect(() => {
    if (!isFocused || !styleReady) return;
    const points = plan?.coordinates ?? sites.map(site => site.coordinate);
    if (points.length < 2) return;
    const lons = points.map(point => point[0]);
    const lats = points.map(point => point[1]);
    // Camera operations must wait for MapLibre's style, not a fixed timeout.
    camera.current?.fitBounds(
      [Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)],
      { duration: 550, padding: { top: 190, bottom: 310, left: 42, right: 42 } },
    );
  }, [isFocused, styleReady, plan, sites]);

  const geometry = plan ? {
    type: 'Feature' as const,
    properties: {},
    geometry: { type: 'LineString' as const, coordinates: plan.coordinates },
  } : null;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom', 'left', 'right']}>
      {isFocused && <Map
        style={StyleSheet.absoluteFill}
        mapStyle={styleUrl}
        androidView="texture"
        onDidFinishLoadingStyle={() => { setStyleReady(true); setMapError(false); }}
        onDidFailLoadingMap={() => { setStyleReady(false); setMapError(true); }}
      >
        <Camera ref={camera} initialViewState={{ center: [-71.276, 42.4906], zoom: 12.7 }} />
        {geometry && (
          <GeoJSONSource id="historic-tour-route" data={geometry}>
            <Layer id="historic-tour-line" source="historic-tour-route" type="line"
              paint={{ 'line-color': wf.blue, 'line-width': 5, 'line-opacity': 0.9 }} />
          </GeoJSONSource>
        )}
        {plan && (
          <Marker id="tour-origin" lngLat={plan.start}>
            <View style={styles.originPin}><Text style={styles.pinText}>S</Text></View>
          </Marker>
        )}
        {sites.map((site) => {
          const position = plan?.legs.findIndex((leg) => leg.destination.id === site.id) ?? -1;
          const index = position >= 0 ? position + 1 : TOUR_SITES.findIndex((s) => s.id === site.id) + 1;
          return (
            <Marker key={site.id} id={'historic-' + site.id} lngLat={site.coordinate}
              onPress={() => { void openPreview(site.id); }}>
              <View style={styles.sitePin}><Text style={styles.pinText}>{index}</Text></View>
            </Marker>
          );
        })}
      </Map>}

      {mapError && <View style={styles.mapError}><Text style={styles.error}>The map style could not load. Check your connection and reopen Map.</Text></View>}

      <View style={[styles.topPanel, { top: insets.top + 12 }]}>
        <Text style={styles.kicker}>BEDFORD  /  WAYFINDER</Text>
        <Text style={styles.title}>Explore Historic Bedford</Text>
        <Text style={styles.helper}>Tap a marker to discover a place, or choose your own stops for a guided tour.</Text>
        <Pressable style={styles.cta} onPress={() => router.push('/tour-builder')} accessibilityRole="button">
          <Text style={styles.ctaText}>Start My Guided Tour  →</Text>
        </Pressable>
      </View>

      {!selectedSite && <View style={styles.bottomPanel}>
        {plan ? (
          <>
            <Text style={styles.panelTitle}>Your tour · {plan.legs.length} stops</Text>
            <Text style={styles.panelSubtitle}>
              {plan.startLabel} · {(plan.distanceKm * 0.621371).toFixed(1)} mi · about {Math.round(plan.durationSeconds / 60)} min travel
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stopList}>
              {plan.legs.map((leg, i) => (
                <Pressable key={leg.destination.id} style={styles.stopChip} onPress={() => router.push({ pathname: '/site/[id]', params: { id: leg.destination.id } })}>
                  <Text style={styles.stopChipText}>{i + 1}. {leg.destination.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable style={styles.cta} onPress={() => router.push('/demo-tour')}>
              <Text style={styles.ctaText}>Start in-app directions  →</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.panelTitle}>Historic places to discover</Text>
            <Text style={styles.panelSubtitle}>Explore the available landmarks, then create a personalized tour with the places you choose.</Text>
          </>
        )}
      </View>}
      {selectedSite && (
        <HistoricPointSheet
          key={selectedSite.id}
          site={selectedSite}
          playing={playing}
          onToggleAudio={() => { void toggleNarration(); }}
          onInfo={() => { void showDetails(); }}
          onClose={() => { void closePreview(); }}
        />
      )}
      <BottomNav active="map" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: wf.background },
  mapError: { position: 'absolute', top: '48%', left: 20, right: 20, backgroundColor: wf.surface, borderRadius: 12, padding: 14 },
  topPanel: { position: 'absolute', top: 12, left: 16, right: 16, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: wf.border, backgroundColor: wf.surface, gap: 9 },
  kicker: { fontSize: 12, fontWeight: '700', color: wf.primary },
  title: { fontSize: 23, fontWeight: '700', color: wf.navy },
  searchRow: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, minWidth: 0, borderWidth: 1, borderColor: wf.border, borderRadius: 12, height: 44, paddingHorizontal: 10, color: wf.ink, fontSize: 13 },
  gps: { borderRadius: 12, backgroundColor: wf.lightBlue, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 },
  gpsText: { color: wf.blue, fontSize: 12, fontWeight: '700' },
  modeRow: { flexDirection: 'row', gap: 8 },
  mode: { flex: 1, height: 34, borderWidth: 1, borderColor: wf.border, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  modeActive: { backgroundColor: wf.blue, borderColor: wf.blue },
  modeText: { color: wf.ink, fontSize: 13, fontWeight: '700' },
  modeActiveText: { color: '#FFFFFF' },
  cta: { backgroundColor: wf.red, borderRadius: 12, minHeight: 46, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.7 },
  ctaText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  helper: { color: wf.muted, fontSize: 12 },
  error: { color: '#A82B32', fontSize: 12, lineHeight: 18 },
  bottomPanel: { position: 'absolute', bottom: 107, left: 16, right: 16, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: wf.border, backgroundColor: wf.surface, gap: 8 },
  panelTitle: { color: wf.navy, fontSize: 15, fontWeight: '700' },
  panelSubtitle: { color: wf.muted, fontSize: 12, lineHeight: 17 },
  stopList: { gap: 7, paddingVertical: 3 },
  stopChip: { borderRadius: 9, backgroundColor: wf.lightBlue, paddingHorizontal: 10, paddingVertical: 7 },
  stopChipText: { color: wf.navy, fontSize: 12 },
  originPin: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: '#FFFFFF', backgroundColor: wf.primary, alignItems: 'center', justifyContent: 'center' },
  sitePin: { width: 34, height: 34, borderRadius: 12, borderWidth: 2, borderColor: '#FFFFFF', backgroundColor: wf.red, alignItems: 'center', justifyContent: 'center' },
  pinText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
