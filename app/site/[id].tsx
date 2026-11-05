import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import * as Linking from 'expo-linking';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav, wf } from '../../src/components/WayfinderUI';
import { TOUR_SITES } from '../../src/data/tourSites';

export default function SiteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const site = TOUR_SITES.find((s) => s.id === id);
  const [playing, setPlaying] = useState(false);
  const [captions, setCaptions] = useState(false);

  useEffect(() => () => { void Speech.stop(); }, [id]);
  if (!site) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
        <Text style={styles.storyCopy}>Historical site not found.</Text>
        <BottomNav active="explore" />
      </SafeAreaView>
    );
  }

  async function play() {
    await Speech.stop();
    setPlaying(true);
    Speech.speak(site!.description, {
      rate: 0.9,
      language: 'en-US',
      onDone: () => setPlaying(false),
      onStopped: () => setPlaying(false),
      onError: () => setPlaying(false),
    });
  }

  async function toggleAudio() {
    if (playing) {
      await Speech.stop();
      setPlaying(false);
    } else {
      await play();
    }
  }

  const stopNumber = TOUR_SITES.findIndex((s) => s.id === site.id) + 1;
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()}><Text style={styles.back}>‹   Back to navigation</Text></Pressable>
        <Text style={styles.title}>{site.name}</Text>
        <Text style={styles.kicker}>HISTORIC STOP {stopNumber} OF 5  •  AUDIO STORY</Text>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageLabel}>HISTORICAL IMAGE</Text>
        </View>
        <Text style={styles.storyTitle}>Stories of Bedford</Text>
        <Text style={styles.storyCopy}>{site.description}</Text>

        <View style={styles.audioCard}>
          <View style={styles.audioTop}>
            <Pressable style={styles.playButton} onPress={() => void toggleAudio()} accessibilityRole="button">
              <Text style={styles.playIcon}>{playing ? 'Ⅱ' : '▷'}</Text>
            </Pressable>
            <View style={styles.audioInformation}>
              <Text style={styles.audioName}>{site.name}</Text>
              <Text style={styles.meta}>Spoken history • device narration</Text>
            </View>
          </View>
          <View style={styles.controls}>
            <Pressable onPress={() => void play()}><Text style={styles.control}>Replay</Text></Pressable>
            <Pressable onPress={() => void toggleAudio()}><Text style={styles.control}>{playing ? 'Stop' : 'Play'}</Text></Pressable>
            <Pressable onPress={() => setCaptions((p) => !p)}><Text style={styles.control}>{captions ? 'Hide text' : 'Captions'}</Text></Pressable>
          </View>
        </View>
        {captions && <View style={styles.captionCard}><Text style={styles.storyCopy}>{site.description}</Text></View>}
        {site.privateProperty && <Text style={styles.warning}>Private residence — please view from public areas only.</Text>}

        <Pressable style={styles.moreInfo} onPress={() => void Linking.openURL(site.sourceUrl)}>
          <Text style={styles.moreInfoText}>▤  Historical source & more information  ↗</Text>
        </Pressable>
        <Pressable style={styles.cta} onPress={() => router.back()}>
          <Text style={styles.ctaText}>Continue tour  →</Text>
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
  storyCopy: { fontSize: 14, lineHeight: 19, color: '#65749A' },
  audioCard: { minHeight: 140, borderWidth: 1, borderColor: wf.border, borderRadius: 12, backgroundColor: wf.surface, padding: 15, gap: 13 },
  audioTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  playButton: { width: 48, height: 48, borderWidth: 1, borderColor: wf.border, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  playIcon: { fontSize: 26, color: wf.primary },
  audioInformation: { flex: 1, gap: 5 },
  audioName: { fontSize: 15, lineHeight: 19, fontWeight: '700', color: wf.ink },
  meta: { fontSize: 12, color: wf.muted },
  controls: { flexDirection: 'row', gap: 28 },
  control: { fontSize: 12, color: wf.primary },
  captionCard: { backgroundColor: wf.lightBlue, borderRadius: 12, padding: 13 },
  warning: { color: '#A84A30', fontSize: 12, lineHeight: 18 },
  moreInfo: { minHeight: 48, borderRadius: 12, backgroundColor: wf.lightBlue, justifyContent: 'center', paddingHorizontal: 13 },
  moreInfoText: { fontSize: 14, color: wf.navy },
  cta: { height: 48, borderRadius: 12, backgroundColor: wf.red, alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});
