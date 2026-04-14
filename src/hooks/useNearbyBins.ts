import { useMemo } from 'react';

import type { Dustbin } from '../types/bin';
import { distanceInKm } from '../utils/geo';

export function useNearbyBins(
  bins: Dustbin[],
  currentLocation: { latitude: number; longitude: number } | null,
  limit = 6
) {
  return useMemo(() => {
    if (!currentLocation) {
      return [];
    }

    return bins
      .filter((bin) => bin.status !== 'FULL')
      .map((bin) => ({
        ...bin,
        distanceKm: distanceInKm(currentLocation, {
          latitude: bin.lat,
          longitude: bin.lng,
        }),
      }))
      .sort((left, right) => left.distanceKm - right.distanceKm)
      .slice(0, limit);
  }, [bins, currentLocation, limit]);
}
