import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Stack } from 'expo-router';
import { Camera, GeoJSONSource, Layer, Map, Marker } from '@maplibre/maplibre-react-native';
import type { CameraRef } from '@maplibre/maplibre-react-native';
import * as Speech from 'expo-speech';
import { DEMO_DESTINATION, SAMPLE_NARRATION, type DirectionsMode } from '../src/services/demoTour';
import { planRouteFromAddress, type LngLat, type PlannedRoute } from '../src/services/inAppRouting';
import { AddressAutocomplete, type AddressChoice } from '../src/components/AddressAutocomplete';

const c = { bg: '#F8FAF8', green: '#194A41', red: '#EE2F31', muted: '#667973', ink: '#1E2C2B', border: '#DAE3DC', pale: '#EEF4F0' };
const styleUrl = process.env.EXPO_PUBLIC_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/liberty';

export default function DemoTour() {
  const [origin, setOrigin] = useState('');
  const [addressChoice, setAddressChoice] = useState<AddressChoice | null>(null);
  const [mode, setMode] = useState<DirectionsMode>('walking');
  const [route, setRoute] = useState<PlannedRoute | null>(null);
  const [from, setFrom] = useState<LngLat | null>(null);
  const [to, setTo] = useState<LngLat | null>(null);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const camera = useRef<CameraRef>(null);

  useEffect(() => () => { void Speech.stop(); }, []);

  async function startRoute() {
    setBusy(true);
    setError('');
    setRoute(null);
    await Speech.stop();
    setSpeaking(false);
    try {
      const result = await planRouteFromAddress(origin, mode, addressChoice?.coordinates);
      setFrom(result.from);
      setTo(result.to);
      setRoute(result.route);
      setStep(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not plan the route.');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!route) return;
    const lons = route.points.map(p => p[0]);
    const lats = route.points.map(p => p[1]);
    const timer = setTimeout(() => {
      camera.current?.fitBounds([Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)], { duration: 400, padding: { top: 35, bottom: 35, left: 35, right: 35 } });
    }, 500);
    return () => clearTimeout(timer);
  }, [route]);

  async function play() {
    await Speech.stop();
    setSpeaking(true);
    Speech.speak(SAMPLE_NARRATION, {
      language: 'en-US', rate: 0.9,
      onDone: () => setSpeaking(false), onStopped: () => setSpeaking(false), onError: () => setSpeaking(false),
    });
  }
  async function stop() { await Speech.stop(); setSpeaking(false); }

  const geometry = route ? { type: 'Feature' as const, properties: {}, geometry: { type: 'LineString' as const, coordinates: route.points } } : null;
  const travelMinutes = route ? Math.round(route.timeSeconds / 60) : 0;
  const distanceMiles = route ? (route.lengthKm * 0.621371).toFixed(1) : '';
  const current = route?.steps[step];

  return <View style={s.root}>
    <Stack.Screen options={{ title: 'Guided audio tour' }} />
    <ScrollView contentContainerStyle={s.page}>
      <Text style={s.overline}>BEDFORD / WAYFINDER</Text>
      <Text style={s.heading}>{route ? 'Tour in progress' : 'Plan a guided tour'}</Text>
      <Text style={s.muted}>Directions and historical audio stay together in Wayfinder.</Text>

      {!route && <View style={s.panel}>
        <Text style={s.label}>STARTING POINT</Text>
        <AddressAutocomplete value={origin} selected={!!addressChoice}
          onChangeText={text => { setOrigin(text); setAddressChoice(null); }}
          onSelect={choice => { setOrigin(choice.label); setAddressChoice(choice); }} />
        <Text style={s.small}>Your address is not stored in Wayfinder. When starting a route, coordinates are sent to the routing provider.</Text>
        <Text style={s.label}>DESTINATION · HISTORICAL POINT 1</Text>
        <View style={s.row}>
          <View style={s.redMarker}><Text style={s.white}>01</Text></View>
          <View style={s.flex}><Text style={s.bold}>{DEMO_DESTINATION.name}</Text><Text style={s.small}>{DEMO_DESTINATION.address}</Text></View>
        </View>
        <Text style={s.label}>TRAVEL MODE</Text>
        <View style={s.row}>{(['walking','cycling','driving'] as const).map(m =>
          <Pressable key={m} style={[s.mode,mode===m&&s.active]} onPress={() => setMode(m)}
            accessibilityRole="button" accessibilityState={{selected:mode===m}}>
            <Text style={[s.bold,mode===m&&s.white]}>{m==='walking'?'Walk':m==='cycling'?'Bike':'Drive'}</Text>
          </Pressable>
        )}</View>
        <Pressable style={[s.cta,busy&&s.disabled]} disabled={busy} onPress={() => void startRoute()} accessibilityRole="button">
          {busy ? <ActivityIndicator color="white" /> : <Text style={s.white}>Start guided tour →</Text>}
        </Pressable>
        {!!error && <Text style={s.error}>{error}</Text>}
      </View>}

      <View style={s.mapPanel}>
        <View style={s.rowBetween}><Text style={s.label}>ROUTE MAP</Text><Text style={s.small}>Bedford, MA</Text></View>
        <View style={s.mapBox}>
          <Map style={StyleSheet.absoluteFill} mapStyle={styleUrl}>
            <Camera ref={camera} initialViewState={{center:[-71.276,42.4906],zoom:12.5}} />
            {geometry && <GeoJSONSource id="tour-shape" data={geometry}>
              <Layer id="tour-route" source="tour-shape" type="line" paint={{'line-color':c.green,'line-width':5,'line-opacity':0.95}} />
            </GeoJSONSource>}
            {from && <Marker id="tour-start" lngLat={from}><View style={s.startMarker}><Text style={s.white}>S</Text></View></Marker>}
            {to && <Marker id="tour-end" lngLat={to}><View style={s.endMarker}><Text style={s.white}>1</Text></View></Marker>}
          </Map>
        </View>
        <Text style={s.small}>{route ? distanceMiles+' miles · about '+travelMinutes+' min · '+mode : 'Enter an address to see the street-based route.'}</Text>
      </View>

      {route && <View style={s.panel}>
        <View style={s.rowBetween}><Text style={s.label}>DIRECTIONS</Text><Text style={s.small}>Step {step+1} of {route.steps.length}</Text></View>
        <View style={s.direction}>
          <Text style={s.directionText}>{current?.instruction || 'Follow the route on the map.'}</Text>
          <Text style={s.directionNote}>Route preview — directions do not advance automatically with GPS yet.</Text>
        </View>
        <View style={s.row}>
          <Pressable style={s.secondary} disabled={step===0} onPress={() => setStep(Math.max(0,step-1))} accessibilityRole="button">
            <Text style={s.green}>‹ Previous</Text>
          </Pressable>
          <Pressable style={s.secondary} disabled={step>=route.steps.length-1} onPress={() => setStep(Math.min(route.steps.length-1,step+1))} accessibilityRole="button">
            <Text style={s.green}>Next direction ›</Text>
          </Pressable>
        </View>
      </View>}

      <View style={s.panel}>
        <Text style={s.label}>♪ HISTORICAL POINT 1 · AUDIO STORY</Text>
        <Text style={s.bold}>{DEMO_DESTINATION.name}</Text>
        <Text style={s.sample}>“{SAMPLE_NARRATION}”</Text>
        <View style={s.row}>
          <Pressable style={s.audio} accessibilityRole="button" onPress={() => void (speaking ? stop() : play())}>
            <Text style={s.white}>{speaking ? '■ Stop audio' : '▶ Play sample audio'}</Text>
          </Pressable>
          <Pressable style={s.secondary} accessibilityRole="button" onPress={() => void play()}><Text style={s.green}>Replay</Text></Pressable>
        </View>
        <Text style={s.small}>Manual narration for testing. Automatic proximity audio is a later feature.</Text>
      </View>

      {!!route && <Pressable style={s.endTour} onPress={() => { void stop(); setRoute(null); setFrom(null); setTo(null); }} accessibilityRole="button">
        <Text style={s.green}>Edit starting point or mode</Text>
      </Pressable>}
      <Text style={s.small}>Prototype: verify routes and crossings before travel. Public demo routing is rate limited, not production navigation.</Text>
    </ScrollView>
  </View>;
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:c.bg},page:{padding:20,gap:13,paddingBottom:36},
  overline:{fontSize:12,fontWeight:'700',letterSpacing:1.5,color:c.green},
  heading:{fontSize:28,fontWeight:'700',color:c.ink},
  muted:{fontSize:14,lineHeight:21,color:c.muted},
  panel:{borderColor:c.border,borderWidth:1,backgroundColor:'white',padding:15,borderRadius:12,gap:12},
  label:{fontSize:11,fontWeight:'700',letterSpacing:1,color:c.muted},
  input:{height:48,borderWidth:1,borderColor:c.border,borderRadius:12,paddingHorizontal:12,fontSize:15,color:c.ink},
  small:{fontSize:12,lineHeight:18,color:c.muted},
  bold:{fontSize:15,fontWeight:'700',color:c.ink},white:{fontSize:14,fontWeight:'700',color:'white'},green:{fontSize:14,fontWeight:'700',color:c.green},
  row:{flexDirection:'row',gap:10,alignItems:'center'},rowBetween:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},flex:{flex:1},
  redMarker:{backgroundColor:c.red,borderRadius:12,width:42,height:42,justifyContent:'center',alignItems:'center'},
  mode:{flex:1,borderColor:c.border,borderWidth:1,padding:12,borderRadius:12,alignItems:'center'},
  active:{backgroundColor:c.green,borderColor:c.green},
  cta:{backgroundColor:c.red,borderRadius:12,minHeight:48,justifyContent:'center',alignItems:'center'},disabled:{opacity:0.7},error:{color:'#A52027'},
  mapPanel:{padding:10,backgroundColor:c.pale,borderRadius:12,gap:9},
  mapBox:{height:310,borderRadius:10,overflow:'hidden',backgroundColor:'#DEE7DF'},
  startMarker:{width:30,height:30,borderRadius:15,backgroundColor:c.green,borderColor:'white',borderWidth:2,alignItems:'center',justifyContent:'center'},
  endMarker:{width:34,height:34,borderRadius:17,backgroundColor:c.red,borderColor:'white',borderWidth:2,alignItems:'center',justifyContent:'center'},
  direction:{backgroundColor:c.green,padding:15,borderRadius:12,gap:7},
  directionText:{fontSize:17,fontWeight:'700',color:'white'},
  directionNote:{fontSize:12,color:'#DCEBE5'},
  secondary:{borderWidth:1,borderColor:c.border,padding:12,borderRadius:12,alignItems:'center',flex:1},
  sample:{fontSize:17,lineHeight:25,color:c.ink},
  audio:{backgroundColor:c.green,borderRadius:12,padding:13,flex:2,alignItems:'center'},
  endTour:{padding:12,alignItems:'center',borderRadius:12,backgroundColor:c.pale},
});
