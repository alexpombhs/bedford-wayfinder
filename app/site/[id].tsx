import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';
import { useSites } from '../../src/context/SitesContext';
import { colors } from '../../src/theme';
export default function SiteDetail() { const { id } = useLocalSearchParams<{ id: string }>(); const { sites } = useSites(); const site = sites.find((s) => s.id === id); if (!site) return <Text style={styles.body}>Site not found.</Text>; return <ScrollView contentContainerStyle={styles.container}><Text style={styles.kicker}>HISTORICAL PLACE</Text><Text style={styles.title}>{site.name}</Text><Text style={styles.body}>{site.description}</Text><Button title="Play audio story" color={colors.red} onPress={() => { Speech.stop(); Speech.speak(site.description, { rate: 0.95 }); }} /><Button title="Stop narration" color={colors.ink} onPress={() => Speech.stop()} />{site.sourceUrl ? <Text style={styles.body}>Historical source: {site.sourceUrl}</Text> : <Text style={styles.warning}>Demonstration content — no verified source has been added.</Text>}</ScrollView>; }
const styles = StyleSheet.create({ container: { padding: 24, gap: 20 }, kicker: { color: colors.red, letterSpacing: 2, fontWeight: '700' }, title: { fontSize: 30, fontWeight: '700', color: colors.ink }, body: { color: colors.ink, fontSize: 17, lineHeight: 27 }, warning: { color: colors.red } });
