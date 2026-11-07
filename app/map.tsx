import React, { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, GeoJSONSource, Layer, Map, Marker } from '@maplibre/maplibre-react-native';
import type { CameraRef } from '@maplibre/maplibre-react-native';
import { BottomNav, wf } from '../src/components/WayfinderUI';
import { TOUR_SITES } from '../src/data/tourSites';
import { useTour } from '../src/context/TourContext';
import type { DirectionsMode } from '../src/services/demoTour';

const styleUrl = process.env.EXPO_PUBLIC_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/liberty';

export default function ExploreMap() {
  const { start, mode: requestedMode } = useLocalSearchParams<{ start?: string; mode?: string }>();
  const { sites, plan, busy, progress, error, createTour } = useTour();
  const [address, setAddress] = useState(typeof start === 'string' ? start : '');
  const [mode, setMode] = useState<DirectionsMode>(requestedMode === 'cycling' || requestedMode === 'bike' ? 'cycling' : requestedMode === 'driving' || requestedMode === 'drive' ? 'driving' : 'walking');
  const camera = useRef<CameraRef>(null);

  useEffect(() => {
    const points = plan?.coordinates ?? sites.map((s) => s.coordinate);
    if (points.length < 2) return;
    const lons = points.map((p) => p[0]);
    const lats = points.map((p) => p[1]);
    const timer = setTimeout(() => {
      camera.current?.fitBounds(
        [Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)],
        { duration: 550, padding: { top: 110, bottom: 250, left: 42, right: 42 } },
      );
    }, 550);
    return () => clearTimeout(timer);
  }, [plan, sites]);

  const geometry = plan ? {
    type: 'Feature' as const,
    properties: {},
    geometry: { type: 'LineString' as const, coordinates: plan.coordinates },
  } : null;

  async function generate(useGps: boolean) {
    const ok = await createTour(address, mode, useGps);
    // Errors are exposed by the tour provider.
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom', 'left', 'right']}>
      <Map style={StyleSheet.absoluteFill} mapStyle={styleUrl}>
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
              onPress={() => router.push({ pathname: '/site/[id]', params: { id: site.id } })}>
              <View style={styles.sitePin}><Text style={styles.pinText}>{index}</Text></View>
            </Marker>
          );
        })}
      </Map>

      <View style={styles.topPanel}>
        <Text style={styles.kicker}>BEDFORD  /  WAYFINDER</Text>
        <Text style={styles.title}>Map & historic tour</Text>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Starting address in Bedford, MA"
            placeholderTextColor={wf.muted}
            autoCapitalize="words"
            accessibilityLabel="Tour starting address"
          />
          <Pressable style={styles.gps} onPress={() => void generate(true)} disabled={busy} accessibilityRole="button">
            <Text style={styles.gpsText}>My location</Text>
          </Pressable>
        </View>
        <View style={styles.modeRow}>
          {(['walking', 'cycling', 'driving'] as const).map((value) => (
            <Pressable key={value} style={[styles.mode, mode === value && styles.modeActive]} onPress={() => setMode(value)}>
              <Text style={[styles.modeText, mode === value && styles.modeActiveText]}>
                {value === 'walking' ? 'Walk' : value === 'cycling' ? 'Bike' : 'Drive'}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable style={[styles.cta, busy && styles.disabled]} disabled={busy} onPress={() => void generate(false)}>
          {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.ctaText}>Create my 5-stop tour  →</Text>}
        </Pressable>
        {busy && <Text style={styles.helper}>{progress}</Text>}
        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>

      <View style={styles.bottomPanel}>
        {plan ? (
          <>
            <Text style={styles.panelTitle}>Your tour · 5 stops</Text>
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
            <Text style={styles.panelTitle}>5 real Bedford historical places</Text>
            <Text style={styles.panelSubtitle}>The five landmark markers load immediately without GPS permission. Choose your location to plan a route.</Text>
          </>
        )}
      </View>
      <BottomNav active="map" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: wf.background },
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
