import * as Location from 'expo-location';

import { fixedBinCoordinates } from '../../config/staticBin';

export const defaultRegion = {
  latitude: fixedBinCoordinates.latitude,
  longitude: fixedBinCoordinates.longitude,
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
