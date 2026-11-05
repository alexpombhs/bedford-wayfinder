import React from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav, RoutePreview, wf } from '../src/components/WayfinderUI';
import { TOUR_SITES } from '../src/data/tourSites';

export default function Tours() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹   All historic trails</Text>
        </Pressable>
        <Text style={styles.title}>Revolutionary Bedford</Text>
        <Text style={styles.subtitle}>Five historic places, with directions based on your starting location.</Text>

        <RoutePreview />
        <Text style={styles.note}>The illustration is a preview. Tap below for an interactive map and actual street directions.</Text>

        <View style={styles.badgeRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>5 stops</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>Walk / Bike</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>Drive</Text></View>
        </View>

        <Text style={styles.section}>ON THIS TRAIL</Text>
        {TOUR_SITES.map((site, index) => (
          <Pressable key={site.id} style={styles.stopRow} onPress={() => router.push({ pathname: '/site/[id]', params: { id: site.id } })}>
            <View style={styles.stopNumber}><Text style={styles.stopNumberText}>{String(index + 1).padStart(2, '0')}</Text></View>
            <View style={styles.stopCopy}>
              <Text style={styles.stopTitle}>{site.name}</Text>
              <Text numberOfLines={1} style={styles.stopSubtitle}>{site.address}</Text>
            </View>
          </Pressable>
        ))}

        <Pressable style={styles.cta} onPress={() => router.push('/map')}>
          <Text style={styles.ctaText}>Plan my route on the map  →</Text>
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
  subtitle: { fontSize: 14, lineHeight: 18, color: '#65749A' },
  note: { fontSize: 12, lineHeight: 17, color: wf.muted },
  badgeRow: { height: 40, flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  badge: { width: 100, height: 30, borderRadius: 12, backgroundColor: wf.lightBlue, justifyContent: 'center', paddingHorizontal: 10 },
  badgeText: { fontSize: 12, color: wf.ink },
  section: { marginTop: 0, fontSize: 12, lineHeight: 16, fontWeight: '700', color: '#5E6E91' },
  stopRow: { height: 82, borderWidth: 1, borderColor: wf.border, borderRadius: 12, backgroundColor: wf.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 17, gap: 14 },
  stopNumber: { width: 42, height: 42, borderRadius: 12, backgroundColor: wf.red, alignItems: 'center', justifyContent: 'center' },
  stopNumberText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  stopCopy: { flex: 1, gap: 4 },
  stopTitle: { fontSize: 15, lineHeight: 19, fontWeight: '700', color: wf.ink },
  stopSubtitle: { fontSize: 12, lineHeight: 16, color: wf.muted },
  cta: { height: 48, borderRadius: 12, backgroundColor: wf.red, alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});
