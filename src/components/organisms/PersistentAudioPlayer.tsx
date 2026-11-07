import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { router, usePathname } from 'expo-router';
import { useAudioTour } from '../../context/AudioTourContext';
import { NarrationPlayPauseButton } from '../atoms/NarrationPlayPauseButton';
import { WayfinderIconButton } from '../atoms/WayfinderIconButton';
import { wf } from '../WayfinderUI';

/**
 * Persistent, compact audio dock (organism).
 * Never expands over a landmark's actions. The headset opens a separate
 * detailed listening page with transcript and progress.
 */
export function PersistentAudioPlayer() {
  const { activeSite, stopAndClose } = useAudioTour();
  const path = usePathname();
  if (!activeSite) return null;

  const onMap = path === '/map' || path === '/demo-tour';
  const isAudioPage = path.startsWith('/audio/');
  return (
    <View style={[styles.dock, onMap ? styles.mapDock : isAudioPage ? styles.audioDock : styles.pageDock]}>
      <Pressable
        style={styles.details}
        accessibilityRole="button"
        accessibilityLabel={'Open audio transcript and playback progress for ' + activeSite.name}
        onPress={() => router.push({ pathname: '/audio/[id]', params: { id: activeSite.id } })}
      >
        <Ionicons name="headset-outline" size={24} color={wf.primary} />
      </Pressable>
      <NarrationPlayPauseButton site={activeSite} />
      <WayfinderIconButton
        icon="close"
        variant="subtle"
        label="Close audio player and stop narration"
        onPress={() => { void stopAndClose(); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    position: 'absolute',
    zIndex: 40,
    elevation: 14,
    width: 59,
    alignItems: 'center',
    paddingVertical: 6,
    gap: 5,
    borderWidth: 1,
    borderColor: wf.border,
    borderRadius: 16,
    backgroundColor: wf.surface,
    shadowColor: wf.navy,
    shadowOpacity: 0.14,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 3 },
  },
  // Between map header and historical bottom sheet.
  mapDock: { left: 12, top: '35%' },
  // On text-heavy pages, dock nearer the bottom, away from the back/header controls.
  pageDock: { left: 12, bottom: 115 },
  audioDock: { left: 12, bottom: 115 },
  details: { width: 48, height: 44, justifyContent: 'center', alignItems: 'center' },
});
