import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Svg, { Path } from 'react-native-svg';

const { height: SCREEN_H } = Dimensions.get('window');

export type CapturedPhoto = {
  uri: string;
  mimeType: string;
  fileName: string;
};

interface CameraModalProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (photo: CapturedPhoto) => void;
}

const CameraModal = memo(({ visible, onClose, onCapture }: CameraModalProps) => {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = useState(false);

  const translateY = useRef(new Animated.Value(SCREEN_H)).current;
  const flashOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(SCREEN_H);
      Animated.spring(translateY, {
        toValue: 0,
        damping: 22,
        stiffness: 280,
        useNativeDriver: true,
      }).start();
      if (!permission?.granted) requestPermission();
    }
  }, [visible]);

  const slideOut = useCallback(
    (done?: () => void) => {
      Animated.timing(translateY, {
        toValue: SCREEN_H,
        duration: 260,
        useNativeDriver: true,
      }).start(() => done?.());
    },
    [translateY],
  );

  const handleClose = useCallback(() => slideOut(onClose), [slideOut, onClose]);

  // Swipe down para cerrar
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        gs.dy > 8 && Math.abs(gs.dy) > Math.abs(gs.dx),
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) translateY.setValue(gs.dy);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 110 || gs.vy > 0.65) {
          Animated.timing(translateY, {
            toValue: SCREEN_H,
            duration: 260,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            damping: 22,
            stiffness: 280,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);

    Animated.sequence([
      Animated.timing(flashOpacity, { toValue: 1, duration: 55, useNativeDriver: true }),
      Animated.timing(flashOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start();

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!photo) return;
      slideOut(() =>
        onCapture({
          uri: photo.uri,
          mimeType: 'image/jpeg',
          fileName: `obstruccion_${photo.uri.split('/').pop() ?? 'foto'}.jpg`,
        }),
      );
    } finally {
      setCapturing(false);
    }
  }, [capturing, flashOpacity, slideOut, onCapture]);

  if (!visible) return null;

  return (
    <Modal transparent visible statusBarTranslucent onRequestClose={handleClose}>
      <Animated.View
        style={[styles.container, { transform: [{ translateY }] }]}
        {...pan.panHandlers}
      >
        {/* Vista en vivo */}
        {permission?.granted ? (
          <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.noCam]} />
        )}

        {/* Flash al capturar */}
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.flash, { opacity: flashOpacity }]}
          pointerEvents="none"
        />

        {/* Handle de arrastre */}
        <View style={styles.handleWrap} pointerEvents="none">
          <View style={styles.handleBar} />
        </View>

        {/* Barra superior */}
        <View style={styles.topBar}>
          <Pressable onPress={handleClose} style={styles.iconBtn} hitSlop={14}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M18 6L6 18M6 6l12 12"
                stroke="#fff"
                strokeWidth={2.2}
                strokeLinecap="round"
              />
            </Svg>
          </Pressable>

          <Pressable onPress={() => setFacing(f => (f === 'back' ? 'front' : 'back'))} style={styles.iconBtn} hitSlop={14}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M1 4v6h6M23 20v-6h-6"
                stroke="#fff"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"
                stroke="#fff"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        </View>

        {/* Botón de disparo */}
        <View style={styles.bottomBar}>
          <Pressable
            onPress={handleCapture}
            disabled={capturing}
            style={({ pressed }) => [styles.shutterRing, (pressed || capturing) && styles.shutterPressed]}
          >
            <View style={styles.shutterDisc} />
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
});

CameraModal.displayName = 'CameraModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  noCam: {
    backgroundColor: '#111',
  },
  flash: {
    backgroundColor: '#fff',
  },
  handleWrap: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 52,
    paddingTop: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  shutterRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterPressed: {
    opacity: 0.65,
    transform: [{ scale: 0.94 }],
  },
  shutterDisc: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
  },
});

export { CameraModal };
