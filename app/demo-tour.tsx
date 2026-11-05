import React, { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav, RoutePreview, wf } from '../src/components/WayfinderUI';

export default function DemoTour() {
  const [paused, setPaused] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>TOUR IN PROGRESS</Text>
        <Text style={styles.title}>Next: Bedford Flag</Text>

        <View style={styles.progressRow}>
          <View style={styles.walkingChip}><Text style={styles.walkingText}>Walking</Text></View>
          <View style={styles.stepBadge}><Text style={styles.stepText}>Stop 2 / 6</Text></View>
        </View>

        <RoutePreview />

        <Pressable style={styles.direction} onPress={() => router.push('/site/bedford-flag')}>
          <Text style={styles.directionTitle}>Continue along Great Road</Text>
          <Text style={styles.directionSub}>Follow the path to Bedford Flag</Text>
        </Pressable>

        <Pressable style={styles.audioNotice} onPress={() => router.push('/site/bedford-flag')}>
          <Text style={styles.audioTitle}>♪  Audio starts near the landmark</Text>
          <Text style={styles.audioSub}>Stories pause during turn directions</Text>
        </Pressable>

        <Pressable style={styles.pause} onPress={() => setPaused((v) => !v)}>
          <Text style={styles.pauseText}>{paused ? 'Resume tour' : 'Pause tour'}</Text>
        </Pressable>
      </ScrollView>
      <BottomNav active="explore" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: wf.background },
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 116, gap: 10 },
  kicker: { fontSize: 12, lineHeight: 16, fontWeight: '700', color: '#42BDF0' },
  title: { fontSize: 22, lineHeight: 26, fontWeight: '700', color: wf.navy },
  progressRow: { height: 40, flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  walkingChip: { width: 103, height: 40, borderRadius: 12, backgroundColor: wf.blue, alignItems: 'center', justifyContent: 'center' },
  walkingText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  stepBadge: { width: 100, height: 30, borderRadius: 12, backgroundColor: wf.lightBlue, justifyContent: 'center', paddingHorizontal: 10 },
  stepText: { fontSize: 12, color: wf.ink },
  direction: { height: 94, borderRadius: 12, backgroundColor: wf.blue, paddingHorizontal: 15, paddingVertical: 14, gap: 8 },
  directionTitle: { fontSize: 16, lineHeight: 21, fontWeight: '700', color: '#FFFFFF' },
  directionSub: { fontSize: 12, lineHeight: 16, color: '#E1EAFF' },
  audioNotice: { height: 67, borderRadius: 12, borderWidth: 1, borderColor: '#3DC3F2', backgroundColor: wf.lightBlue, paddingHorizontal: 14, paddingVertical: 12, gap: 4 },
  audioTitle: { fontSize: 15, lineHeight: 19, fontWeight: '700', color: wf.navy },
  audioSub: { fontSize: 12, lineHeight: 16, color: '#65749A' },
  pause: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: wf.border, backgroundColor: wf.surface, alignItems: 'center', justifyContent: 'center' },
  pauseText: { fontSize: 14, fontWeight: '700', color: wf.ink },
});
