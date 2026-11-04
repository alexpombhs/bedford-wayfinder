export type TravelMode = 'walking' | 'cycling' | 'driving';
export type LngLat = [longitude: number, latitude: number];
export type RouteResult = { coordinates: LngLat[]; durationSeconds: number; distanceMeters: number };

/** Routes are computed by a backend proxy that holds the provider secret, not from the app directly. */
export async function requestRoute(stops: LngLat[], mode: TravelMode): Promise<RouteResult> {
  if (stops.length < 2) throw new Error('Select at least two locations to build a route.');
  const endpoint = process.env.EXPO_PUBLIC_ROUTE_PROXY_URL;
  if (!endpoint) throw new Error('Live route calculation is not configured. Add a secure routing endpoint first.');
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stops, mode }) });
  if (!response.ok) throw new Error('Routing is unavailable right now.');
  return (await response.json()) as RouteResult;
}
