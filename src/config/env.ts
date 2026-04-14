import Constants from 'expo-constants';

interface AppExtra {
  firebaseApiKey?: string;
  firebaseAuthDomain?: string;
  firebaseProjectId?: string;
  firebaseStorageBucket?: string;
  firebaseMessagingSenderId?: string;
  firebaseAppId?: string;
  firebaseMeasurementId?: string;
  mqttUrl?: string;
  mqttUsername?: string;
  mqttPassword?: string;
  googleMapsApiKey?: string;
  defaultLatitude?: string;
  defaultLongitude?: string;
  staffEmails?: string;
}

const extra = (Constants.expoConfig?.extra ?? {}) as AppExtra;

function requireValue(key: keyof AppExtra) {
  const value = extra[key];

  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Missing app configuration for ${key}. Check your .env values.`);
  }

  return value;
}

export const env = {
  firebaseApiKey: requireValue('firebaseApiKey'),
  firebaseAuthDomain: requireValue('firebaseAuthDomain'),
  firebaseProjectId: requireValue('firebaseProjectId'),
  firebaseStorageBucket: requireValue('firebaseStorageBucket'),
  firebaseMessagingSenderId: requireValue('firebaseMessagingSenderId'),
  firebaseAppId: requireValue('firebaseAppId'),
  firebaseMeasurementId: extra.firebaseMeasurementId,
  mqttUrl: requireValue('mqttUrl'),
  mqttUsername: extra.mqttUsername,
  mqttPassword: extra.mqttPassword,
  googleMapsApiKey: requireValue('googleMapsApiKey'),
  defaultLatitude: Number(extra.defaultLatitude ?? '12.9716'),
  defaultLongitude: Number(extra.defaultLongitude ?? '77.5946'),
  staffEmails:
    extra.staffEmails
      ?.split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean) ?? [],
};
