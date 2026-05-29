import { memo, useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';

import { CameraModal, type CapturedPhoto } from '@/components/fr/CameraModal';
import { submitObstruccion } from '@/lib/api';
import type { FRTheme } from '@/constants/fastroute-theme';

interface CameraFABProps {
  theme: FRTheme;
  userId: string;
  bottomOffset?: number;
}

const CameraFAB = memo(({ theme, userId, bottomOffset = 24 }: CameraFABProps) => {
  const [showCamera, setShowCamera] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleCapture = useCallback(
    async (photo: CapturedPhoto) => {
      setUploading(true);
      try {
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

        await submitObstruccion({
          user_id: userId,
          latitud: pos.coords.latitude,
          longitud: pos.coords.longitude,
          foto: { uri: photo.uri, name: photo.fileName, type: photo.mimeType },
          timestamp: new Date().toISOString(),
        });

        Alert.alert('Reporte enviado', 'La obstrucción fue reportada exitosamente. ¡Gracias por contribuir!');
      } catch (err) {
        console.error('[CameraFAB]', err);
        Alert.alert('Error', 'No se pudo enviar el reporte. Intenta de nuevo.');
      } finally {
        setUploading(false);
      }
    },
    [userId],
  );

  const shadowStyle = Platform.select({
    web: { boxShadow: `0px 4px 10px 0px ${theme.shadowColor}55` },
    default: {
      shadowColor: theme.shadowColor,
      shadowOpacity: theme.shadowOpacity,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
    },
  });

  return (
    <>
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary, bottom: bottomOffset }, shadowStyle]}
        onPress={() => setShowCamera(true)}
        disabled={uploading}
        activeOpacity={0.82}
        accessibilityRole="button"
        accessibilityLabel="Reportar obstrucción"
        accessibilityHint="Toca para abrir la cámara y reportar una obstrucción peatonal o accidente"
      >
        {uploading ? (
          <ActivityIndicator color={theme.primaryText} size="small" />
        ) : (
          <Text style={[styles.label, { color: theme.primaryText }]}>
            Reportar{'\n'}accidente
          </Text>
        )}
      </TouchableOpacity>

      <CameraModal
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCapture}
      />
    </>
  );
});

CameraFAB.displayName = 'CameraFAB';

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 17,
  },
});

export { CameraFAB };
