import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SitesProvider } from '../src/context/SitesContext';
import { TourProvider } from '../src/context/TourContext';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <SitesProvider>
      <TourProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
      </TourProvider>
    </SitesProvider>
  );
}
