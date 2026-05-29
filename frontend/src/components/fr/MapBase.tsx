import {
  type ReactNode,
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  type DimensionValue,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker, type Region, type LatLng, type MapPressEvent, type Camera } from 'react-native-maps';
import Svg, { Circle, G, Path } from 'react-native-svg';

import { Icon } from '@/components/fr/Icon';
import { FRTheme } from '@/constants/fastroute-theme';

export type MapRoute = {
  id: string;
  path: string;
  color: string;
  width?: number;
  dashed?: boolean;
  glow?: boolean;
  active?: boolean;
  coordinates?: { latitude: number; longitude: number }[];
};

export type TapPoint = { x: number; y: number };

type MapBaseProps = {
  theme: FRTheme;
  routes?: MapRoute[];
  markers?: { id: string; coordinate: LatLng; kind?: 'origin' | 'dest' }[];
  children?: ReactNode;
  interactive?: boolean;
  onTap?: (pt: TapPoint) => void;
  viewBox?: string;
  height?: DimensionValue;
  showMap?: boolean;
  dim?: number;
  initialRegion?: Region;
  showsUserLocation?: boolean;
};

export const TIJUANA_REGION: Region = {
  latitude: 32.5149,
  longitude: -117.0382,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

export type MapBaseHandle = {
  animateToRegion: (region: Region, durationMs?: number) => void;
  animateCamera: (camera: Camera, durationMs?: number) => void;
};

export const MapBase = memo(
  forwardRef<MapBaseHandle, MapBaseProps>(function MapBase(
    {
      theme,
      routes = [],
      markers = [],
      children,
      interactive = false,
      onTap,
      viewBox = '0 0 326 200',
      height = '100%',
      showMap = true,
      dim = 0,
      initialRegion = TIJUANA_REGION,
      showsUserLocation = false,
    },
    ref,
  ) {
  const mapRef = useRef<MapView | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useImperativeHandle(
    ref,
    () => ({
      animateToRegion: (region, durationMs = 600) => {
        mapRef.current?.animateToRegion(region, durationMs);
      },
      animateCamera: (camera, durationMs = 1000) => {
        mapRef.current?.animateCamera(camera, { duration: durationMs });
      },
    }),
    [],
  );
  const [vbW, vbH] = viewBox.split(' ').slice(2).map(Number);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height: h } = e.nativeEvent.layout;
    setSize({ w: width, h });
  }, []);

  const handleMapPress = useCallback(
    (e: MapPressEvent) => {
      if (!interactive || !onTap || size.w === 0 || size.h === 0) return;
      
      const { position } = e.nativeEvent;
      const x = (position.x / size.w) * vbW;
      const y = (position.y / size.h) * vbH;
      onTap({ x: Math.round(x), y: Math.round(y) });
    },
    [interactive, onTap, size, vbW, vbH],
  );

  const handleZoom = useCallback(async (out: boolean) => {
    if (!mapRef.current) return;
    const cam = await mapRef.current.getCamera();
    if (!cam) return;
    
    if (cam.zoom !== undefined) {
      cam.zoom = cam.zoom + (out ? -1 : 1);
    }
    if (cam.altitude !== undefined) {
      cam.altitude = cam.altitude * (out ? 1.5 : 0.66);
    }
    mapRef.current.animateCamera(cam, { duration: 300 });
  }, []);

  const tintColors: readonly [string, string, string] = theme.dark
    ? ['rgba(36,8,16,0.28)', 'rgba(36,8,16,0.10)', 'rgba(36,8,16,0.22)']
    : ['rgba(97,18,50,0.06)', 'rgba(97,18,50,0.00)', 'rgba(97,18,50,0.05)'];

  return (
    <View
      style={[
        styles.wrap,
        { height, backgroundColor: theme.dark ? '#21121a' : '#e9e3d6' },
      ]}
      onLayout={handleLayout}>
      {showMap && (
        <MapView
          ref={mapRef}
          provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          initialRegion={initialRegion}
          pointerEvents="auto"
          onPress={handleMapPress}
          showsCompass={false}
          showsMyLocationButton={false}
          showsUserLocation={showsUserLocation}
          toolbarEnabled={false}
          rotateEnabled={!interactive}
          scrollEnabled={!interactive}
          zoomEnabled={!interactive}
          pitchEnabled={!interactive}
        >
          {routes.map((rt) => {
            if (!rt.coordinates || rt.coordinates.length === 0) return null;
            const w = rt.width ?? 6;
            return (
              <Polyline
                key={rt.id}
                coordinates={rt.coordinates}
                strokeColor={rt.active === false ? rt.color + '66' : rt.color}
                strokeWidth={w}
                lineDashPattern={rt.dashed ? [1, 14] : undefined}
                zIndex={rt.active ? 2 : 1}
              />
            );
          })}
          {markers.map((m) => (
            <Marker key={m.id} coordinate={m.coordinate} anchor={m.kind === 'origin' ? { x: 0.5, y: 0.5 } : { x: 0.5, y: 1 }}>
              <MapPinContent theme={theme} kind={m.kind} />
            </Marker>
          ))}
        </MapView>
      )}

      {showMap && !interactive && (
        <View style={[styles.zoomControls, { backgroundColor: theme.surface, borderColor: theme.line }]}>
          <Pressable style={styles.zoomBtn} onPress={() => handleZoom(false)} accessibilityLabel="Acercar mapa">
            <Icon name="plus" size={20} color={theme.text} />
          </Pressable>
          <View style={[styles.zoomDivider, { backgroundColor: theme.line }]} />
          <Pressable style={styles.zoomBtn} onPress={() => handleZoom(true)} accessibilityLabel="Alejar mapa">
            <Icon name="minus" size={20} color={theme.text} />
          </Pressable>
        </View>
      )}

      <LinearGradient
        colors={tintColors}
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {dim > 0 && (
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: `rgba(36,8,16,${dim})` }]}
        />
      )}

      <Svg
        viewBox={viewBox}
        preserveAspectRatio="none"
        width="100%"
        height="100%"
        style={StyleSheet.absoluteFill}
        pointerEvents="none">
        {routes
          .filter((rt) => !rt.coordinates || rt.coordinates.length === 0)
          .map((rt) => {
            const w = rt.width ?? 6;
            return (
              <G key={rt.id} opacity={rt.active === false ? 0.42 : 1}>
                {rt.glow && (
                  <Path
                    d={rt.path}
                    fill="none"
                    stroke={rt.color}
                    strokeWidth={w + 7}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.22}
                  />
                )}
                <Path
                  d={rt.path}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={w + 3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={theme.dark ? 0.25 : 0.7}
                />
                <Path
                  d={rt.path}
                  fill="none"
                  stroke={rt.color}
                  strokeWidth={w}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={rt.dashed ? '1 14' : undefined}
                />
              </G>
            );
          })}
      </Svg>

      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        {children}
      </View>
    </View>
  );
  }),
);

type MapPinProps = {
  theme: FRTheme;
  left?: DimensionValue;
  top?: DimensionValue;
  kind?: 'origin' | 'dest';
};

export const MapPinContent = memo(function MapPinContent({ theme, kind = 'dest' }: { theme: FRTheme; kind?: 'origin' | 'dest' }) {
  if (kind === 'origin') {
    return <View style={[styles.originDot, { borderColor: theme.primary }]} />;
  }
  return (
    <Svg width={30} height={38} viewBox="0 0 30 38">
      <Path
        d="M15 37C15 37 27 23 27 13A12 12 0 1 0 3 13C3 23 15 37 15 37Z"
        fill={theme.primary}
        stroke="#ffffff"
        strokeWidth={2}
      />
      <Circle cx={15} cy={13} r={4.5} fill="#ffffff" />
    </Svg>
  );
});

export const MapPin = memo(function MapPin({ theme, left, top, kind = 'dest' }: MapPinProps) {
  if (kind === 'origin') {
    return (
      <View
        pointerEvents="none"
        style={[
          styles.pin,
          { left, top, transform: [{ translateX: '-50%' }, { translateY: '-50%' }] },
        ]}>
        <MapPinContent theme={theme} kind={kind} />
      </View>
    );
  }
  return (
    <View
      pointerEvents="none"
      style={[
        styles.pin,
        { left, top, transform: [{ translateX: '-50%' }, { translateY: '-100%' }] },
      ]}>
      <MapPinContent theme={theme} kind={kind} />
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { width: '100%', overflow: 'hidden' },
  pin: { position: 'absolute' },
  originDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  zoomControls: {
    position: 'absolute',
    right: 16,
    top: '30%',
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    zIndex: 10,
    overflow: 'hidden',
  },
  zoomBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomDivider: {
    height: 1,
    width: '100%',
  },
});
