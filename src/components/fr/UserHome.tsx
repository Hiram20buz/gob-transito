import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BottomSheet } from '@/components/fr/BottomSheet';
import { Chip } from '@/components/fr/Chip';
import { FromTo } from '@/components/fr/FromTo';
import { HistoryPanel } from '@/components/fr/HistoryPanel';
import { Icon } from '@/components/fr/Icon';
import { MapBase, MapPin, type MapRoute } from '@/components/fr/MapBase';
import { RouteCard, RouteCardLayout } from '@/components/fr/RouteCard';
import { RECOMMENDED } from '@/constants/fastroute-mock';
import { FRTheme, FR_FONTS } from '@/constants/fastroute-theme';

type Props = {
  theme: FRTheme;
  cardLayout?: RouteCardLayout;
};

export function UserHome({ theme, cardLayout = 'rich' }: Props) {
  const [active, setActive] = useState('r1');
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState('Casa');
  const [to, setTo] = useState('Oficina Reforma');

  const routes = useMemo<MapRoute[]>(
    () =>
      RECOMMENDED.map((r) => ({
        id: r.id,
        path: r.path,
        color: r.color,
        width: r.id === active ? 8 : 5,
        glow: r.id === active,
        active: r.id === active,
      })),
    [active],
  );
  const act = RECOMMENDED.find((r) => r.id === active);

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <MapBase theme={theme} routes={routes} viewBox="0 0 326 200" height="100%">
        <MapPin theme={theme} left="4%" top="75%" kind="origin" />
        <MapPin theme={theme} left="95%" top="15%" kind="dest" />
      </MapBase>

      <View style={styles.topScrim}>
        <FromTo
          theme={theme}
          from={from}
          to={to}
          onSwap={() => {
            setFrom(to);
            setTo(from);
          }}
        />
      </View>

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

        <Pressable style={[styles.cta, { backgroundColor: theme.primary }]}>
          <Icon name="nav" size={17} color="#fff" fill="#fff" stroke={0} />
          <Text style={styles.ctaText}>Iniciar con {act?.name}</Text>
        </Pressable>

        <View style={styles.historyHead}>
          <Icon name="clock" size={17} color={theme.gold} />
          <Text style={[styles.historyTitle, { color: theme.text }]}>Historial</Text>
        </View>
        <HistoryPanel theme={theme} />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, position: 'relative' },
  topScrim: { position: 'absolute', top: 12, left: 16, right: 16 },
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
});
