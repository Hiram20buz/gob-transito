import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/fr/Chip';
import { Icon } from '@/components/fr/Icon';
import { CHART_DATA } from '@/constants/fastroute-mock';
import { FRTheme, FR_FONTS, PALETTE } from '@/constants/fastroute-theme';

type Props = { theme: FRTheme };

export function BarChart({ theme }: Props) {
  const max = Math.max(...CHART_DATA.map((d) => d.v));
  const peakIndex = CHART_DATA.findIndex((d) => d.v === max);

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: theme.surface,
          borderColor: theme.line,
          shadowColor: theme.shadowColor,
          shadowOpacity: theme.dark ? 0 : 0.3,
        },
      ]}>
      <View style={styles.head}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Viajes por día</Text>
          <Text style={[styles.subtitle, { color: theme.textSoft }]}>Última semana</Text>
        </View>
        <Chip theme={theme} color="#3F9B6B" bg="#3F9B6B1e">
          <Icon name="chevU" size={12} color="#3F9B6B" stroke={3} />
          <Text style={[styles.deltaText, { color: '#3F9B6B' }]}>+18%</Text>
        </Chip>
      </View>

      <View style={styles.barsRow}>
        {CHART_DATA.map((d, i) => {
          const heightPct = (d.v / max) * 100;
          const isPeak = i === peakIndex;
          return (
            <View key={i} style={styles.barCol}>
              <View style={styles.barFill}>
                {isPeak ? (
                  <LinearGradient
                    colors={[theme.gold, PALETTE.bronze]}
                    style={[styles.bar, { height: `${heightPct}%` }]}
                  />
                ) : (
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${heightPct}%`,
                        backgroundColor: theme.chipBg,
                        borderWidth: 1,
                        borderColor: theme.line,
                      },
                    ]}
                  />
                )}
              </View>
              <Text style={[styles.barLabel, { color: theme.textSoft }]}>{d.d}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 2,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: { fontFamily: FR_FONTS.display, fontSize: 15 },
  subtitle: { fontFamily: FR_FONTS.bodyBold, fontSize: 11.5 },
  deltaText: { fontFamily: FR_FONTS.bodyExtra, fontSize: 11 },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
    height: 120,
  },
  barCol: { flex: 1, alignItems: 'center', gap: 7, height: '100%', justifyContent: 'flex-end' },
  barFill: { width: '100%', maxWidth: 26, height: '100%', justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 7 },
  barLabel: { fontFamily: FR_FONTS.bodyBold, fontSize: 11 },
});
