export type HistoricalSite = { id: string; name: string; description: string; latitude: number; longitude: number; sourceUrl?: string };
// DEMONSTRATION ONLY: verify the map pin, text, and source before publishing historical content.
export const seedSites: HistoricalSite[] = [
  { id: 'demo-bedford', name: 'Bedford historical-site demo', description: 'This is placeholder narration. Add a sourced history of this location before publishing.', latitude: 42.4906, longitude: -71.2760 },
];
