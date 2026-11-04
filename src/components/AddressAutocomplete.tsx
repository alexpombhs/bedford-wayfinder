import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { LngLat } from '../services/inAppRouting';

export type AddressChoice = { label: string; coordinates: LngLat };

type PhotonFeature = {
  geometry?: { coordinates?: [number, number] };
  properties?: { name?: string; housenumber?: string; street?: string; city?: string; state?: string; postcode?: string; country?: string };
};

const endpoint = 'https://photon.komoot.io/api/';
function formatResult(feature: PhotonFeature): string {
  const p = feature.properties || {};
  const street = [p.housenumber, p.street].filter(Boolean).join(' ').trim();
  const parts = [street || p.name, p.city, p.state, p.postcode].filter(Boolean);
  return [...new Set(parts)].join(', ');
}

export function AddressAutocomplete({
  value, onChangeText, onSelect, selected,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onSelect: (address: AddressChoice) => void;
  selected: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<AddressChoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const sequence = useRef(0);

  useEffect(() => {
    const id = ++sequence.current;
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
          q: value.trim(), lat: '42.4906', lon: '-71.2760',
          limit: '6', lang: 'en',
        });
        const response = await fetch(endpoint + '?' + params.toString(), { signal: controller.signal });
        if (!response.ok) throw new Error('Autocomplete unavailable');
        const data = await response.json();
        if (sequence.current !== id) return;
        const features: PhotonFeature[] = Array.isArray(data.features) ? data.features : [];
        const items = features
          .filter(f => f.geometry?.coordinates?.length === 2)
          .map(f => ({
            label: formatResult(f),
            coordinates: f.geometry!.coordinates! as LngLat,
          }))
          .filter(f => f.label.length > 0);
        setResults(items);
        if (!items.length) setMessage('No matches yet. Add the town or ZIP code.');
      } catch {
        if (!controller.signal.aborted && sequence.current === id) {
          setResults([]);
          setMessage('Address suggestions unavailable. You can still type your full address.');
        }
      } finally {
        if (sequence.current === id) setLoading(false);
      }
    }, 450);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [focused, selected, value]);

  return <View style={styles.wrapper}>
    <TextInput style={styles.input}
      placeholder="Search for a street address"
      placeholderTextColor="#667973"
      value={value}
      onChangeText={onChangeText}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      autoCapitalize="words" autoCorrect={false}
      accessibilityLabel="Starting address"
      returnKeyType="done"
    />
    {focused && !selected && value.trim().length >= 3 && <View style={styles.results}>
      {loading && <View style={styles.status}><ActivityIndicator size="small" color="#194A41" /><Text style={styles.hint}>Searching addresses…</Text></View>}
      {!loading && results.map((item, index) =>
        <Pressable key={item.label + index} accessibilityRole="button"
          style={styles.item}
          onPress={() => { onSelect(item); setResults([]); setFocused(false); }}
          >
          <Text style={styles.icon}>⌖</Text><Text style={styles.itemText}>{item.label}</Text>
        </Pressable>
      )}
      {!loading && !!message && <Text style={styles.hint}>{message}</Text>}
    </View>}
    <Text style={styles.privacy}>Suggestions use Photon (OpenStreetMap). Your search text is sent to its public server; don't use it for production without a managed service.</Text>
  </View>;
}
const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  input: { height: 48, borderWidth: 1, borderColor: '#DAE3DC', borderRadius: 12, paddingHorizontal: 12, fontSize: 15, color: '#1E2C2B', backgroundColor: '#fff' },
  results: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#DAE3DC', borderRadius: 12, overflow: 'hidden' },
  item: { minHeight: 48, paddingHorizontal: 12, paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#DAE3DC', flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemText: { fontSize: 14, lineHeight: 19, color: '#1E2C2B', flexShrink: 1 },
  icon: { fontSize: 20, color: '#194A41' },
  status: { flexDirection: 'row', padding: 12, gap: 10, alignItems: 'center' },
  hint: { fontSize: 12, lineHeight: 18, color: '#667973', padding: 8 },
  privacy: { fontSize: 11, lineHeight: 16, color: '#667973' },
});
