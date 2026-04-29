import * as Location from 'expo-location';

import { env } from '../../config/env';

export const currentUserLocation = {
  latitude: 12.9710097,
  longitude: 79.1641099,
};

export const defaultRegion = {
  latitude: currentUserLocation.latitude,
  longitude: currentUserLocation.longitude,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export async function getCurrentLocationAsync() {
  const permission = await Location.requestForegroundPermissionsAsync();

  if (permission.status !== 'granted') {
    return currentUserLocation;
  }

  return currentUserLocation;
}
