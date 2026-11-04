import * as Location from 'expo-location';
import { DEMO_DESTINATION, type DirectionsMode } from './demoTour';

export type LngLat = [longitude: number, latitude: number];
export type RouteStep = { instruction: string; beginShapeIndex: number };
export type PlannedRoute = { points: LngLat[]; steps: RouteStep[]; lengthKm: number; timeSeconds: number };

export async function geocodeAddress(address: string): Promise<LngLat> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== 'granted') throw new Error('Please allow location access to look up addresses on Android.');
  const results = await Location.geocodeAsync(address);
  if (!results.length) throw new Error('Address not found. Include the town and ZIP code.');
  return [results[0].longitude, results[0].latitude];
}

export async function geocodeOrigin(origin: string): Promise<LngLat> {
  if (!origin.trim()) throw new Error('Enter your starting address.');
  const address = /bedford|, *ma\b/i.test(origin) ? origin.trim() : origin.trim() + ', Bedford, MA';
  return geocodeAddress(address);
}

export function decodePolyline6(shape: string): LngLat[] {
  let lat = 0, lon = 0, cursor = 0;
  const points: LngLat[] = [];
  function read(): number {
    let value = 0, shift = 0;
    while (cursor < shape.length) {
      const b = shape.charCodeAt(cursor++) - 63;
      if (b < 0 || b > 63 || shift > 30) throw new Error('Invalid route geometry.');
      value |= (b & 31) << shift;
      if (b < 32) return (value & 1) ? ~(value >> 1) : value >> 1;
      shift += 5;
    }
    throw new Error('Incomplete route geometry.');
  }
  while (cursor < shape.length) {
    lat += read();
    lon += read();
    points.push([lon / 1e6, lat / 1e6]);
  }
  return points;
}

export async function planInAppRoute(from: LngLat, to: LngLat, mode: DirectionsMode): Promise<PlannedRoute> {
  const url = process.env.EXPO_PUBLIC_VALHALLA_URL || 'https://valhalla1.openstreetmap.de/route';
  const costing = mode === 'walking' ? 'pedestrian' : mode === 'cycling' ? 'bicycle' : 'auto';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18000);
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Client-Id': 'bedford-wayfinder-student-demo' },
      body: JSON.stringify({ locations: [{ lat: from[1], lon: from[0] }, { lat: to[1], lon: to[0] }], costing, units: 'kilometers', language: 'en-US' }),
      signal: controller.signal,
    });
  } catch {
    throw new Error('Could not reach the demo routing server. Check your network and try again.');
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) throw new Error(response.status === 429 ? 'Demo routing service is busy; try again later.' : 'No route found. Check the start and destination.');
  const json = await response.json();
  const leg = json?.trip?.legs?.[0];
  if (!leg || typeof leg.shape !== 'string') throw new Error('The route response was incomplete.');
  const points = decodePolyline6(leg.shape);
  if (points.length < 2) throw new Error('The route has no path to display.');
  const steps: RouteStep[] = (Array.isArray(leg.maneuvers) ? leg.maneuvers : [])
    .filter((m: any) => typeof m.instruction === 'string')
    .map((m: any) => ({ instruction: m.instruction, beginShapeIndex: Number(m.begin_shape_index) || 0 }));
  return { points, steps, lengthKm: Number(json.trip.summary?.length) || 0, timeSeconds: Number(json.trip.summary?.time) || 0 };
}

export async function planRouteFromAddress(origin: string, mode: DirectionsMode) {
  const from = await geocodeOrigin(origin);
  const to = await geocodeAddress(DEMO_DESTINATION.address);
  const route = await planInAppRoute(from, to, mode);
  return { from, to, route };
}
