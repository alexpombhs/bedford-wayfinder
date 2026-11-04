import React from 'react';
import { Stack } from 'expo-router';
import { SitesProvider } from '../src/context/SitesContext';
import { colors } from '../src/theme';
export default function RootLayout() { return <SitesProvider><Stack screenOptions={{ headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.ink, contentStyle: { backgroundColor: colors.background } }}><Stack.Screen name="index" options={{ title: 'Bedford Wayfinder' }} /><Stack.Screen name="map" options={{ title: 'Explore map' }} /><Stack.Screen name="tours" options={{ title: 'Build a tour' }} /><Stack.Screen name="site/[id]" options={{ title: 'Historical site' }} /></Stack></SitesProvider>; }
