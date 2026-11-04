/** Demonstration destination verified against Bedford's published municipal buildings directory. */
export const DEMO_DESTINATION = {
  name: 'Old Town Hall',
  address: '16 South Road, Bedford, MA 01730',
  reference: 'https://www.bedfordma.gov/824/Buildings',
} as const;

export const SAMPLE_NARRATION = 'We are passing Historical Point 1. This is a sample audio.';

export type DirectionsMode = 'walking' | 'cycling' | 'driving';

/**
 * Uses the maps app for actual route calculation. There are intentionally no
 * guessed coordinates, fake road geometry, or fabricated turn instructions.
 */
export function buildDirectionsUrl(origin: string, mode: DirectionsMode): string {
  const params = [
    'api=1',
    'origin=' + encodeURIComponent(origin.trim() + ', Bedford, MA'),
    'destination=' + encodeURIComponent(DEMO_DESTINATION.address),
    'travelmode=' + encodeURIComponent(mode === 'cycling' ? 'bicycling' : mode),
  ];
  return 'https://www.google.com/maps/dir/?' + params.join('&');
}
