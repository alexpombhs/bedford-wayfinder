import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SitesProvider } from '../src/context/SitesContext';
import { TourProvider } from '../src/context/TourContext';
import { AudioTourProvider } from '../src/context/AudioTourContext';
import { PersistentAudioPlayer } from '../src/components/organisms/PersistentAudioPlayer';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <SitesProvider>
      <TourProvider>
        <AudioTourProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
          <PersistentAudioPlayer />
        </AudioTourProvider>
      </TourProvider>
    </SitesProvider>
  );
}
