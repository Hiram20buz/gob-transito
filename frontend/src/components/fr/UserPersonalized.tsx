import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { Icon } from '@/components/fr/Icon';
import {
  MapBase,
  type MapBaseHandle,
  type MapRoute,
  type TapPoint,
} from '@/components/fr/MapBase';
import { RECOMMENDED } from '@/constants/fastroute-mock';
import {
  FRTheme,
  FR_FONTS,
  PALETTE,
  ROUTE_COLORS,
} from '@/constants/fastroute-theme';
import { useLocation } from '@/shared/hooks/useLocation';

export type TrackingStyle = 'pins' | 'trace';

type Props = {
  theme: FRTheme;
  trackingStyle?: TrackingStyle;
};

const VB_W = 390;
const VB_H = 560;
const KM_PER_UNIT = 0.031;

function linePath(pts: TapPoint[]) {
  return pts.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ');
}

function smoothPath(pts: TapPoint[]) {
  if (pts.length < 3) return linePath(pts);
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x},${p2.y}`;
  }
  return d;
}

function totalLen(pts: TapPoint[]) {
  let s = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    s += Math.hypot(dx, dy);
  }
  return s;
}

export function UserPersonalized({ theme, trackingStyle = 'pins' }: Props) {
  const [pts, setPts] = useState<TapPoint[]>([
    { x: 40, y: 430 },
    { x: 150, y: 300 },
    { x: 250, y: 330 },
  ]);
  const [showRec, setShowRec] = useState(true);

  const mapRef = useRef<MapBaseHandle>(null);
  const { coords, requestAndGet } = useLocation();

  const goToMyLocation = useCallback(async () => {
    const c = await requestAndGet();
    if (!c) return;
    mapRef.current?.animateToRegion(
      { ...c, latitudeDelta: 0.02, longitudeDelta: 0.02 },
      600,
    );
  }, [requestAndGet]);

  const personalPath =
    trackingStyle === 'trace' ? smoothPath(pts) : linePath(pts);
  const len = totalLen(pts);
  const km = (len * KM_PER_UNIT).toFixed(1);
  const min = Math.max(1, Math.round((len * KM_PER_UNIT) / 20 * 60));

  const recRoutes = useMemo<MapRoute[]>(
    () =>
      showRec
        ? RECOMMENDED.map((r) => ({
            id: r.id,
            color: r.color,
            width: 4,
            active: false,
            path: r.path.replace(/(\d+),(\d+)/g, (_m, a: string, b: string) =>
              `${((+a / 326) * VB_W).toFixed(0)},${((+b / 200) * VB_H).toFixed(0)}`,
            ),
            coordinates: r.coordinates,
          }))
        : [],
    [showRec],
  );

  const meRoute: MapRoute = {
    id: 'me',
    path: personalPath,
    color: ROUTE_COLORS.personal,
    width: 7,
    glow: true,
  };

  function addPt(p: TapPoint) {
    setPts((prev) => [...prev, p]);
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <MapBase
        ref={mapRef}
        theme={theme}
        routes={[...recRoutes, meRoute]}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        interactive
        onTap={addPt}
        height="100%"
        dim={theme.dark ? 0.12 : 0}
        showsUserLocation={coords !== null}>
        {pts.map((p, i) => {
          const isFirst = i === 0;
          const isLast = i === pts.length - 1;
          const left = `${(p.x / VB_W) * 100}%` as const;
          const top = `${(p.y / VB_H) * 100}%` as const;
          if (trackingStyle === 'trace' && !isFirst && !isLast) {
            return (
              <View
                key={i}
                pointerEvents="none"
                style={[
                  styles.traceDot,
                  {
                    left,
                    top,
                    borderColor: ROUTE_COLORS.personal,
                    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
                  },
                ]}
              />
            );
          }
          return (
            <View
              key={i}
              pointerEvents="none"
              style={[
                styles.pinWrap,
                {
                  left,
                  top,
                  transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
                },
              ]}>
              <View style={[styles.pinHalo, { backgroundColor: ROUTE_COLORS.personal }]} />
              <View
                style={[
                  styles.pinCore,
                  {
                    borderColor: isFirst
                      ? '#3F9B6B'
                      : isLast
                      ? ROUTE_COLORS.personal
                      : ROUTE_COLORS.personal,
                  },
                ]}>
                {isFirst ? (
                  <Icon name="flag" size={10} color="#3F9B6B" />
                ) : isLast ? (
                  <Icon name="target" size={11} color={ROUTE_COLORS.personal} />
                ) : (
                  <Text style={[styles.pinIndex, { color: ROUTE_COLORS.personal }]}>{i}</Text>
                )}
              </View>
            </View>
          );
        })}
      </MapBase>

      <Pressable
        onPress={goToMyLocation}
        accessibilityRole="button"
        accessibilityLabel="Centrar el mapa en mi ubicación"
        style={[
          styles.locationBtn,
          { backgroundColor: theme.surface, borderColor: theme.line },
        ]}>
        <Icon name="target" size={20} color={theme.primary} />
      </Pressable>

      <View
        style={[
          styles.hint,
          {
            backgroundColor: theme.surface,
            borderColor: theme.line,
            shadowColor: theme.shadowColor,
            shadowOpacity: theme.shadowOpacity,
          },
        ]}>
        <View style={[styles.hintIcon, { backgroundColor: ROUTE_COLORS.personal + '22' }]}>
          <Icon name="target" size={15} color={ROUTE_COLORS.personal} />
        </View>
        <Text style={[styles.hintText, { color: theme.textSoft }]} numberOfLines={2}>
          Toca el mapa para trazar tu ruta. Tus puntos no dependen del cálculo de Google.
        </Text>
      </View>

      <View
        style={[
          styles.panel,
          { backgroundColor: theme.surface, borderColor: theme.line },
        ]}>
        <View style={styles.panelHeader}>
          <View style={[styles.dotRing, { backgroundColor: ROUTE_COLORS.personal }]} />
          <Text style={[styles.panelTitle, { color: theme.text }]}>Mi ruta personalizada</Text>
          <View style={styles.recToggle}>
            <Text style={[styles.recLabel, { color: theme.textSoft }]}>Sugeridas</Text>
            <Switch
              value={showRec}
              onValueChange={setShowRec}
              trackColor={{ true: theme.primary, false: theme.line }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.statsRow}>
          {[
            { ic: 'target' as const, v: String(pts.length), l: 'Puntos' },
            { ic: 'route' as const, v: km, l: 'km' },
            { ic: 'clock' as const, v: String(min), l: 'min aprox' },
          ].map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: theme.surfaceAlt }]}>
              <Icon name={s.ic} size={16} color={theme.gold} />
              <Text style={[styles.statValue, { color: theme.text }]}>{s.v}</Text>
              <Text style={[styles.statLabel, { color: theme.textSoft }]}>{s.l}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={() => setPts((p) => p.slice(0, -1))}
            disabled={pts.length === 0}
            accessibilityRole="button"
            accessibilityLabel="Deshacer último punto"
            style={[
              styles.btnSecondary,
              {
                backgroundColor: theme.surface,
                borderColor: theme.line,
                opacity: pts.length ? 1 : 0.45,
              },
            ]}>
            <Icon name="undo" size={16} color={theme.text} />
            <Text style={[styles.btnSecondaryText, { color: theme.text }]}>Deshacer</Text>
          </Pressable>
          <Pressable
            onPress={() => setPts([])}
            accessibilityRole="button"
            accessibilityLabel="Borrar todos los puntos"
            style={[
              styles.btnIconOnly,
              { backgroundColor: theme.surface, borderColor: theme.line },
            ]}>
            <Icon name="trash" size={17} color="#C0573E" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Enviar ruta a revisión"
            style={styles.btnPrimaryWrap}>
            <LinearGradient
              colors={[theme.primary, PALETTE.guindaDk]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btnPrimary}>
              <Icon name="check" size={17} color="#fff" stroke={2.6} />
              <Text style={styles.btnPrimaryText}>Enviar a revisión</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, position: 'relative' },
  hint: {
    position: 'absolute',
    top: 14,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 13,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 3,
  },
  hintIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintText: { flex: 1, fontFamily: FR_FONTS.bodyBold, fontSize: 12.5, lineHeight: 16 },
  pinWrap: {
    position: 'absolute',
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinHalo: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    opacity: 0.25,
  },
  pinCore: {
    width: 20,
    height: 20,
    borderRadius: 11,
    backgroundColor: '#fff',
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  pinIndex: { fontFamily: FR_FONTS.bodyExtra, fontSize: 10 },
  traceDot: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderWidth: 2.5,
  },
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 18,
    paddingBottom: 22,
    shadowColor: '#3A0B1D',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: -8 },
    shadowRadius: 20,
    elevation: 12,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  dotRing: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  panelTitle: { fontFamily: FR_FONTS.display, fontSize: 17, flex: 1 },
  recToggle: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  recLabel: { fontFamily: FR_FONTS.bodyBold, fontSize: 12 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statValue: { fontFamily: FR_FONTS.display, fontSize: 21, marginTop: 2 },
  statLabel: {
    fontFamily: FR_FONTS.bodyExtra,
    fontSize: 10.5,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  actions: { flexDirection: 'row', gap: 10 },
  btnSecondary: {
    flex: 1,
    height: 48,
    borderRadius: 13,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  btnSecondaryText: { fontFamily: FR_FONTS.bodyBold, fontSize: 13.5 },
  btnIconOnly: {
    width: 48,
    height: 48,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryWrap: {
    flex: 1.4,
    height: 48,
    borderRadius: 13,
    overflow: 'hidden',
    shadowColor: '#611232',
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 6,
  },
  btnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  btnPrimaryText: { color: '#fff', fontFamily: FR_FONTS.display, fontSize: 14 },
  locationBtn: {
    position: 'absolute',
    right: 16,
    bottom: 320,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    zIndex: 5,
  },
});
