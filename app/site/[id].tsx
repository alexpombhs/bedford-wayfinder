import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav, wf } from '../../src/components/WayfinderUI';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { NarrationPlayPauseButton } from '../../src/components/atoms/NarrationPlayPauseButton';
import { TOUR_SITES } from '../../src/data/tourSites';
import { useAudioTour } from '../../src/context/AudioTourContext';

export default function SiteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const site = TOUR_SITES.find((s) => s.id === id);
  const { activeSite: audioSite, state: audioState, progress, replay, playerVisible } = useAudioTour();
  const isCurrentStory = audioSite?.id === site?.id;
  const currentProgress = isCurrentStory ? progress : 0;
  function exitDetails() { if (router.canGoBack()) router.back(); else router.replace('/map'); }
  const [captions, setCaptions] = useState(false);

  if (!site) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
        <Text style={styles.storyCopy}>Historical site not found.</Text>
        <BottomNav active="explore" />
      </SafeAreaView>
    );
  }

  const stopNumber = TOUR_SITES.findIndex((s) => s.id === site.id) + 1;
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.fixedHeader}>
        <Pressable onPress={exitDetails} accessibilityRole="button" accessibilityLabel="Go back to map or tour" style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={wf.navy} />
          <Text style={styles.headerLabel}>Back</Text>
        </Pressable>
        <Pressable onPress={exitDetails} accessibilityRole="button" accessibilityLabel="Close historical information" style={styles.exitButton}>
          <Ionicons name="close" size={24} color={wf.navy} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={[styles.content, playerVisible && styles.contentWithPlayer]} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{site.name}</Text>
        <Text style={styles.kicker}>HISTORIC STOP {stopNumber} OF 5  •  AUDIO STORY</Text>
        <Image
          source={{ uri: site.photoUrl }}
          style={styles.heroPhoto}
          resizeMode="cover"
          accessibilityLabel={'Historical photograph of ' + site.name}
        />
        <Pressable onPress={() => void Linking.openURL(site.photoSourceUrl)}>
          <Text style={styles.photoCredit}>Photo: {site.photoCredit} · {site.photoLicense} · View image source ↗</Text>
        </Pressable>
        <Text style={styles.storyTitle}>History of {site.name}</Text>
        <Text style={styles.storyCopy}>{site.description}</Text>
        <Text style={styles.storyTitle}>Audio tour story</Text>
        <Text style={styles.storyCopy}>{site.narration}</Text>

        <View style={styles.audioCard}>
          <View style={styles.audioTop}>
            <NarrationPlayPauseButton site={site} variant="outlined" />
            <View style={styles.audioInformation}>
              <Text style={styles.audioName}>{site.name}</Text>
              <Text style={styles.meta}>
                {isCurrentStory && audioState === 'playing' ? 'Narrating now' :
                 isCurrentStory && audioState === 'paused' ? 'Paused — play to resume' :
                 'Audio narration · English'}
              </Text>
            </View>
          </View>
          <View style={styles.audioProgressTrack}>
            <View style={[styles.audioProgress, { width: (Math.max(0, Math.min(100, currentProgress * 100)) + '%') as `${number}%` }]} />
          </View>
          <View style={styles.controls}>
            <Pressable accessibilityRole="button" accessibilityLabel="Restart story from beginning" onPress={() => { void replay(site); }}>
              <Text style={styles.control}>Restart from beginning</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => setCaptions((p) => !p)}>
              <Text style={styles.control}>{captions ? 'Hide transcript' : 'Transcript'}</Text>
            </Pressable>
          </View>
        </View>
        {captions && <View style={styles.captionCard}><Text style={styles.storyCopy}>{site.narration}</Text></View>}
        {site.privateProperty && <Text style={styles.warning}>Private residence — please view from public areas only.</Text>}

        <Pressable style={styles.moreInfo} onPress={() => void Linking.openURL(site.sourceUrl)}>
          <Text style={styles.moreInfoText}>▤  Historical source & more information  ↗</Text>
        </Pressable>
        <Pressable style={styles.cta} onPress={exitDetails}>
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
  contentWithPlayer: { paddingBottom: 218 },
  fixedHeader: { minHeight: 52, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: wf.background, borderBottomWidth: 1, borderBottomColor: wf.border },
  backButton: { minHeight: 48, minWidth: 92, flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerLabel: { color: wf.navy, fontSize: 15, fontWeight: '700' },
  exitButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  back: { fontSize: 12, lineHeight: 16, color: '#42BDF0' },
  title: { fontSize: 28, lineHeight: 36, fontWeight: '700', color: wf.navy },
  kicker: { fontSize: 12, lineHeight: 16, fontWeight: '700', color: '#5E6E91' },
  heroPhoto: { width: '100%', height: 190, borderRadius: 12, backgroundColor: wf.lightBlue },
  photoCredit: { fontSize: 11, lineHeight: 16, color: wf.muted, textDecorationLine: 'underline' },
  storyTitle: { fontSize: 20, lineHeight: 26, fontWeight: '700', color: wf.navy },
  storyCopy: { fontSize: 14, lineHeight: 19, color: '#65749A' },
  audioCard: { minHeight: 140, borderWidth: 1, borderColor: wf.border, borderRadius: 12, backgroundColor: wf.surface, padding: 15, gap: 13 },
  audioTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  playButton: { width: 48, height: 48, borderWidth: 1, borderColor: wf.border, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  playIcon: { fontSize: 26, color: wf.primary },
  audioInformation: { flex: 1, gap: 5 },
  audioName: { fontSize: 15, lineHeight: 19, fontWeight: '700', color: wf.ink },
  meta: { fontSize: 12, color: wf.muted },
  controls: { flexDirection: 'row', gap: 22 },
  audioProgressTrack: { height: 4, backgroundColor: wf.border, borderRadius: 4, overflow: 'hidden' },
  audioProgress: { height: 4, backgroundColor: wf.blue },
  control: { fontSize: 12, color: wf.primary },
  captionCard: { backgroundColor: wf.lightBlue, borderRadius: 12, padding: 13 },
  warning: { color: '#A84A30', fontSize: 12, lineHeight: 18 },
  moreInfo: { minHeight: 48, borderRadius: 12, backgroundColor: wf.lightBlue, justifyContent: 'center', paddingHorizontal: 13 },
  moreInfoText: { fontSize: 14, color: wf.navy },
  cta: { height: 48, borderRadius: 12, backgroundColor: wf.red, alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});
