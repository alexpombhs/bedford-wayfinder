import React from 'react';
import type { TourSite } from '../../data/tourSites';
import { useAudioTour } from '../../context/AudioTourContext';
import { WayfinderIconButton } from './WayfinderIconButton';

/**
 * One playback control for the floating player and historic-site details.
 * Both read and update the same global audio session and saved position.
 */
export function NarrationPlayPauseButton({ site, variant = 'contained' }: {
  site: TourSite;
  variant?: 'outlined' | 'contained' | 'subtle';
}) {
  const { activeSite, state, toggleSite } = useAudioTour();
  const isPlaying = activeSite?.id === site.id && state === 'playing';

  return (
    <WayfinderIconButton
      icon={isPlaying ? 'pause' : 'play'}
      variant={variant}
      label={isPlaying ? `Pause ${site.name} narration` : `Play or resume ${site.name} narration`}
      onPress={() => { void toggleSite(site); }}
    />
  );
}
