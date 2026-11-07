import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import * as Speech from 'expo-speech';
import * as Location from 'expo-location';
import { AppState, Platform } from 'react-native';
import { TOUR_SITES, type TourSite } from '../data/tourSites';
import { useTour } from './TourContext';

type AudioState = 'idle' | 'playing' | 'paused';
type AudioTourContextValue = {
  activeSite: TourSite | null;
  state: AudioState;
  progress: number;
  playerVisible: boolean;
  dismissPlayer: () => void;
  autoNarration: boolean;
  locationMessage: string | null;
  playSite: (site: TourSite) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  toggleSite: (site: TourSite) => Promise<void>;
  replay: (site: TourSite) => Promise<void>;
  enableProximity: () => Promise<void>;
  disableProximity: () => void;
};

const AudioTourContext = createContext<AudioTourContextValue | null>(null);

function distanceMeters(a: [number, number], b: [number, number]) {
  const rad = Math.PI / 180;
  const dLat = (a[1] - b[1]) * rad;
  const dLon = (a[0] - b[0]) * rad;
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dLon / 2) ** 2;
  return 12742000 * Math.asin(Math.min(1, Math.sqrt(h)));
}

function atWordBoundary(text: string, position: number) {
  const safe = Math.max(0, Math.min(text.length, position));
  // A spoken word should be replayed rather than skipped on resume.
  const prefix = text.slice(0, safe);
  const boundary = prefix.lastIndexOf(' ');
  return boundary < 0 ? 0 : boundary + 1;
}

export function AudioTourProvider({ children }: { children: React.ReactNode }) {
  const { plan } = useTour();
  const [activeSite, setActiveSite] = useState<TourSite | null>(null);
  const [state, setState] = useState<AudioState>('idle');
  const [progress, setProgress] = useState(0);
  const [playerVisible, setPlayerVisible] = useState(false);
  const dismissPlayer = useCallback(() => setPlayerVisible(false), []);
  const [autoNarration, setAutoNarration] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  const playback = useRef<{ siteId: string | null; position: number; generation: number }>({
    siteId: null, position: 0, generation: 0,
  });
  const stateRef = useRef<AudioState>('idle');
  const activeSiteRef = useRef<TourSite | null>(null);
  const progressBySite = useRef<Record<string, number>>({});
  const visited = useRef(new Set<string>());
  const nearCounts = useRef<Record<string, number>>({});
  const queued = useRef<TourSite | null>(null);
  const watcher = useRef<Location.LocationSubscription | null>(null);
  const autoEnabledRef = useRef(false);
  const planRef = useRef(plan);
  const appForeground = useRef(AppState.currentState === 'active');

  useEffect(() => { planRef.current = plan; }, [plan]);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', next => {
      appForeground.current = next === 'active';
    });
    return () => subscription.remove();
  }, []);
  const setStatus = useCallback((next: AudioState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  // Do not use Speech.pause() on Android: it is unsupported there.
  // Save the last word boundary and restart from that position using Speech.stop().
  const speakFrom = useCallback(async (site: TourSite, offset: number) => {
    const gen = ++playback.current.generation;
    await Speech.stop();
    if (gen !== playback.current.generation) return;

    const safeOffset = atWordBoundary(site.narration, offset);
    playback.current.siteId = site.id;
    playback.current.position = safeOffset;
    progressBySite.current[site.id] = safeOffset;
    activeSiteRef.current = site;
    setActiveSite(site);
    setPlayerVisible(true);
    setProgress(safeOffset / Math.max(1, site.narration.length));
    setStatus('playing');

    const remaining = site.narration.slice(safeOffset);
    if (!remaining.trim()) {
      progressBySite.current[site.id] = 0;
      setProgress(1);
      setStatus('idle');
      return;
    }
    const finish = () => {
      if (gen !== playback.current.generation) return;
      playback.current.position = site.narration.length;
      progressBySite.current[site.id] = 0;
      setProgress(1);
      setStatus('idle');
      if (queued.current) {
        const next = queued.current;
        queued.current = null;
        void speakFrom(next, progressBySite.current[next.id] ?? 0);
      }
    };
    Speech.speak(remaining, {
      language: 'en-US',
      rate: 0.9,
      onBoundary: (event: any) => {
        if (gen !== playback.current.generation) return;
        const index = typeof event?.charIndex === 'number' ? event.charIndex :
          typeof event?.nativeEvent?.charIndex === 'number' ? event.nativeEvent.charIndex : null;
        if (index == null) return;
        const position = Math.min(site.narration.length, safeOffset + Math.max(0, index));
        playback.current.position = position;
        progressBySite.current[site.id] = position;
        setProgress(position / Math.max(1, site.narration.length));
      },
      onDone: finish,
      onStopped: () => {},
      onError: () => {
        if (gen === playback.current.generation) {
          setStatus('paused');
          setLocationMessage('Audio narration was interrupted. Tap Play to resume.');
        }
      },
    });
  }, [setStatus]);

  const playSite = useCallback(async (site: TourSite) => {
    queued.current = null; // Explicit user selection takes priority over geofence audio.
    const saved = progressBySite.current[site.id] ?? 0;
    await speakFrom(site, saved);
  }, [speakFrom]);

  const pause = useCallback(async () => {
    if (stateRef.current !== 'playing') return;
    ++playback.current.generation; // invalidate any callbacks from stopped utterance
    setStatus('paused');
    await Speech.stop();
  }, [setStatus]);

  const resume = useCallback(async () => {
    const site = activeSiteRef.current;
    if (!site || stateRef.current !== 'paused') return;
    await speakFrom(site, progressBySite.current[site.id] ?? 0);
  }, [speakFrom]);

  const toggleSite = useCallback(async (site: TourSite) => {
    if (activeSiteRef.current?.id === site.id && stateRef.current === 'playing') {
      await pause();
    } else if (activeSiteRef.current?.id === site.id && stateRef.current === 'paused') {
      await resume();
    } else {
      await playSite(site);
    }
  }, [pause, resume, playSite]);

  const replay = useCallback(async (site: TourSite) => {
    progressBySite.current[site.id] = 0;
    await speakFrom(site, 0);
  }, [speakFrom]);

  const disableProximity = useCallback(() => {
    watcher.current?.remove();
    watcher.current = null;
    queued.current = null;
    autoEnabledRef.current = false;
    nearCounts.current = {};
    setAutoNarration(false);
  }, []);

  const enableProximity = useCallback(async () => {
    if (autoEnabledRef.current) return;
    if (!planRef.current?.legs.length) return;
    setLocationMessage(null);
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) {
      setLocationMessage('Allow location access to hear stories when you approach tour stops.');
      return;
    }
    autoEnabledRef.current = true;
    setAutoNarration(true);
    visited.current = new Set<string>();
    nearCounts.current = {};
    try {
      watcher.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 4000, distanceInterval: 8 },
        fix => {
          if (!appForeground.current || !autoEnabledRef.current) return;
          if (fix.coords.accuracy != null && fix.coords.accuracy > 65) return;
          const current = planRef.current;
          if (!current) return;
          const here: [number, number] = [fix.coords.longitude, fix.coords.latitude];
          for (const leg of current.legs) {
            const site = leg.destination;
            if (visited.current.has(site.id)) continue;
            const close = distanceMeters(here, site.coordinate) <= 50;
            nearCounts.current[site.id] = close ? (nearCounts.current[site.id] ?? 0) + 1 : 0;
            if (nearCounts.current[site.id] < 2) continue;
            visited.current.add(site.id);
            if (stateRef.current === 'playing') {
              // Never interrupt a story already being told.
              if (!queued.current) queued.current = site;
            } else if (stateRef.current !== 'paused') {
              void speakFrom(site, progressBySite.current[site.id] ?? 0);
            }
            break;
          }
        },
        error => setLocationMessage(error),
      );
      if (!autoEnabledRef.current) watcher.current?.remove();
    } catch {
      disableProximity();
      setLocationMessage('Unable to start proximity narration. Please check location settings.');
    }
  }, [disableProximity, speakFrom]);

  useEffect(() => () => {
    watcher.current?.remove();
    ++playback.current.generation;
    void Speech.stop();
  }, []);

  return (
    <AudioTourContext.Provider value={{
      activeSite, state, progress, playerVisible, dismissPlayer, autoNarration, locationMessage,
      playSite, pause, resume, toggleSite, replay, enableProximity, disableProximity,
    }}>
      {children}
    </AudioTourContext.Provider>
  );
}

export function useAudioTour() {
  const value = useContext(AudioTourContext);
  if (!value) throw new Error('AudioTourProvider is required.');
  return value;
}
