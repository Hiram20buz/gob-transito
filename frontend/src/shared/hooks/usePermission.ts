import { useCallback, useState } from 'react';
import { Alert, Linking } from 'react-native';
import * as Location from 'expo-location';

export type PermissionKey = 'location';
export type PermissionStatus = 'granted' | 'denied' | 'blocked' | 'unavailable';

type Messages = { title: string; message: string };

const PERMISSION_MESSAGES: Record<PermissionKey, Messages> = {
  location: {
    title: 'Permiso de ubicación requerido',
    message:
      'Necesitamos tu ubicación para centrar el mapa y sugerirte rutas desde donde estás. Actívala en Ajustes.',
  },
};

type UsePermissionReturn = {
  status: PermissionStatus | null;
  requestPermission: () => Promise<boolean>;
};

export function usePermission(key: PermissionKey): UsePermissionReturn {
  const [status, setStatus] = useState<PermissionStatus | null>(null);

  const showSettingsAlert = useCallback(() => {
    const { title, message } = PERMISSION_MESSAGES[key];
    Alert.alert(title, message, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Abrir Ajustes', onPress: () => Linking.openSettings() },
    ]);
  }, [key]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const current = await Location.getForegroundPermissionsAsync();

      if (current.status === Location.PermissionStatus.GRANTED) {
        setStatus('granted');
        return true;
      }

      if (
        current.status === Location.PermissionStatus.DENIED &&
        current.canAskAgain === false
      ) {
        setStatus('blocked');
        showSettingsAlert();
        return false;
      }

      const result = await Location.requestForegroundPermissionsAsync();

      if (result.status === Location.PermissionStatus.GRANTED) {
        setStatus('granted');
        return true;
      }

      if (result.canAskAgain === false) {
        setStatus('blocked');
        showSettingsAlert();
        return false;
      }

      setStatus('denied');
      return false;
    } catch (error) {
      console.error('[usePermission] Error solicitando permiso:', error);
      setStatus('denied');
      return false;
    }
  }, [showSettingsAlert]);

  return { status, requestPermission };
}
