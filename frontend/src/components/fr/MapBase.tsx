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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import Svg, { Circle, G, Path } from 'react-native-svg';

import { FRTheme } from '@/constants/fastroute-theme';

export type MapRoute = {
  id: string;
  path: string;
  color: string;
  width?: number;
  dashed?: boolean;
  glow?: boolean;
  active?: boolean;
};

export type TapPoint = { x: number; y: number };

type MapBaseProps = {
  theme: FRTheme;
  routes?: MapRoute[];
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

export const CDMX_REGION: Region = {
  latitude: 19.4326,
  longitude: -99.1332,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export type MapBaseHandle = {
  animateToRegion: (region: Region, durationMs?: number) => void;
};

export const MapBase = memo(
  forwardRef<MapBaseHandle, MapBaseProps>(function MapBase(
    {
      theme,
      routes = [],
      children,
      interactive = false,
      onTap,
      viewBox = '0 0 326 200',
      height = '100%',
      showMap = true,
      dim = 0,
      initialRegion = CDMX_REGION,
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
    }),
    [],
  );
  const [vbW, vbH] = viewBox.split(' ').slice(2).map(Number);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height: h } = e.nativeEvent.layout;
    setSize({ w: width, h });
  }, []);

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      if (!interactive || !onTap || size.w === 0 || size.h === 0) return;
      const { locationX, locationY } = e.nativeEvent;
      const x = (locationX / size.w) * vbW;
      const y = (locationY / size.h) * vbH;
      onTap({ x: Math.round(x), y: Math.round(y) });
    },
    [interactive, onTap, size, vbW, vbH],
  );

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
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          initialRegion={initialRegion}
          pointerEvents={interactive ? 'none' : 'auto'}
          showsCompass={false}
          showsMyLocationButton={false}
          showsUserLocation={showsUserLocation}
          toolbarEnabled={false}
          rotateEnabled={!interactive}
          scrollEnabled={!interactive}
          zoomEnabled={!interactive}
          pitchEnabled={!interactive}
        />
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
        {routes.map((rt) => {
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

      {interactive && (
        <Pressable
          onPress={handlePress}
          style={StyleSheet.absoluteFill}
          accessibilityRole="button"
          accessibilityLabel="Mapa interactivo"
        />
      )}
    </View>
  );
  }),
);

type MapPinProps = {
  theme: FRTheme;
  left: DimensionValue;
  top: DimensionValue;
  kind?: 'origin' | 'dest';
};

export const MapPin = memo(function MapPin({ theme, left, top, kind = 'dest' }: MapPinProps) {
  if (kind === 'origin') {
    return (
      <View
        pointerEvents="none"
        style={[
          styles.pin,
          { left, top, transform: [{ translateX: '-50%' }, { translateY: '-50%' }] },
        ]}>
        <View style={[styles.originDot, { borderColor: theme.primary }]} />
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
      <Svg width={30} height={38} viewBox="0 0 30 38">
        <Path
          d="M15 37C15 37 27 23 27 13A12 12 0 1 0 3 13C3 23 15 37 15 37Z"
          fill={theme.primary}
          stroke="#ffffff"
          strokeWidth={2}
        />
        <Circle cx={15} cy={13} r={4.5} fill="#ffffff" />
      </Svg>
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
});
