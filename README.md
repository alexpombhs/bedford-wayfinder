# Bedford Wayfinder

An Expo + TypeScript mobile starter for exploring Bedford, Massachusetts historical sites by walking, biking or driving.

## Features in this starter
- MapLibre map with historical-site pins and site detail screens
- Browse places and hear site descriptions with device text-to-speech
- Choose stops and walking/cycling/driving modes for a tour
- Routing service adapter (requires your own openrouteservice key/backend before live routes)
- Optional Supabase Postgres/PostGIS schema, with row-level security
- Centralized colors/tokens for implementing the Figma design

**The included site is illustrative only. Its text and map pin are not verified historical records.** Replace the seed data with researched sites and citations before launch.

## Getting started

Requires Node 20+ and Android Studio / Xcode for native builds.

```bash
npm install
npx expo install --fix
cp .env.example .env.local
npx expo run:android
# or on macOS: npx expo run:ios
```

MapLibre uses native code: **Expo Go cannot display the map**. Use a development build, not Expo Go. To use EAS, install eas-cli and configure a project first.

For local experiments the fallback map style uses MapLibre demo tiles; **not for production use**. Add a MapTiler style URL to `EXPO_PUBLIC_MAP_STYLE_URL` before launch. Client-visible keys are public: restrict them at provider level. Do not put a private routing API key in an `EXPO_PUBLIC_` variable.

### Supabase
Run `supabase/migrations/0001_initial.sql` in your own Supabase project. Populate locations with sourced facts and real coordinates. Until a Supabase URL and anon/publishable key are supplied, the app uses its clearly marked illustrative seed site.

### Navigation and routing
This starter chooses stops and mode but **does not claim live turn-by-turn navigation**. The adapter in `src/services/routing.ts` prepares for routing through a secured server-side endpoint. Do not expose an openrouteservice secret in mobile builds. Directions, traffic-aware driving, offline downloads, and reliable spoken turn-by-turn instructions require additional implementation and field testing.

### Scaling
Cache rarely changing site data locally; do not upload GPS updates continuously. Use published tour geometries and server-side routing cache. Budget/testing for 500 simultaneous users must include tile sessions, route-service quotas, Supabase egress, and real load tests; free tiers are not a 500-concurrent-user guarantee.

### Folder structure
- `app/` Expo Router screens
- `src/` sample site data, design tokens, backend and route adapters
- `supabase/migrations/` database schema
- `docs/` rollout and security notes

## Development checks
```bash
npm run typecheck
```

Do not commit `.env.local` or API secrets.
