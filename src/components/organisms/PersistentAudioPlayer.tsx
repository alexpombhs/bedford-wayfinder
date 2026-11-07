import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { router } from 'expo-router';
import { useAudioTour } from '../../context/AudioTourContext';
import { WayfinderIconButton } from '../atoms/WayfinderIconButton';
import { wf } from '../WayfinderUI';

/** Persistent organism rendered once above the navigation stack. */
export function PersistentAudioPlayer() {
  const { activeSite, state, progress, pause, resume } = useAudioTour();
  const insets = useSafeAreaInsets();
  if (!activeSite) return null;

  return (
    <View style={[styles.container, { top: insets.top + 3 }]}>
      <View style={styles.bar}>
        <Ionicons name="headset-outline" size={20} color={wf.blue} />
        <Pressable
          style={styles.info}
          accessibilityRole="button"
          accessibilityLabel={'View audio story about ' + activeSite.name}
          onPress={() => router.push({ pathname: '/site/[id]', params: { id: activeSite.id } })}
        >
          <Text numberOfLines={1} style={styles.title}>{activeSite.name}</Text>
          <Text style={styles.subtitle}>{state === 'playing' ? 'Narrating now' : state === 'paused' ? 'Paused — resume your story' : 'Story finished'}</Text>
        </Pressable>
        <WayfinderIconButton
          icon={state === 'playing' ? 'pause' : 'play'}
          label={state === 'playing' ? 'Pause narration' : 'Resume narration'}
          variant="contained"
          onPress={() => { void (state === 'playing' ? pause() : resume()); }}
          disabled={state === 'idle'}
        />
      </View>
      <View style={styles.track}>
        <View style={[styles.progress, { width: (Math.max(0, Math.min(100, progress * 100)) + '%') as `${number}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 15, right: 15, zIndex: 40, elevation: 14, borderRadius: 14, backgroundColor: wf.surface, borderWidth: 1, borderColor: wf.border, shadowColor: wf.navy, shadowOpacity: 0.14, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, overflow: 'hidden' },
  bar: { minHeight: 59, paddingLeft: 12, paddingRight: 7, gap: 10, flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, minWidth: 0 },
  title: { fontSize: 14, color: wf.navy, fontWeight: '700' },
  subtitle: { fontSize: 11, color: wf.muted },
  track: { height: 3, backgroundColor: wf.border, width: '100%' },
  progress: { height: 3, backgroundColor: wf.blue },
});
