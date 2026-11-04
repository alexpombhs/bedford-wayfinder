import React, { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Stack } from 'expo-router';
import * as Speech from 'expo-speech';
import { colors } from '../src/theme';
import { buildDirectionsUrl, DEMO_DESTINATION, SAMPLE_NARRATION, type DirectionsMode } from '../src/services/demoTour';

const green = '#194A41';
const muted = '#667973';
const background = '#F8FAF8';
const red = '#EE2F31';

export default function DemoTour() {
  // The origin is deliberately not persisted, logged or committed to source code.
  const [origin, setOrigin] = useState('');
  const [mode, setMode] = useState<DirectionsMode>('walking');
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => { void Speech.stop(); }, []);

  async function openDirections() {
    if (!origin.trim()) {
      Alert.alert('Starting point required', 'Enter your starting address first. Your address remains on this device.');
      return;
    }
    const url = buildDirectionsUrl(origin, mode);
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Unable to open maps', 'Please check that your device has a maps app or browser available.');
    }
  }

  async function playSample() {
    await Speech.stop();
    setPlaying(true);
    Speech.speak(SAMPLE_NARRATION, {
      language: 'en-US',
      rate: 0.9,
      onDone: () => setPlaying(false),
      onStopped: () => setPlaying(false),
      onError: () => setPlaying(false),
    });
  }

  async function stopAudio() {
    await Speech.stop();
    setPlaying(false);
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: 'Guided tour demo' }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>BEDFORD / WAYFINDER</Text>
        <Text style={styles.title}>Your first guided tour</Text>
        <Text style={styles.subtitle}>Preview directions and an audio story together.</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Plan your route</Text>
          <Text style={styles.label}>STARTING POINT</Text>
          <TextInput
            style={styles.input}
            value={origin}
            onChangeText={setOrigin}
            placeholder="Enter your starting address"
            placeholderTextColor={muted}
            autoCapitalize="words"
            autoCorrect={false}
            accessibilityLabel="Starting address"
          />
          <Text style={styles.privacy}>Your starting address is only used to open directions. It isn't stored by Wayfinder.</Text>

          <Text style={styles.label}>DESTINATION · HISTORICAL POINT 1</Text>
          <View style={styles.destination}>
            <View style={styles.stopMarker}><Text style={styles.stopMarkerText}>01</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.destinationName}>{DEMO_DESTINATION.name}</Text>
              <Text style={styles.small}>{DEMO_DESTINATION.address}</Text>
            </View>
          </View>

          <Text style={styles.label}>TRAVEL MODE</Text>
          <View style={styles.modes}>
            {(['walking', 'cycling', 'driving'] as const).map((value) => (
              <Pressable
                key={value}
                style={[styles.mode, mode === value && styles.selectedMode]}
                onPress={() => setMode(value)}
                accessibilityRole="button"
                accessibilityState={{ selected: mode === value }}
              >
                <Text style={[styles.modeText, mode === value && styles.selectedModeText]}>
                  {value === 'walking' ? 'Walk' : value === 'cycling' ? 'Bike' : 'Drive'}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            style={styles.primary}
            onPress={() => { setStarted(true); void openDirections(); }}
            accessibilityRole="button"
          >
            <Text style={styles.primaryText}>Open route directions →</Text>
          </Pressable>
          <Text style={styles.note}>Real directions open in your device's maps app. Wayfinder does not yet provide its own live turn-by-turn navigation.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>2. Listen to the audio tour</Text>
          <Text style={styles.overline}>HISTORICAL POINT 1 · SAMPLE NARRATION</Text>
          <Text style={styles.narration}>“{SAMPLE_NARRATION}”</Text>
          <View style={styles.audioRow}>
            <Pressable style={styles.audioButton} accessibilityRole="button" onPress={() => void (playing ? stopAudio() : playSample())}>
              <Text style={styles.audioButtonText}>{playing ? '■ Stop audio' : '▶ Play sample audio'}</Text>
            </Pressable>
            <Pressable style={styles.replay} accessibilityRole="button" onPress={() => void playSample()}>
              <Text style={styles.replayText}>Replay</Text>
            </Pressable>
          </View>
          <Text style={styles.note}>{started ? 'Route preview started. Play the sample narration here when you return from Maps.' : 'The sample narration plays on demand so you can test it without physically traveling.'}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoHeading}>What this demo tests</Text>
          <Text style={styles.small}>Route handoff to a directions app and spoken historical audio. Automatic location-triggered narration, pausing for spoken turns, and in-app route rendering are planned next—not active in this demo.</Text>
          <Text style={styles.source}>Destination reference: Town of Bedford municipal buildings directory.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: background },
  content: { padding: 24, gap: 16, paddingBottom: 40 },
  eyebrow: { color: green, fontSize: 12, fontWeight: '700', letterSpacing: 1.5 },
  title: { color: '#1E2C2B', fontSize: 29, fontWeight: '700' },
  subtitle: { color: muted, fontSize: 15, lineHeight: 22 },
  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#DAE3DC', padding: 16, gap: 13 },
  sectionTitle: { color: '#1E2C2B', fontSize: 20, fontWeight: '700' },
  label: { fontSize: 11, letterSpacing: 1, color: muted, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#DAE3DC', borderRadius: 12, paddingHorizontal: 14, minHeight: 48, color: '#1E2C2B', backgroundColor: '#fff', fontSize: 15 },
  privacy: { color: muted, fontSize: 12 },
  destination: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  stopMarker: { width: 42, height: 42, borderRadius: 12, backgroundColor: red, alignItems: 'center', justifyContent: 'center' },
  stopMarkerText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  destinationName: { fontWeight: '700', fontSize: 16, color: '#1E2C2B' },
  small: { color: muted, fontSize: 13, lineHeight: 20 },
  modes: { flexDirection: 'row', gap: 8 },
  mode: { flex: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center', height: 40, backgroundColor: '#fff', borderWidth: 1, borderColor: '#DAE3DC' },
  selectedMode: { backgroundColor: green, borderColor: green },
  modeText: { color: '#1E2C2B', fontWeight: '700' },
  selectedModeText: { color: '#fff' },
  primary: { padding: 16, borderRadius: 12, backgroundColor: red, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  note: { color: muted, fontSize: 12, lineHeight: 19 },
  overline: { color: green, fontSize: 11, letterSpacing: 0.5, fontWeight: '700' },
  narration: { color: '#1E2C2B', fontSize: 18, lineHeight: 26 },
  audioRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  audioButton: { backgroundColor: green, borderRadius: 12, padding: 14, flex: 1, alignItems: 'center' },
  audioButtonText: { color: '#fff', fontWeight: '700' },
  replay: { padding: 12 },
  replayText: { color: green, fontWeight: '700' },
  infoBox: { padding: 16, backgroundColor: '#EEF4F0', borderRadius: 12, gap: 8 },
  infoHeading: { fontSize: 15, fontWeight: '700', color: '#1E2C2B' },
  source: { fontSize: 11, color: muted },
});
