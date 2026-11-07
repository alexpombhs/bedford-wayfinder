import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { router } from 'expo-router';
import { useAudioTour } from '../../context/AudioTourContext';
import { NarrationPlayPauseButton } from '../atoms/NarrationPlayPauseButton';
import { WayfinderIconButton } from '../atoms/WayfinderIconButton';
import { wf } from '../WayfinderUI';

/**
 * Persistent audio mini-player, placed immediately above the fixed bottom menu.
 * Never covers a page's Back/Close actions in its header.
 */
export function PersistentAudioPlayer() {
  const { activeSite, state, progress, playerVisible, dismissPlayer } = useAudioTour();
  if (!activeSite || !playerVisible) return null;

  return (
    <View style={styles.container}>
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
        <WayfinderIconButton icon="close" variant="subtle" label="Dismiss audio player without stopping narration" onPress={dismissPlayer} style={styles.close} />
      </View>
      <View style={styles.track}>
        <View style={[styles.progress, { width: (Math.max(0, Math.min(100, progress * 100)) + '%') as `${number}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', left: 24, right: 24, bottom: 102,
    zIndex: 40, elevation: 14, borderRadius: 14, backgroundColor: wf.surface,
    borderWidth: 1, borderColor: wf.border, shadowColor: wf.navy,
    shadowOpacity: 0.14, shadowRadius: 10, shadowOffset: { width: 0, height: 3 },
    overflow: 'hidden',
  },
  bar: { minHeight: 64, paddingHorizontal: 9, gap: 7, flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, minWidth: 0 },
  title: { fontSize: 13, color: wf.navy, fontWeight: '700' },
  subtitle: { fontSize: 10, color: wf.muted },
  close: { width: 36, height: 44, borderRadius: 10 },
  track: { height: 3, backgroundColor: wf.border, width: '100%' },
  progress: { height: 3, backgroundColor: wf.blue },
});
