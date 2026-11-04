# In-app guided tour demo

Select **Try a guided audio tour** from the app home screen.

1. Enter your starting street address. The address exists only in memory while the screen is open, not the public repository or persistent storage.
2. Select Walk, Bike, or Drive.
3. Tap **Start guided tour**. Native geocoding finds the start and Old Town Hall at 16 South Road, Bedford MA. The app requests a street-based route and maneuvers from Valhalla's public demo server.
4. The map, route line, steps and audio player stay **inside Bedford Wayfinder**. Select Previous/Next to preview directions. No Google Maps handoff.
5. Tap Play sample audio and hear: "We are passing Historical Point 1. This is a sample audio."

## Not implemented yet
This is an in-app route **preview**, not GPS-following navigation. Directions do not automatically advance or reroute with live position. Historical narration does not automatically trigger on proximity or pause for spoken turns. A production tour needs these features plus background audio handling and real-device testing.

## Services and privacy
- Native Expo Location geocoding on Android requires foreground location permission. The OS geocoding provider may process the supplied address.
- Route coordinates are transmitted to Valhalla's public demo endpoint. This is fair-use, rate-limited **for prototyping only** and not suitable for 500 parallel users.
- Override EXPO_PUBLIC_VALHALLA_URL with a managed Valhalla routing endpoint for production.
- The base map uses OpenFreeMap for testing unless EXPO_PUBLIC_MAP_STYLE_URL is specified.
- No added native dependencies. Installed Expo dev-clients should load the JavaScript changes without rebuilding.
- Destination source: https://www.bedfordma.gov/824/Buildings
