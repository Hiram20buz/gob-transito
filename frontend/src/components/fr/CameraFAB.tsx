import { memo, useCallback, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import Svg, { Circle, Path } from 'react-native-svg';

import { submitObstruccion } from '@/lib/api';
import type { FRTheme } from '@/constants/fastroute-theme';

interface CameraFABProps {
  theme: FRTheme;
  userId: string;
  bottomOffset?: number;
}

const CameraFAB = memo(({ theme, userId, bottomOffset = 24 }: CameraFABProps) => {
  const [loading, setLoading] = useState(false);

  const handlePress = useCallback(async () => {
    setLoading(true);
    try {
      const camPerm = await ImagePicker.requestCameraPermissionsAsync();
      if (camPerm.status !== 'granted') {
        Alert.alert(
          'Permiso de cámara requerido',
          'Activa el acceso a la cámara en los ajustes del sistema.',
          [{ text: 'OK' }],
        );
        return;
      }

      const locPerm = await Location.requestForegroundPermissionsAsync();
      if (locPerm.status !== Location.PermissionStatus.GRANTED) {
        Alert.alert(
          'Permiso de ubicación requerido',
          'Activa el acceso a la ubicación en los ajustes del sistema.',
          [{ text: 'OK' }],
        );
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: false,
      });

      if (result.canceled || !result.assets?.length) return;

      const photo = result.assets[0];

      await submitObstruccion({
        user_id: userId,
        latitud: pos.coords.latitude,
        longitud: pos.coords.longitude,
        foto: {
          uri: photo.uri,
          name: photo.fileName ?? `obstruccion_${photo.uri.split('/').pop() ?? 'foto'}.jpg`,
          type: photo.mimeType ?? 'image/jpeg',
        },
      });

      Alert.alert('Reporte enviado', 'La obstrucción fue reportada exitosamente. ¡Gracias por contribuir!');
    } catch (err) {
      console.error('[CameraFAB]', err);
      Alert.alert('Error', 'No se pudo acceder a la cámara o ubicación. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        {
          backgroundColor: theme.primary,
          shadowColor: theme.shadowColor,
          shadowOpacity: theme.shadowOpacity,
          bottom: bottomOffset,
        },
      ]}
      onPress={handlePress}
      disabled={loading}
      activeOpacity={0.82}
      accessibilityRole="button"
      accessibilityLabel="Reportar obstrucción"
      accessibilityHint="Toca para fotografiar y reportar una obstrucción peatonal o accidente"
    >
      {loading ? (
        <ActivityIndicator color={theme.primaryText} size="small" />
      ) : (
        <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
          <Path
            d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
            stroke={theme.primaryText}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx={12} cy={13} r={4} stroke={theme.primaryText} strokeWidth={1.6} />
        </Svg>
      )}
    </TouchableOpacity>
  );
});

CameraFAB.displayName = 'CameraFAB';

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
  },
});

export { CameraFAB };
