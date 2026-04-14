# Smart Bin Mobile App

Production-ready Expo + React Native TypeScript app for a smart dustbin system with Firebase authentication, MQTT real-time updates, Google Maps routing, and staff push alerts.

## Stack

- Expo SDK 54
- React Native + TypeScript
- React Navigation (native stack + bottom tabs)
- Firebase Authentication + Firestore
- Firebase Cloud Messaging
- MQTT over WebSocket with `mqtt.js`
- Google Maps with `react-native-maps`
- Zustand state management with modular providers and services

## Features

- Email/password login with role-based routing
- STAFF and USER experiences after sign-in
- Secure profile caching with `expo-secure-store`
- Real-time MQTT subscriptions:
  - `dustbin/status`
  - `dustbin/location`
  - `dustbin/alerts`
- Shared live map with optimized markers and detail cards
- User dashboard for nearby available bins and green points
- Staff dashboard for collection queue, live alerts, and Google Maps routing
- Foreground local alert notifications for staff plus Firebase Cloud Messaging registration
- Light and dark mode support

## Project Structure

```text
src/
  components/
  config/
  context/
  hooks/
  navigation/
  screens/
  services/
  store/
  theme/
  types/
  utils/
```

## Environment Setup

1. Copy `.env.example` to `.env`.
2. Fill in every Firebase, MQTT, and Google Maps value.
3. Add Firebase native config files to the project root:
   - `google-services.json`
   - `GoogleService-Info.plist`
4. In Firestore, create a `users` collection.
5. For each signed-in user, the app will auto-create a profile document if missing.
6. To auto-classify staff accounts on first login, add their emails to `EXPO_PUBLIC_STAFF_EMAILS`.

Example Firestore profile document:

```json
{
  "email": "ops@example.com",
  "role": "STAFF",
  "points": 120
}
```

## MQTT Payload

Publish JSON messages like this to any of the supported topics:

```json
{
  "id": "bin_1",
  "lat": 12.97,
  "lng": 77.59,
  "fill": 85,
  "status": "FULL",
  "alert": "GAS"
}
```

## Run Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Generate native projects:

   ```bash
   npx expo prebuild
   ```

3. Start a custom dev build:

   ```bash
   npx expo run:android
   npx expo run:ios
   ```

`Expo Go` is not enough for this app because Firebase Cloud Messaging and React Native Firebase require native modules.

## Push Notifications

- The app registers staff devices for FCM and stores device tokens in Firestore.
- Foreground MQTT events also trigger local notifications for staff so urgent conditions are still surfaced immediately.
- To send remote FCM notifications when a bin changes state in the backend, use the stored `fcmTokens` from each staff profile document.

## Notes

- Google Maps routing opens the device map app with current-location directions for staff.
- MQTT updates are batched with a short debounce window to reduce render churn on the map and dashboards.
- Marker rerenders are minimized with memoized marker components and debounced bin arrays.
