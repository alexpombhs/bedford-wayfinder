# Architecture and release checklist

## Request patterns
- On app open, fetch published historical sites once; add on-device caching before a public launch.
- Never send continuous GPS updates to Supabase; position and proximity alerts should be device-side.
- Precompute and cache official-tour route geometry. Send custom routes through an authenticated, rate-limited edge/backend proxy and monitor quotas.
- The mobile application must never contain the routing service's secret API key.

## 500 concurrent users
500 simultaneous sessions is a performance goal, not guaranteed by a free tier. Load-test map tiles, location reads, Supabase response capacity, custom-route rate limits, media download size, and routing-provider concurrency. Use caching/CDNs, monitoring and provider upgrades if required.

## Before publishing
- Replace demo pin with verified geographic coordinates and cite each historical statement and media license.
- Configure your own production MapLibre-compatible tiles/style; demo tiles are not for production.
- Create an Expo development build (MapLibre is unavailable in Expo Go).
- Add a secured routing proxy, distinguish estimated walking/biking/driving paths from turn-by-turn navigation and test route safety.
- Validate accessibility, permissions, offline behavior, device background audio and actual iOS/Android devices.
- Add consent/privacy documentation if accounts or analytics are introduced.
- Implement an authenticated, scoped editorial admin rather than disabling write protections.

## UX
The starter uses editable palette tokens. Replace them with the confirmed Bedford Wayfinder Figma colors (including its red accent and 60/30/10 distribution) when design specs are finalized.
