import { useCallback, useState } from 'react';
import * as Location from 'expo-location';

import { usePermission } from '@/shared/hooks/usePermission';

export type Coords = { latitude: number; longitude: number };

type UseLocationReturn = {
  coords: Coords | null;
  loading: boolean;
  requestAndGet: () => Promise<Coords | null>;
};

export function useLocation(): UseLocationReturn {
  const { requestPermission } = usePermission('location');
  const [coords, setCoords] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(false);

  const requestAndGet = useCallback(async (): Promise<Coords | null> => {
    const granted = await requestPermission();
    if (!granted) return null;

    setLoading(true);
    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const c: Coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setCoords(c);
      return c;
    } catch (error) {
      console.error('[useLocation] Error obteniendo posición:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [requestPermission]);

  return { coords, loading, requestAndGet };
}
