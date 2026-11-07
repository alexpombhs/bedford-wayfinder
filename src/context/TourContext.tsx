import React, { createContext, useContext, useState } from 'react';
import * as Location from 'expo-location';
import { TOUR_SITES, type TourSite } from '../data/tourSites';
import { geocodeOrigin, planInAppRoute, type LngLat, type PlannedRoute } from '../services/inAppRouting';
import type { DirectionsMode } from '../services/demoTour';

export type LocatedSite = TourSite;
export type TourLeg = { destination: LocatedSite; route: PlannedRoute };
export type TourPlan = {
  start: LngLat;
  startLabel: string;
  mode: DirectionsMode;
  legs: TourLeg[];
  distanceKm: number;
  durationSeconds: number;
  coordinates: LngLat[];
};

type ContextValue = {
  sites: LocatedSite[];
  plan: TourPlan | null;
  busy: boolean;
  progress: string;
  error: string | null;
  locateSites: () => Promise<LocatedSite[]>;
  createTour: (address: string, mode: DirectionsMode, useCurrentLocation: boolean, selectedIds: string[]) => Promise<boolean>;
};

const TourContext = createContext<ContextValue | null>(null);
const haversine = (a: LngLat, b: LngLat) => {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const dLat = radians(b[1] - a[1]);
  const dLon = radians(b[0] - a[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a[1])) * Math.cos(radians(b[1])) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
};

function nearestFirst(origin: LngLat, sites: LocatedSite[]) {
  const remaining = [...sites];
  const result: LocatedSite[] = [];
  let current = origin;
  while (remaining.length > 0) {
    remaining.sort((a, b) => haversine(current, a.coordinate) - haversine(current, b.coordinate));
    const next = remaining.shift()!;
    result.push(next);
    current = next.coordinate;
  }
  return result;
}

export function TourProvider({ children }: { children: React.ReactNode }) {
  const sites: LocatedSite[] = TOUR_SITES;
  const [plan, setPlan] = useState<TourPlan | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Static landmark pins load instantly and without requesting GPS permission.
  // GPS permission is requested only when the user chooses My location.
  async function locateSites(): Promise<LocatedSite[]> {
    return TOUR_SITES;
  }

  async function createTour(address: string, mode: DirectionsMode, useCurrentLocation: boolean, selectedIds: string[]) {
    if (busy) return false;
    setBusy(true);
    setError(null);
    setPlan(null);
    try {
      setProgress('Finding your starting point…');
      let start: LngLat;
      let startLabel = address.trim();
      if (useCurrentLocation) {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (!permission.granted) throw new Error('Allow location access to create a tour from your current position, or enter an address.');
        const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        start = [position.coords.longitude, position.coords.latitude];
        startLabel = 'My current location';
      } else {
        if (!address.trim()) throw new Error('Enter a starting address or select My location.');
        start = await geocodeOrigin(address);
      }
      const selectedSet = new Set(selectedIds);
      const located = sites.filter((site) => selectedSet.has(site.id));
      if (located.length === 0) throw new Error('Select at least one historical location to build a tour.');
      setProgress('Preparing ' + located.length + ' historic destination' + (located.length === 1 ? '…' : 's…'));
      const ordered = nearestFirst(start, located);
      const legs: TourLeg[] = [];
      let from = start;
      for (let i = 0; i < ordered.length; i++) {
        setProgress('Finding directions to stop ' + (i + 1) + ' of ' + ordered.length + '…');
        const route = await planInAppRoute(from, ordered[i].coordinate, mode);
        legs.push({ destination: ordered[i], route });
        from = ordered[i].coordinate;
      }
      setPlan({
        start,
        startLabel,
        mode,
        legs,
        distanceKm: legs.reduce((sum, leg) => sum + leg.route.lengthKm, 0),
        durationSeconds: legs.reduce((sum, leg) => sum + leg.route.timeSeconds, 0),
        coordinates: legs.flatMap((leg, i) => i === 0 ? leg.route.points : leg.route.points.slice(1)),
      });
      setProgress('');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create the tour. Please retry.');
      setProgress('');
      return false;
    } finally {
      setBusy(false);
    }
  }

  return (
    <TourContext.Provider value={{ sites, plan, busy, progress, error, locateSites, createTour }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) throw new Error('TourProvider is missing.');
  return context;
}
