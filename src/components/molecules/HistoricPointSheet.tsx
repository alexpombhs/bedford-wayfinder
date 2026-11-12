import React, { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { TourSite } from '../../data/tourSites';
import { WayfinderIconButton } from '../atoms/WayfinderIconButton';
import { wf } from '../WayfinderUI';

/** Molecule: landmark preview composed from an image, text and atomic icon controls. */
export type HistoricPointSheetProps = {
  site: TourSite;
  playing: boolean;
  onToggleAudio: () => void;
  onInfo: () => void;
  onClose: () => void;
};

export function HistoricPointSheet({ site, playing, onToggleAudio, onInfo, onClose }: HistoricPointSheetProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [site.id, progress]);

  return (
    <Animated.View style={[styles.panel, {
      opacity: progress,
      transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [35, 0] }) }],
    }]}>
      <View style={styles.grabber} />
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.overline}>HISTORICAL LANDMARK</Text>
          <Text style={styles.title} numberOfLines={1}>{site.name}</Text>
          <Text style={styles.address} numberOfLines={1}>{site.address}</Text>
        </View>
        <WayfinderIconButton icon="close" label="Close landmark preview" variant="subtle" onPress={onClose} />
      </View>
      <View style={styles.contentRow}>
        <View style={styles.photoFrame}>
          <Image source={{ uri: site.photoUrl }} style={styles.photo} resizeMode="cover" accessibilityLabel={'Photograph of ' + site.name} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.description} numberOfLines={4}>{site.description}</Text>
          {site.privateProperty && <Text style={styles.notice}>Private residence · View from public areas</Text>}
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.toolLabel}>EXPLORE THIS PLACE</Text>
        <View style={styles.actions}>
          <WayfinderIconButton
            icon={playing ? 'pause' : 'play'}
            label={playing ? 'Stop audio narration for ' + site.name : 'Play audio narration for ' + site.name}
            variant="contained"
            onPress={onToggleAudio}
          />
          <WayfinderIconButton icon="information-circle-outline" label={'View details about ' + site.name} onPress={onInfo} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute', left: 16, right: 16, bottom: 105,
    borderRadius: 20, padding: 14, paddingTop: 9, borderWidth: 1,
    borderColor: wf.border, backgroundColor: wf.surface,
    shadowColor: '#172651', shadowOpacity: 0.13, shadowRadius: 14,
    shadowOffset: { width: 0, height: -4 }, elevation: 9,
  },
  grabber: { height: 4, width: 42, borderRadius: 3, backgroundColor: wf.border, alignSelf: 'center', marginBottom: 11 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 9 },
  headerText: { flex: 1, gap: 3 },
  overline: { fontSize: 10, color: wf.blue, fontWeight: '700', letterSpacing: 0.7 },
  title: { color: wf.navy, fontSize: 20, fontWeight: '700' },
  address: { color: wf.muted, fontSize: 11 },
  contentRow: { flexDirection: 'row', gap: 12, marginTop: 13, alignItems: 'flex-start' },
  photoFrame: { width: 116, height: 112, borderRadius: 12, overflow: 'hidden', backgroundColor: wf.lightBlue },
  photo: { width: '100%', height: '100%' },
  copy: { flex: 1 },
  description: { color: wf.ink, fontSize: 12, lineHeight: 18 },
  notice: { color: '#A84A30', fontSize: 11, marginTop: 6, lineHeight: 15 },
  footer: { marginTop: 12, borderTopWidth: 1, borderTopColor: wf.border, paddingTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toolLabel: { color: wf.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  actions: { flexDirection: 'row', gap: 9 },
});
