# Sample guided audio tour

The mobile home screen provides **Try a guided audio tour**.

1. Enter a starting address locally on the device (for example, your chosen Bedford address).
2. Choose walking, biking, or driving.
3. Tap **Open route directions** to launch the device's map handler with a route to **Old Town Hall, 16 South Road, Bedford, MA 01730**. The location is listed by the Town of Bedford: https://www.bedfordma.gov/824/Buildings
4. Return to the Wayfinder demo screen and tap **Play sample audio** to hear:
   > We are passing Historical Point 1. This is a sample audio.

**Important limitations:** This is a demonstration of route handoff and speech playback, not one synchronized turn-by-turn navigation session. It does not automatically play the narration based on GPS proximity and does not supply its own map route geometry or guidance. A future milestone is a proper, secured routing provider with instructions and polyline, in-app map overlays, location-triggered story playback, and speech focus/priority for navigation instructions.

The user's origin is held only in React component state until the screen is closed. It is passed to the selected external Maps provider when the user requests directions. Do not check a personal address into the public repository.

The sample uses Expo Speech already included in the project and therefore should not require a new native dependency or Android rebuild.
