import * as Location from 'expo-location';

import { env } from '../../config/env';

export const defaultRegion = {
  latitude: env.defaultLatitude,
  longitude: env.defaultLongitude,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export async function getCurrentLocationAsync() {
  const permission = await Location.requestForegroundPermissionsAsync();

  if (permission.status !== 'granted') {
    return null;
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}
