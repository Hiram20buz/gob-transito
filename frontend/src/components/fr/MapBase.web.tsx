import { LinearGradient } from 'expo-linear-gradient';
import {
  type ReactNode,
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { type DimensionValue, StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';

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

export type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export const CDMX_REGION: Region = {
  latitude: 19.4326,
  longitude: -99.1332,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const WEB_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_WEB_KEY ?? '';

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
    },
    ref,
  ) {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const [vbW, vbH] = viewBox.split(' ').slice(2).map(Number);

    const { isLoaded } = useLoadScript({ googleMapsApiKey: WEB_API_KEY });

    useImperativeHandle(
      ref,
      () => ({
        animateToRegion: (region) => {
          mapRef.current?.panTo({ lat: region.latitude, lng: region.longitude });
        },
      }),
      [],
    );

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!interactive || !onTap || !wrapRef.current) return;
        const r = wrapRef.current.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * vbW;
        const y = ((e.clientY - r.top) / r.height) * vbH;
        onTap({ x: Math.round(x), y: Math.round(y) });
      },
      [interactive, onTap, vbW, vbH],
    );

    const tintColors: readonly [string, string, string] = theme.dark
      ? ['rgba(36,8,16,0.28)', 'rgba(36,8,16,0.10)', 'rgba(36,8,16,0.22)']
      : ['rgba(97,18,50,0.06)', 'rgba(97,18,50,0.00)', 'rgba(97,18,50,0.05)'];

    return (
      <div
        ref={wrapRef}
        onClick={handleClick}
        style={{
          position: 'relative',
          width: '100%',
          height: typeof height === 'number' ? `${height}px` : (height as string),
          overflow: 'hidden',
          cursor: interactive ? 'crosshair' : 'default',
          background: theme.dark ? '#21121a' : '#e9e3d6',
        }}>
        {showMap && isLoaded && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: interactive ? 'none' : 'auto',
            }}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={{ lat: initialRegion.latitude, lng: initialRegion.longitude }}
              zoom={13}
              onLoad={(map) => {
                mapRef.current = map;
              }}
              options={{
                disableDefaultUI: true,
                gestureHandling: interactive ? 'none' : 'auto',
                clickableIcons: false,
              }}
            />
          </div>
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
      </div>
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
