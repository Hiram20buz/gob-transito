import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode, memo, useCallback, useRef } from 'react';
import {
  type DimensionValue,
  StyleSheet,
  View,
} from 'react-native';
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

export const CDMX_REGION = {
  latitude: 19.4326,
  longitude: -99.1332,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const MAP_EMBED =
  'https://www.google.com/maps?q=19.4326,-99.1332&z=13&output=embed';

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
  initialRegion?: typeof CDMX_REGION;
};

export const MapBase = memo(function MapBase({
  theme,
  routes = [],
  children,
  interactive = false,
  onTap,
  viewBox = '0 0 326 200',
  height = '100%',
  showMap = true,
  dim = 0,
}: MapBaseProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [vbW, vbH] = viewBox.split(' ').slice(2).map(Number);

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
      {showMap && (
        <iframe
          title="Mapa"
          src={MAP_EMBED}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 0,
            pointerEvents: interactive ? 'none' : 'auto',
            filter: theme.dark
              ? 'invert(0.92) hue-rotate(170deg) saturate(.7) brightness(.95)'
              : 'saturate(.82) contrast(.98)',
            opacity: theme.dark ? 0.9 : 1,
          }}
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
    </div>
  );
});

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
