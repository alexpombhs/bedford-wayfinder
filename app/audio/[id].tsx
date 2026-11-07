import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav, wf } from '../../src/components/WayfinderUI';
import { TOUR_SITES } from '../../src/data/tourSites';
import { useAudioTour } from '../../src/context/AudioTourContext';
import { NarrationPlayPauseButton } from '../../src/components/atoms/NarrationPlayPauseButton';

export default function AudioStoryDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const site = TOUR_SITES.find(item => item.id === id);
  const { activeSite, state, progress, replay, stopAndClose } = useAudioTour();
  const current = site?.id === activeSite?.id;
  const played = current ? Math.max(0, Math.min(1, progress)) : 0;
  const percentage = Math.round(played * 100);

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/map');
  }

  if (!site) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
        <Pressable onPress={goBack} style={styles.headerButton}><Text>Back</Text></Pressable>
        <Text style={styles.message}>This audio story is unavailable.</Text>
        <BottomNav active="map" />
      </SafeAreaView>
    );
  }

  const spokenLength = Math.floor(site.narration.length * played);
  // Word-boundary-based TTS progress is approximate, not a precise audio timestamp.
  const splitAt = spokenLength > 0 ? Math.max(0, site.narration.lastIndexOf(' ', spokenLength)) : 0;
  const status = current && state === 'playing' ? 'Playing now' :
    current && state === 'paused' ? 'Paused at your saved position' :
    current ? 'Story finished' : 'Ready to listen';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable onPress={goBack} style={styles.headerButton} accessibilityRole="button" accessibilityLabel="Back to map">
          <Ionicons name="arrow-back" size={23} color={wf.navy} />
          <Text style={styles.headerLabel}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Audio story</Text>
        <Pressable onPress={goBack} style={styles.closeButton} accessibilityRole="button" accessibilityLabel="Close audio details without interrupting playback">
          <Ionicons name="close" size={23} color={wf.navy} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>BEDFORD / WAYFINDER</Text>
        <Text style={styles.title}>{site.name}</Text>
        <Text style={styles.subtitle}>Guided historical narration</Text>

        <View style={styles.playerCard}>
          <View style={styles.statusRow}>
            <View style={styles.headphones}>
              <Ionicons name="headset-outline" size={25} color={wf.blue} />
            </View>
            <View style={styles.statusText}>
              <Text style={styles.nowPlaying}>{status}</Text>
              <Text style={styles.progressLabel}>Narration progress · {percentage}%</Text>
            </View>
            <NarrationPlayPauseButton site={site} />
          </View>
          <View style={styles.progressTrack} accessibilityLabel={percentage + ' percent of narration completed'}>
            <View style={[styles.progressFill, { width: (`${percentage}%`) as `${number}%` }]} />
          </View>
          <View style={styles.progressFooter}>
            <Text style={styles.progressFooterText}>Beginning</Text>
            <Text style={styles.progressFooterText}>End</Text>
          </View>
          <Pressable style={styles.restart} accessibilityRole="button" onPress={() => { void replay(site); }}>
            <Ionicons name="refresh" size={17} color={wf.blue} />
            <Text style={styles.restartText}>Restart story from beginning</Text>
          </Pressable>
        </View>

        <Text style={styles.section}>Narration transcript</Text>
        <Text style={styles.description}>
          The words below are the full spoken story. Highlighting follows the last available word boundary.
        </Text>
        <View style={styles.transcriptCard}>
          <Text style={styles.transcript}>
            <Text style={styles.spoken}>{site.narration.slice(0, splitAt)}</Text>
            <Text>{site.narration.slice(splitAt)}</Text>
          </Text>
        </View>
        <Pressable style={styles.stopButton} onPress={() => { void stopAndClose(); goBack(); }} accessibilityRole="button">
          <Ionicons name="stop-circle-outline" size={20} color={wf.primary} />
          <Text style={styles.stopText}>Stop and close audio</Text>
        </Pressable>
      </ScrollView>
      <BottomNav active="map" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: wf.background },
  header: { height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: wf.border },
  headerButton: { height: 48, minWidth: 76, flexDirection: 'row', alignItems: 'center', gap: 7 },
  headerLabel: { fontSize: 14, fontWeight: '700', color: wf.navy },
  headerTitle: { fontSize: 15, fontWeight: '700', color: wf.navy },
  closeButton: { height: 48, width: 48, justifyContent: 'center', alignItems: 'center' },
  content: { paddingHorizontal: 24, paddingTop: 21, paddingBottom: 230, gap: 13 },
  kicker: { color: wf.blue, fontSize: 12, fontWeight: '700', letterSpacing: 0.6 },
  title: { color: wf.navy, fontSize: 27, fontWeight: '700' },
  subtitle: { color: wf.muted, fontSize: 14 },
  playerCard: { padding: 17, backgroundColor: wf.surface, borderRadius: 16, borderWidth: 1, borderColor: wf.border, gap: 17 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headphones: { backgroundColor: wf.lightBlue, width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statusText: { flex: 1, gap: 5 },
  nowPlaying: { color: wf.navy, fontWeight: '700', fontSize: 14 },
  progressLabel: { color: wf.muted, fontSize: 12 },
  progressTrack: { width: '100%', height: 9, backgroundColor: wf.border, borderRadius: 8, overflow: 'hidden' },
  progressFill: { height: 9, backgroundColor: wf.blue },
  progressFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  progressFooterText: { color: wf.muted, fontSize: 11 },
  restart: { minHeight: 42, borderRadius: 10, backgroundColor: wf.lightBlue, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 9 },
  restartText: { color: wf.blue, fontWeight: '700', fontSize: 13 },
  section: { marginTop: 5, fontSize: 20, fontWeight: '700', color: wf.navy },
  description: { color: wf.muted, fontSize: 12, lineHeight: 18 },
  transcriptCard: { backgroundColor: wf.surface, borderRadius: 14, padding: 17, borderWidth: 1, borderColor: wf.border },
  transcript: { fontSize: 15, color: wf.ink, lineHeight: 24 },
  spoken: { backgroundColor: wf.lightBlue, color: wf.blue },
  stopButton: { minHeight: 48, flexDirection: 'row', gap: 9, alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, borderColor: wf.border },
  stopText: { fontSize: 14, color: wf.primary, fontWeight: '700' },
  message: { margin: 24, color: wf.muted },
});
