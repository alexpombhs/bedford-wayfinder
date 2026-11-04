/** Destination sourced from Bedford's published municipal buildings directory. */
export const DEMO_DESTINATION = {
  name: 'Old Town Hall',
  address: '16 South Road, Bedford, MA 01730',
  reference: 'https://www.bedfordma.gov/824/Buildings',
} as const;

export const SAMPLE_NARRATION = 'We are passing Historical Point 1. This is a sample audio.';
export type DirectionsMode = 'walking' | 'cycling' | 'driving';
