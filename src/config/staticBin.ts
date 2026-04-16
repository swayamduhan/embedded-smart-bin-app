import type { Dustbin } from '../types/bin';

export const fixedBinCoordinates = {
  latitude: 12.97497,
  longitude: 79.165385,
};

export const fixedBinRegion = {
  latitude: fixedBinCoordinates.latitude,
  longitude: fixedBinCoordinates.longitude,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export const fixedBin: Dustbin = {
  id: 'bin_1',
  lat: fixedBinCoordinates.latitude,
  lng: fixedBinCoordinates.longitude,
  fill: 35,
  status: 'NORMAL',
  alert: 'NONE',
  updatedAt: Date.now(),
};
