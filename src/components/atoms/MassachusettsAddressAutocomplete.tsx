import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import type { LngLat } from '../../services/inAppRouting';
import { wf } from '../WayfinderUI';

/**
 * Atomic location-picker adapter for Expo React Native, using MUI-style
 * TextField/Autocomplete behaviors without web-only @mui/material.
 * Photon searches are spatially bounded and then filtered to Massachusetts.
 */
export type MassachusettsAddress = { label: string; coordinates: LngLat };

type PhotonFeature = {
  geometry?: { coordinates?: [number, number] };
  properties?: {
    name?: string; housenumber?: string; street?: string;
    city?: string; state?: string; postcode?: string; country?: string;
  };
};

const endpoint = 'https://photon.komoot.io/api/';
const bounds = [-73.51, 41.18, -69.92, 42.90] as const;
const isMassachusetts = (feature: PhotonFeature) => {
  const state = feature.properties?.state?.trim().toLowerCase();
  const [lon, lat] = feature.geometry?.coordinates ?? [];
  return (state === 'massachusetts' || state === 'ma') &&
    Number.isFinite(lon) && Number.isFinite(lat) &&
    lon >= bounds[0] && lon <= bounds[2] &&
    lat >= bounds[1] && lat <= bounds[3];
};

function formatResult(feature: PhotonFeature) {
  const p = feature.properties ?? {};
  const street = [p.housenumber, p.street].filter(Boolean).join(' ').trim();
  const pieces = [street || p.name, p.city, 'MA', p.postcode].filter(Boolean);
  return [...new Set(pieces)].join(', ');
}

export function MassachusettsAddressAutocomplete({
  value, onChangeText, onSelect, selected,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onSelect: (choice: MassachusettsAddress) => void;
  selected: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<MassachusettsAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const sequence = useRef(0);

  useEffect(() => {
    const requestId = ++sequence.current;
    if (!focused || selected || value.trim().length < 3) {
      setResults([]);
      setMessage('');
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setMessage('');
      try {
        const params = new URLSearchParams({
          q: value.trim(), lon: '-71.276', lat: '42.4906',
          bbox: bounds.join(','), countrycode: 'US', limit: '10', lang: 'en',
        });
        const response = await fetch(endpoint + '?' + params.toString(), { signal: controller.signal });
        if (!response.ok) throw new Error('Search temporarily unavailable');
        const data: { features?: PhotonFeature[] } = await response.json();
        if (requestId !== sequence.current) return;
        const filtered = (data.features ?? [])
          .filter(isMassachusetts)
          .map(feature => ({ label: formatResult(feature), coordinates: feature.geometry!.coordinates! as LngLat }))
          .filter(item => !!item.label);
        const unique = filtered.filter((item, index, array) => array.findIndex(other => other.label === item.label) === index);
        setResults(unique.slice(0, 6));
        if (!unique.length) setMessage('No Massachusetts matches found. Try a street, town, or landmark name.');
      } catch {
        if (!controller.signal.aborted && requestId === sequence.current) {
          setResults([]);
          setMessage('Address suggestions are unavailable. Please try again.');
        }
      } finally {
        if (requestId === sequence.current) setLoading(false);
      }
    }, 350);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [focused, selected, value]);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.field, focused && styles.focusField]}>
        <Ionicons name="search-outline" color={wf.primary} size={20} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search Massachusetts addresses or landmarks"
          placeholderTextColor={wf.muted}
          autoCapitalize="words"
          autoCorrect={false}
          accessibilityLabel="Search Massachusetts starting location"
        />
        {selected && <Ionicons name="checkmark-circle" color={wf.blue} size={20} />}
      </View>
      {focused && !selected && value.trim().length >= 3 && (
        <View style={styles.results}>
          {loading && (
            <View style={styles.status}>
              <ActivityIndicator size="small" color={wf.blue} />
              <Text style={styles.message}>Searching Massachusetts…</Text>
            </View>
          )}
          {!loading && results.map((choice, index) => (
            <Pressable
              key={choice.label + index}
              accessibilityRole="button"
              accessibilityLabel={'Choose ' + choice.label}
              style={styles.result}
              onPress={() => {
                onSelect(choice);
                setResults([]);
                setFocused(false);
              }}
            >
              <Ionicons name="location-outline" color={wf.blue} size={19} />
              <Text style={styles.resultText} numberOfLines={2}>{choice.label}</Text>
            </Pressable>
          ))}
          {!loading && !!message && <Text style={styles.message}>{message}</Text>}
        </View>
      )}
      <Text style={styles.help}>Select a suggestion to set your starting point in Massachusetts.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  field: { flexDirection: 'row', alignItems: 'center', gap: 9, height: 48, borderRadius: 12, borderWidth: 1, borderColor: wf.border, backgroundColor: wf.surface, paddingHorizontal: 12 },
  focusField: { borderColor: wf.blue },
  input: { flex: 1, minWidth: 0, fontSize: 14, color: wf.ink, paddingVertical: 0 },
  results: { backgroundColor: wf.surface, borderWidth: 1, borderColor: wf.border, borderRadius: 12, overflow: 'hidden' },
  status: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 },
  result: { minHeight: 46, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: wf.border, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 9 },
  resultText: { flex: 1, color: wf.ink, fontSize: 13, lineHeight: 18 },
  message: { color: wf.muted, fontSize: 12, lineHeight: 18, padding: 8 },
  help: { color: wf.muted, fontSize: 11, lineHeight: 15 },
});
