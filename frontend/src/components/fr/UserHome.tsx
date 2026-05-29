import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Keyboard } from 'react-native';

import { BottomSheet } from '@/components/fr/BottomSheet';
import { Chip } from '@/components/fr/Chip';
import { FromTo } from '@/components/fr/FromTo';
import { HistoryPanel } from '@/components/fr/HistoryPanel';
import { Icon } from '@/components/fr/Icon';
import {
  MapBase,
  type MapBaseHandle,
  type MapRoute,
} from '@/components/fr/MapBase';
import { RouteCard, RouteCardLayout } from '@/components/fr/RouteCard';
import { RECOMMENDED } from '@/constants/fastroute-mock';
import { FRTheme, FR_FONTS } from '@/constants/fastroute-theme';
import { useLocation } from '@/shared/hooks/useLocation';

type Props = {
  theme: FRTheme;
  cardLayout?: RouteCardLayout;
};

const MOCK_LOCATIONS = [
  'Casa',
  'Oficina Macroplaza',
  'Zona Río',
  'Playas de Tijuana',
  'Aeropuerto Abelardo L. Rodríguez',
  'Otay',
  'Centro',
  '5 y 10',
  'La Cacho',
  'Hipódromo',
];

function getHeading(p1: {latitude: number, longitude: number}, p2: {latitude: number, longitude: number}) {
  const lat1 = p1.latitude * Math.PI / 180;
  const lon1 = p1.longitude * Math.PI / 180;
  const lat2 = p2.latitude * Math.PI / 180;
  const lon2 = p2.longitude * Math.PI / 180;
  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

export function UserHome({ theme, cardLayout = 'rich' }: Props) {
  const [active, setActive] = useState('r1');
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState('Casa');
  const [to, setTo] = useState('Oficina Macroplaza');
  const [focusedField, setFocusedField] = useState<'from' | 'to' | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

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

  const routes = useMemo<MapRoute[]>(
    () =>
      RECOMMENDED.map((r) => ({
        id: r.id,
        path: r.path,
        color: r.color,
        width: r.id === active ? 8 : 5,
        glow: r.id === active,
        active: r.id === active,
        coordinates: r.coordinates,
      })),
    [active],
  );
  const handleSelectLocation = useCallback((loc: string) => {
    if (focusedField === 'from') setFrom(loc);
    else if (focusedField === 'to') setTo(loc);
    setFocusedField(null);
    Keyboard.dismiss();
  }, [focusedField]);

  const filteredLocations = useMemo(() => {
    if (!focusedField) return [];
    const query = (focusedField === 'from' ? from : to).toLowerCase();
    return MOCK_LOCATIONS.filter(loc => loc.toLowerCase().includes(query)).slice(0, 5);
  }, [focusedField, from, to]);

  const act = RECOMMENDED.find((r) => r.id === active);

  const startNavigation = useCallback(() => {
    if (!act?.coordinates || act.coordinates.length < 2) return;
    setOpen(false);
    setIsNavigating(true);

    const p1 = act.coordinates[0];
    const p2 = act.coordinates[1];
    const heading = getHeading(p1, p2);

    mapRef.current?.animateCamera({
      center: p1,
      pitch: 65,
      heading,
      zoom: 18,
      altitude: 50,
    }, 1200);
  }, [act]);

  const stopNavigation = useCallback(() => {
    setIsNavigating(false);
    mapRef.current?.animateCamera({
      center: { latitude: 32.5149, longitude: -117.0382 },
      pitch: 0,
      heading: 0,
      zoom: 12,
      altitude: 10000,
    }, 1000);
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <MapBase
        ref={mapRef}
        theme={theme}
        routes={isNavigating ? routes.filter(r => r.id === active) : routes}
        markers={[
          { id: 'origin', coordinate: act?.coordinates?.[0] ?? { latitude: 32.53, longitude: -117.04 }, kind: 'origin' },
          { id: 'dest', coordinate: act?.coordinates?.[act.coordinates.length - 1] ?? { latitude: 32.53, longitude: -116.97 }, kind: 'dest' }
        ]}
        viewBox="0 0 326 200"
        height="100%"
        showsUserLocation={coords !== null}>
      </MapBase>

      {!isNavigating && (
        <View style={[styles.topScrim, { zIndex: 10 }]}>
          <FromTo
            theme={theme}
            from={from}
            to={to}
            onFromChange={setFrom}
            onToChange={setTo}
            onFocusFrom={() => setFocusedField('from')}
            onFocusTo={() => setFocusedField('to')}
            onSwap={() => {
              setFrom(to);
              setTo(from);
            }}
          />
          {focusedField && filteredLocations.length > 0 && (
            <View style={[styles.suggestionsBox, { backgroundColor: theme.surface, borderColor: theme.line, shadowColor: theme.shadowColor }]}>
              <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 200 }}>
                {filteredLocations.map((loc, i) => (
                  <Pressable
                    key={loc}
                    onPress={() => handleSelectLocation(loc)}
                    style={[styles.suggestionItem, i > 0 && { borderTopWidth: 1, borderTopColor: theme.line }]}
                  >
                    <Icon name="pin" size={16} color={theme.textSoft} />
                    <Text style={[styles.suggestionText, { color: theme.text }]}>{loc}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}

      {isNavigating && (
        <View style={styles.navHeader}>
          <Icon name="chevU" size={32} color="#fff" stroke={3} />
          <View>
            <Text style={styles.navHeaderText}>En 200 m</Text>
            <Text style={styles.navHeaderSub}>Sigue derecho por {act?.name}</Text>
          </View>
        </View>
      )}

      {!isNavigating && (
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
      )}

      {isNavigating && (
        <Pressable style={styles.navExitBtn} onPress={stopNavigation}>
          <Icon name="x" size={18} color="#fff" stroke={2.5} />
          <Text style={styles.navExitText}>Salir</Text>
        </Pressable>
      )}

      {!isNavigating && (
        <BottomSheet
        theme={theme}
        peek={280}
        expanded={620}
        open={open}
        setOpen={setOpen}
        header={
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: theme.text }]}>Rutas sugeridas</Text>
            <Chip theme={theme} color={theme.gold} bg={theme.chipBg}>
              <Text style={[styles.chipText, { color: theme.gold }]}>
                {RECOMMENDED.length} alternativas
              </Text>
            </Chip>
          </View>
        }>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsRow}>
          {RECOMMENDED.map((r) => (
            <RouteCard
              key={r.id}
              rt={r}
              active={active === r.id}
              onSelect={() => setActive(r.id)}
              theme={theme}
              layout={cardLayout}
            />
          ))}
        </ScrollView>

        <Pressable 
          style={[styles.cta, { backgroundColor: theme.primary }]}
          onPress={startNavigation}
        >
          <Icon name="nav" size={17} color="#fff" fill="#fff" stroke={0} />
          <Text style={styles.ctaText}>Iniciar con {act?.name}</Text>
        </Pressable>

        <View style={styles.historyHead}>
          <Icon name="clock" size={17} color={theme.gold} />
          <Text style={[styles.historyTitle, { color: theme.text }]}>Historial</Text>
        </View>
        <HistoryPanel theme={theme} />
      </BottomSheet>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, position: 'relative' },
  topScrim: { position: 'absolute', top: 12, left: 16, right: 16, zIndex: 10 },
  suggestionsBox: {
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  suggestionText: {
    fontFamily: FR_FONTS.bodyBold,
    fontSize: 15,
  },
  navHeader: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: '#2E7D52',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    zIndex: 20,
  },
  navHeaderText: { color: '#fff', fontSize: 20, fontFamily: FR_FONTS.display },
  navHeaderSub: { color: 'rgba(255,255,255,0.8)', fontSize: 15, fontFamily: FR_FONTS.bodyBold },
  navExitBtn: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#C0573E',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    zIndex: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  navExitText: { color: '#fff', fontSize: 16, fontFamily: FR_FONTS.display },
  sheetHeader: {
    paddingHorizontal: 18,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitle: { fontFamily: FR_FONTS.display, fontSize: 17 },
  chipText: { fontFamily: FR_FONTS.bodyExtra, fontSize: 11.5 },
  cardsRow: { gap: 12, paddingHorizontal: 4, paddingVertical: 6 },
  cta: {
    height: 50,
    marginTop: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: { color: '#fff', fontFamily: FR_FONTS.display, fontSize: 15 },
  historyHead: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  historyTitle: { fontFamily: FR_FONTS.display, fontSize: 16 },
  locationBtn: {
    position: 'absolute',
    right: 16,
    bottom: 296,
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
  },
});
