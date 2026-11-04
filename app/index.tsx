import React from 'react';
import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '../src/theme';
import { useSites } from '../src/context/SitesContext';
export default function Home() {
  const { sites, loading, error } = useSites();
  return <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.eyebrow}>BEDFORD / WAYFINDER</Text>
    <Text style={styles.hero}>Historic Trails</Text>
    <Text style={styles.body}>Explore Bedford one story at a time. Plan a route and listen to history along the way.</Text>
    <Link href="/demo-tour" style={styles.primary}>Try a guided audio tour →</Link>
    <Text style={styles.caption}>Sample directions + spoken narration</Text>
    <Link href="/tours" style={styles.secondary}>Build your own tour →</Link>
    <Link href="/map" style={styles.secondary}>Explore the map →</Link>
    <Text style={styles.label}>HISTORICAL PLACES</Text>
    {loading ? <Text>Loading sites…</Text> : error ? <Text>Couldn't load sites: {error}</Text> : sites.map((site) =>
      <Link key={site.id} href={{ pathname: '/site/[id]', params: { id: site.id } }} style={styles.card}>{site.name} →</Link>
    )}
    <Text style={styles.note}>The starter's original historical-site data is illustrative. Verify locations and historical sources before publishing.</Text>
  </ScrollView>;
}
const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.md, backgroundColor: '#F8FAF8', flexGrow: 1 },
  eyebrow: { color: '#194A41', fontWeight: '700', letterSpacing: 2 },
  hero: { fontSize: 34, fontWeight: '700', color: '#1E2C2B' },
  body: { fontSize: 16, lineHeight: 26, color: '#667973' },
  primary: { overflow: 'hidden', backgroundColor: '#EE2F31', color: '#fff', padding: 17, borderRadius: 12, fontWeight: '700', textAlign: 'center' },
  caption: { color: '#667973', fontSize: 12, textAlign: 'center' },
  secondary: { color: '#194A41', padding: 15, fontWeight: '700' },
  label: { color: '#667973', fontWeight: '700' },
  card: { backgroundColor: colors.surface, padding: 20, borderWidth: 1, borderColor: '#DAE3DC', borderRadius: 12, color: '#1E2C2B', fontSize: 17 },
  note: { color: '#667973', fontSize: 12, marginTop: 24 },
});
