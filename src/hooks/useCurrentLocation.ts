import { useEffect, useState } from 'react';

import { getCurrentLocationAsync } from '../services/location/locationService';

export function useCurrentLocation() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadLocation() {
      try {
        const currentLocation = await getCurrentLocationAsync();

        if (mounted) {
          setLocation(currentLocation);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadLocation();

    return () => {
      mounted = false;
    };
  }, []);

  return { location, loading };
}
