import 'dotenv/config';

import type { ConfigContext, ExpoConfig } from 'expo/config';

const bundleId = process.env.EXPO_PUBLIC_IOS_BUNDLE_ID ?? 'com.smartbin.mobile';
const packageName = process.env.EXPO_PUBLIC_ANDROID_PACKAGE ?? 'com.smartbin.mobile';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Smart Bin',
  slug: 'smart-bin',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'smartbin',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#08131d',
  },
  ios: {
    bundleIdentifier: bundleId,
    supportsTablet: true,
    googleServicesFile: process.env.GOOGLE_SERVICES_PLIST,
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        'Smart Bin uses your location to show nearby bins and route staff to urgent pickups.',
      UIBackgroundModes: ['remote-notification'],
    },
  },
  android: {
    package: packageName,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#08131d',
    },
    edgeToEdgeEnabled: true,
    permissions: [
      'ACCESS_COARSE_LOCATION',
      'ACCESS_FINE_LOCATION',
      'POST_NOTIFICATIONS',
      'RECEIVE_BOOT_COMPLETED',
      'VIBRATE',
    ],
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-secure-store',
    'expo-notifications',
    'expo-font',
    '@react-native-firebase/app',
    '@react-native-firebase/messaging',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
        android: {
          enableProguardInReleaseBuilds: true,
        },
      },
    ],
  ],
  extra: {
    firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    firebaseMeasurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
    mqttUrl: process.env.EXPO_PUBLIC_MQTT_URL,
    mqttUsername: process.env.EXPO_PUBLIC_MQTT_USERNAME,
    mqttPassword: process.env.EXPO_PUBLIC_MQTT_PASSWORD,
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    defaultLatitude: process.env.EXPO_PUBLIC_DEFAULT_LATITUDE ?? '12.9716',
    defaultLongitude: process.env.EXPO_PUBLIC_DEFAULT_LONGITUDE ?? '77.5946',
    staffEmails: process.env.EXPO_PUBLIC_STAFF_EMAILS ?? '',
    eas: {
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
    },
  },
});
