import React, { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, GeoJSONSource, Layer, Map, Marker } from '@maplibre/maplibre-react-native';
import type { CameraRef } from '@maplibre/maplibre-react-native';
import { BottomNav, wf } from '../src/components/WayfinderUI';
import { useTour } from '../src/context/TourContext';

const styleUrl = process.env.EXPO_PUBLIC_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/liberty';

export default function DemoTour() {
  const { plan } = useTour();
  const [paused, setPaused] = useState(false);
  const [stopIndex, setStopIndex] = useState(0);
  const [directionIndex, setDirectionIndex] = useState(0);
  const camera = useRef<CameraRef>(null);

  useEffect(() => {
    if (!plan) return;
    const timer = setTimeout(() => {
      const points = plan.coordinates;
      const lons = points.map((p) => p[0]);
      const lats = points.map((p) => p[1]);
      camera.current?.fitBounds(
        [Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)],
        { duration: 500, padding: { top: 40, bottom: 50, left: 35, right: 35 } }
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [plan]);

  if (!plan) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.empty}>
          <Text style={styles.title}>Create your tour first</Text>
          <Text style={styles.note}>Choose your location or a starting address on the map to generate directions to all five sites.</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.replace('/map')}>
            <Text style={styles.primaryText}>Open interactive map  →</Text>
          </Pressable>
        </View>
        <BottomNav active="map" />
      </SafeAreaView>
    );
  }

  const leg = plan.legs[stopIndex];
  const direction = leg.route.steps[directionIndex];
  const routeShape = {
    type: 'Feature' as const,
    properties: {},
    geometry: { type: 'LineString' as const, coordinates: plan.coordinates },
  };
  const activeShape = {
    type: 'Feature' as const,
    properties: {},
    geometry: { type: 'LineString' as const, coordinates: leg.route.points },
  };

  function nextDirection() {
    if (directionIndex < leg.route.steps.length - 1) {
      setDirectionIndex((value) => value + 1);
    } else if (stopIndex < 4) {
      setStopIndex((value) => value + 1);
      setDirectionIndex(0);
    } else {
      router.push('/map');
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>TOUR IN PROGRESS</Text>
        <Text style={styles.title}>Next: {leg.destination.name}</Text>
        <View style={styles.progressRow}>
          <View style={styles.walkingChip}>
            <Text style={styles.walkingText}>{plan.mode === 'walking' ? 'Walking' : plan.mode === 'cycling' ? 'Biking' : 'Driving'}</Text>
          </View>
          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>Stop {stopIndex + 1} / 5</Text>
          </View>
        </View>

        <View style={styles.mapFrame}>
          <Map style={StyleSheet.absoluteFill} mapStyle={styleUrl}>
            <Camera ref={camera} initialViewState={{ center: [-71.276, 42.4906], zoom: 12.7 }} />
            <GeoJSONSource id="whole-tour" data={routeShape}>
              <Layer id="whole-tour-line" source="whole-tour" type="line"
                paint={{ 'line-color': '#80B8E7', 'line-width': 4, 'line-opacity': 0.85 }} />
            </GeoJSONSource>
            <GeoJSONSource id="current-leg" data={activeShape}>
              <Layer id="current-leg-line" source="current-leg" type="line"
                paint={{ 'line-color': wf.blue, 'line-width': 6, 'line-opacity': 1 }} />
            </GeoJSONSource>
            <Marker id="origin" lngLat={plan.start}>
              <View style={styles.originPin}><Text style={styles.pinText}>S</Text></View>
            </Marker>
            {plan.legs.map((item, index) => (
              <Marker id={'stop-' + index} key={item.destination.id} lngLat={item.destination.coordinate}
                onPress={() => router.push({ pathname: '/site/[id]', params: { id: item.destination.id } })}>
                <View style={[styles.stopPin, index === stopIndex && styles.activeStop]}>
                  <Text style={styles.pinText}>{index + 1}</Text>
                </View>
              </Marker>
            ))}
          </Map>
        </View>

        <View style={styles.direction}>
          <Text style={styles.directionTitle}>{direction?.instruction ?? 'Follow the marked route to ' + leg.destination.name}</Text>
          <Text style={styles.directionSub}>
            Direction {Math.min(directionIndex + 1, Math.max(leg.route.steps.length, 1))} of {Math.max(leg.route.steps.length, 1)} · {(leg.route.lengthKm * 0.621371).toFixed(1)} miles to this stop
          </Text>
        </View>

        <View style={styles.audioNotice}>
          <Text style={styles.audioTitle}>♪  History at {leg.destination.name}</Text>
          <Text style={styles.audioSub}>Open the stop to read its history and play narration.</Text>
          <Pressable onPress={() => router.push({ pathname: '/site/[id]', params: { id: leg.destination.id } })}>
            <Text style={styles.link}>View historical stop  →</Text>
          </Pressable>
        </View>

        <View style={styles.buttons}>
          <Pressable style={styles.secondaryButton}
            disabled={directionIndex === 0 && stopIndex === 0}
            onPress={() => {
              if (directionIndex > 0) setDirectionIndex((index) => index - 1);
              else if (stopIndex > 0) {
                setStopIndex((index) => index - 1);
                setDirectionIndex(0);
              }
            }}>
            <Text style={styles.secondaryText}>‹ Previous</Text>
          </Pressable>
          <Pressable style={styles.primarySmall} onPress={nextDirection}>
            <Text style={styles.primaryText}>{directionIndex < leg.route.steps.length - 1 ? 'Next direction  →' : stopIndex < 4 ? 'Next stop  →' : 'Finish tour  →'}</Text>
          </Pressable>
        </View>

        <Pressable style={styles.pause} onPress={() => setPaused((previous) => !previous)}>
          <Text style={styles.pauseText}>{paused ? 'Resume tour' : 'Pause tour'}</Text>
        </Pressable>
        <Text style={styles.note}>Route preview only. Directions advance with the buttons, not automatically with GPS. Check signs and crossings; do not interact with the screen while driving.</Text>
      </ScrollView>
      <BottomNav active="map" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: wf.background },
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 116, gap: 10 },
  empty: { margin: 24, gap: 15 },
  note: { color: wf.muted, fontSize: 12, lineHeight: 18 },
  kicker: { fontSize: 12, lineHeight: 16, fontWeight: '700', color: '#42BDF0' },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '700', color: wf.navy },
  progressRow: { height: 40, flexDirection: 'row', gap: 8 },
  walkingChip: { minWidth: 103, height: 40, borderRadius: 12, backgroundColor: wf.blue, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  walkingText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  stepBadge: { width: 100, height: 30, borderRadius: 12, backgroundColor: wf.lightBlue, justifyContent: 'center', paddingHorizontal: 10 },
  stepText: { fontSize: 12, color: wf.ink },
  mapFrame: { height: 240, borderRadius: 12, overflow: 'hidden', backgroundColor: wf.map },
  direction: { borderRadius: 12, minHeight: 94, backgroundColor: wf.blue, paddingHorizontal: 15, paddingVertical: 14, gap: 8 },
  directionTitle: { color: '#FFFFFF', fontSize: 16, lineHeight: 22, fontWeight: '700' },
  directionSub: { color: '#E1EAFF', fontSize: 12, lineHeight: 16 },
  audioNotice: { borderRadius: 12, borderWidth: 1, borderColor: '#3DC3F2', padding: 14, backgroundColor: wf.lightBlue, gap: 5 },
  audioTitle: { color: wf.navy, fontSize: 15, fontWeight: '700' },
  audioSub: { color: '#65749A', fontSize: 12, lineHeight: 16 },
  link: { color: wf.blue, fontSize: 13, fontWeight: '700', marginTop: 5 },
  buttons: { flexDirection: 'row', gap: 8 },
  secondaryButton: { flex: 1, minHeight: 48, borderWidth: 1, borderColor: wf.border, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  secondaryText: { color: wf.navy, fontSize: 13, fontWeight: '700' },
  primarySmall: { flex: 2, minHeight: 48, backgroundColor: wf.red, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  primaryButton: { minHeight: 48, backgroundColor: wf.red, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  primaryText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  pause: { minHeight: 48, borderWidth: 1, borderColor: wf.border, backgroundColor: wf.surface, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  pauseText: { color: wf.ink, fontSize: 14, fontWeight: '700' },
  originPin: { width: 30, height: 30, borderRadius: 15, backgroundColor: wf.primary, borderColor: '#FFFFFF', borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  stopPin: { width: 32, height: 32, borderRadius: 12, backgroundColor: wf.red, borderColor: '#FFFFFF', borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  activeStop: { borderColor: wf.cyan, borderWidth: 3 },
  pinText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});
