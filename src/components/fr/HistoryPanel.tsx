import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/fr/Icon';
import { HISTORY, HistoryItem } from '@/constants/fastroute-mock';
import { FRTheme, FR_FONTS } from '@/constants/fastroute-theme';

type Props = { theme: FRTheme };

export function HistoryPanel({ theme }: Props) {
  const [tab, setTab] = useState<0 | 1>(0);
  const [favs, setFavs] = useState<Record<string, boolean>>(
    () => Object.fromEntries(HISTORY.map((h) => [h.id, h.fav])),
  );
  const rows: HistoryItem[] = HISTORY.filter((h) => tab === 0 || favs[h.id]);

  return (
    <View>
      <View style={[styles.tabsRow, { borderBottomColor: theme.line }]}>
        {(['Recientes', 'Favoritas'] as const).map((t, i) => {
          const on = tab === i;
          return (
            <Pressable
              key={t}
              onPress={() => setTab(i as 0 | 1)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              style={[styles.tab, { borderBottomColor: on ? theme.primary : 'transparent' }]}>
              <Text
                style={[
                  styles.tabLabel,
                  { color: on ? theme.primary : theme.textSoft },
                ]}>
                {t}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {rows.map((h) => {
        const isFav = !!favs[h.id];
        return (
          <View key={h.id} style={[styles.row, { borderBottomColor: theme.line }]}>
            <View style={[styles.rowIcon, { backgroundColor: theme.chipBg }]}>
              <Icon name="clock" size={18} color={theme.gold} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={[styles.rowTitle, { color: theme.text }]} numberOfLines={1}>
                {h.from} → {h.to}
              </Text>
              <Text style={[styles.rowMeta, { color: theme.textSoft }]}>
                {h.date} · {h.dist} km · {h.min} min
              </Text>
            </View>
            <Pressable
              onPress={() => setFavs((f) => ({ ...f, [h.id]: !f[h.id] }))}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={isFav ? 'Quitar de favoritos' : 'Marcar como favorito'}>
              <Icon
                name="star"
                size={20}
                color={isFav ? theme.gold : theme.textFaint}
                fill={isFav ? theme.gold : 'none'}
                stroke={isFav ? 0 : 2}
              />
            </Pressable>
          </View>
        );
      })}

      {rows.length === 0 && (
        <Text style={[styles.empty, { color: theme.textFaint }]}>
          Sin rutas favoritas todavía.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsRow: {
    flexDirection: 'row',
    gap: 18,
    borderBottomWidth: 1,
    marginBottom: 6,
  },
  tab: { paddingVertical: 8, borderBottomWidth: 2.5, marginBottom: -1 },
  tabLabel: { fontFamily: FR_FONTS.bodyBold, fontSize: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { fontFamily: FR_FONTS.bodyBold, fontSize: 14 },
  rowMeta: { fontFamily: FR_FONTS.bodyBold, fontSize: 12 },
  empty: {
    textAlign: 'center',
    padding: 30,
    fontFamily: FR_FONTS.bodyBold,
    fontSize: 13,
  },
});
