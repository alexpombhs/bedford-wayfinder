import React from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Camera, Map, Marker } from '@maplibre/maplibre-react-native';
import { useSites } from '../src/context/SitesContext';
import { colors } from '../src/theme';
const styleUrl = process.env.EXPO_PUBLIC_MAP_STYLE_URL || 'https://demotiles.maplibre.org/style.json';
export default function ExploreMap() { const { sites, error, loading } = useSites(); return <View style={styles.container}><Map style={StyleSheet.absoluteFill} mapStyle={styleUrl}><Camera initialViewState={{ center: [-71.276, 42.4906], zoom: 12.5 }} />{sites.map((site) => <Marker key={site.id} id={site.id} lngLat={[site.longitude, site.latitude]} onPress={() => router.push({ pathname: '/site/[id]', params: { id: site.id } })}><View style={styles.pin}><Text style={styles.pinText}>●</Text></View></Marker>)}</Map>{(loading || error) && <View style={styles.message}>{loading ? <ActivityIndicator /> : <Text>{error}</Text>}</View>}<View style={styles.hint}><Text style={styles.hintText}>Tap a red marker to explore a place.</Text></View></View>; }
const styles = StyleSheet.create({ container: { flex: 1 }, pin: { backgroundColor: '#fff', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.red }, pinText: { color: colors.red, fontSize: 20 }, message: { position: 'absolute', left: 10, right: 10, top: 10, backgroundColor: colors.surface, padding: 10 }, hint: { position: 'absolute', left: 18, right: 18, bottom: 24, padding: 14, borderRadius: 12, backgroundColor: colors.surface }, hintText: { color: colors.ink, textAlign: 'center' } });
