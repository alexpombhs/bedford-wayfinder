import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as DevClient from 'expo-dev-client';
import { SitesProvider } from '../src/context/SitesContext';
import { BottomNavigation } from '../src/components/BottomNavigation';
import { colors } from '../src/theme';

export default function RootLayout() {
  useEffect(() => {
    // Floating Expo development menu is not part of Wayfinder navigation.
    if (__DEV__) DevClient.setToolsButtonVisible(false);
  }, []);
  return <SafeAreaProvider><SitesProvider><View style={{ flex: 1 }}>
    <Stack screenOptions={{
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.ink,
      contentStyle: { backgroundColor: colors.background },
    }}>
      <Stack.Screen name="index" options={{ title: 'Bedford Wayfinder' }} />
      <Stack.Screen name="demo-tour" options={{ title: 'Guided tour' }} />
      <Stack.Screen name="map" options={{ title: 'Explore map' }} />
      <Stack.Screen name="tours" options={{ title: 'Build a tour' }} />
      <Stack.Screen name="site/[id]" options={{ title: 'Historical site' }} />
      <Stack.Screen name="saved" options={{ title: 'Saved tours' }} />
      <Stack.Screen name="more" options={{ title: 'More' }} />
    </Stack>
    <BottomNavigation />
  </View></SitesProvider></SafeAreaProvider>;
}
