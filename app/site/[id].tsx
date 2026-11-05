import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav, wf } from '../../src/components/WayfinderUI';

const narration = "Learn about the Bedford Flag and its place in the town's Revolutionary War story.";

export default function SiteDetail() {
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => { void Speech.stop(); }, []);

  async function toggleAudio() {
    if (playing) {
      await Speech.stop();
      setPlaying(false);
      return;
    }
    await Speech.stop();
    setPlaying(true);
    Speech.speak(narration, {
      language: 'en-US',
      rate: 0.9,
      onDone: () => setPlaying(false),
      onStopped: () => setPlaying(false),
      onError: () => setPlaying(false),
    });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()}><Text style={styles.back}>‹   Back to navigation</Text></Pressable>
        <Text style={styles.title}>The Bedford Flag</Text>
        <Text style={styles.kicker}>STOP 2 OF 6  •  HISTORICAL AUDIO</Text>

        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageLabel}>HISTORICAL IMAGE</Text>
        </View>

        <Text style={styles.storyTitle}>Stories of Revolutionary Bedford</Text>
        <Text style={styles.storyCopy}>{narration}</Text>

        <View style={styles.audioCard}>
          <View style={styles.audioTop}>
            <Pressable style={styles.playButton} onPress={() => void toggleAudio()}>
              <Text style={styles.playIcon}>{playing ? 'Ⅱ' : '▷'}</Text>
            </Pressable>
            <Text style={styles.audioName}>The Bedford Flag</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>Audio story</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.meta}>2 min 45 sec</Text>
          </View>
          <View style={styles.progressTrack}><View style={styles.progressFill} /></View>
          <View style={styles.controls}>
            <Text style={styles.control}>Replay</Text>
            <Text style={styles.control}>{playing ? 'Pause' : 'Pause'}</Text>
            <Text style={styles.control}>Captions</Text>
          </View>
        </View>

        <View style={styles.moreInfo}>
          <Text style={styles.moreInfoText}>▤  Photos, timeline & more information  →</Text>
        </View>

        <Pressable style={styles.cta} onPress={() => router.replace('/demo-tour')}>
          <Text style={styles.ctaText}>Continue to next stop  →</Text>
        </Pressable>
      </ScrollView>
      <BottomNav active="explore" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: wf.background },
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 116, gap: 10 },
  back: { fontSize: 12, lineHeight: 16, color: '#42BDF0' },
  title: { fontSize: 28, lineHeight: 36, fontWeight: '700', color: wf.navy },
  kicker: { fontSize: 12, lineHeight: 16, fontWeight: '700', color: '#5E6E91' },
  imagePlaceholder: { height: 190, borderRadius: 12, backgroundColor: wf.lightBlue, justifyContent: 'center', paddingHorizontal: 18 },
  imageLabel: { fontSize: 12, fontWeight: '700', color: '#5E6E91' },
  storyTitle: { fontSize: 20, lineHeight: 26, fontWeight: '700', color: wf.navy },
  storyCopy: { fontSize: 14, lineHeight: 18, color: '#65749A' },
  audioCard: { height: 155, borderWidth: 1, borderColor: wf.border, borderRadius: 12, backgroundColor: wf.surface, padding: 15, gap: 10 },
  audioTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  playButton: { width: 48, height: 48, borderWidth: 1, borderColor: wf.border, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  playIcon: { fontSize: 26, color: wf.primary },
  audioName: { fontSize: 15, lineHeight: 19, fontWeight: '700', color: wf.ink },
  metaRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  meta: { fontSize: 12, color: wf.muted },
  dot: { fontSize: 12, color: wf.muted },
  progressTrack: { height: 4, borderRadius: 2, backgroundColor: '#E8EFEB', overflow: 'hidden' },
  progressFill: { width: '38%', height: 4, backgroundColor: wf.primary },
  controls: { flexDirection: 'row', gap: 28 },
  control: { fontSize: 12, color: wf.muted },
  moreInfo: { height: 48, borderRadius: 12, backgroundColor: wf.lightBlue, justifyContent: 'center', paddingHorizontal: 13 },
  moreInfoText: { fontSize: 14, color: wf.navy },
  cta: { height: 48, borderRadius: 12, backgroundColor: wf.red, alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});
