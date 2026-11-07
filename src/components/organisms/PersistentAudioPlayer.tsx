import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { router, usePathname } from 'expo-router';
import { useAudioTour } from '../../context/AudioTourContext';
import { NarrationPlayPauseButton } from '../atoms/NarrationPlayPauseButton';
import { WayfinderIconButton } from '../atoms/WayfinderIconButton';
import { wf } from '../WayfinderUI';

/**
 * Organism: shared audio controls persist across screens.
 *
 * Map pages use a small LEFT-side dock in the exposed map area, separate
 * from the lower landmark sheet and bottom navigation. On other pages the
 * player stays above bottom navigation, with scroll padding on detail screens.
 */
export function PersistentAudioPlayer() {
  const {
    activeSite, state, progress, playerVisible,
    dismissPlayer, showPlayer, stopAndClose,
  } = useAudioTour();
  const pathname = usePathname();
  const isMapScreen = pathname === '/map' || pathname === '/demo-tour';
  if (!activeSite) return null;

  const closeButton = (
    <WayfinderIconButton
      icon="close"
      variant="subtle"
      label="Close audio player and stop narration"
      onPress={() => { void stopAndClose(); }}
      style={styles.smallButton}
    />
  );

  if (!playerVisible) {
    return (
      <View style={[styles.minimized, isMapScreen ? styles.mapMinimized : styles.otherMinimized]}>
        <Pressable
          style={styles.expand}
          accessibilityRole="button"
          accessibilityLabel="Expand audio player"
          onPress={showPlayer}
        >
          <Ionicons name="headset-outline" size={22} color={wf.primary} />
        </Pressable>
        <NarrationPlayPauseButton site={activeSite} />
        {closeButton}
      </View>
    );
  }

  return (
    <View style={[styles.container, isMapScreen ? styles.mapContainer : styles.otherContainer]}>
      <View style={styles.bar}>
        <Ionicons name="headset-outline" size={19} color={wf.blue} />
        <Pressable
          style={styles.info}
          accessibilityRole="button"
          accessibilityLabel={'View audio story about ' + activeSite.name}
          onPress={() => router.push({ pathname: '/site/[id]', params: { id: activeSite.id } })}
        >
          <Text numberOfLines={1} style={styles.title}>{activeSite.name}</Text>
          <Text style={styles.subtitle}>
            {state === 'playing' ? 'Now playing' : state === 'paused' ? 'Paused — resume where you left off' : 'Story finished'}
          </Text>
        </Pressable>
        <NarrationPlayPauseButton site={activeSite} />
      </View>
      <View style={styles.controls}>
        <Pressable style={styles.controlAction} onPress={dismissPlayer} accessibilityRole="button" accessibilityLabel="Minimize audio player without stopping">
          <Ionicons name="chevron-down" size={18} color={wf.primary} />
          <Text style={styles.controlText}>Minimize</Text>
        </Pressable>
        <Pressable style={styles.controlAction} onPress={() => { void stopAndClose(); }} accessibilityRole="button" accessibilityLabel="Close audio player and stop narration">
          <Ionicons name="close" size={18} color={wf.primary} />
          <Text style={styles.controlText}>Close & stop</Text>
        </Pressable>
      </View>
      <View style={styles.track}>
        <View style={[styles.progress, { width: (Math.max(0, Math.min(100, progress * 100)) + '%') as `${number}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', zIndex: 40, elevation: 14, borderRadius: 14,
    backgroundColor: wf.surface, borderWidth: 1, borderColor: wf.border,
    shadowColor: wf.navy, shadowOpacity: 0.14, shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 }, overflow: 'hidden',
  },
  // Keep the sheet's audio/info controls and navigation unobstructed.
  mapContainer: { top: '34%', left: 12, width: 292, maxWidth: '76%' },
  otherContainer: { left: 24, right: 24, bottom: 102 },
  minimized: {
    position: 'absolute', zIndex: 40, elevation: 14, gap: 4, padding: 5,
    borderWidth: 1, borderColor: wf.border, borderRadius: 14,
    backgroundColor: wf.surface,
  },
  mapMinimized: { top: '36%', left: 12, alignItems: 'center' },
  otherMinimized: { bottom: 102, left: 24, flexDirection: 'row', alignItems: 'center' },
  expand: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  smallButton: { width: 48, height: 44, borderRadius: 10 },
  bar: { minHeight: 60, paddingHorizontal: 8, gap: 7, flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, minWidth: 0 },
  title: { fontSize: 13, color: wf.navy, fontWeight: '700' },
  subtitle: { fontSize: 10, color: wf.muted },
  controls: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly',
    borderTopWidth: 1, borderTopColor: wf.border, minHeight: 38,
  },
  controlAction: {
    minHeight: 38, flex: 1, flexDirection: 'row', gap: 5,
    alignItems: 'center', justifyContent: 'center',
  },
  controlText: { fontSize: 12, fontWeight: '600', color: wf.primary },
  track: { height: 3, backgroundColor: wf.border, width: '100%' },
  progress: { height: 3, backgroundColor: wf.blue },
});
