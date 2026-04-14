import { Alert, Linking, Platform } from 'react-native';

import type { Dustbin } from '../../types/bin';

export async function openGoogleMapsRoute(
  destination: Dustbin,
  currentLocation: { latitude: number; longitude: number } | null
) {
  const destinationParam = `${destination.lat},${destination.lng}`;
  const originParam = currentLocation
    ? `${currentLocation.latitude},${currentLocation.longitude}`
    : undefined;

  const url =
    Platform.OS === 'ios'
      ? `http://maps.apple.com/?daddr=${destinationParam}${originParam ? `&saddr=${originParam}` : ''}`
      : `https://www.google.com/maps/dir/?api=1&destination=${destinationParam}${originParam ? `&origin=${originParam}` : ''}`;

  const supported = await Linking.canOpenURL(url);

  if (!supported) {
    Alert.alert('Unable to open maps', 'No map application is available on this device.');
    return;
  }

  await Linking.openURL(url);
}
