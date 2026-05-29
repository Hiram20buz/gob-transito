import { StyleSheet, Text, View } from 'react-native';

import { Icon, IconName } from '@/components/fr/Icon';
import { FRTheme, FR_FONTS } from '@/constants/fastroute-theme';

type Props = {
  theme: FRTheme;
  icon: IconName;
  value: string;
  label: string;
  delta?: string;
  up?: boolean;
};

export function KpiCard({ theme, icon, value, label, delta, up }: Props) {
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
        <View style={[styles.iconWrap, { backgroundColor: theme.chipBg }]}>
          <Icon name={icon} size={18} color={theme.gold} />
        </View>
        {delta != null && (
          <View style={styles.delta}>
            <Icon name={up ? 'chevU' : 'chevD'} size={12} color={up ? '#3F9B6B' : '#C0573E'} stroke={3} />
            <Text style={[styles.deltaText, { color: up ? '#3F9B6B' : '#C0573E' }]}>{delta}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.label, { color: theme.textSoft }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    minWidth: 0,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 2,
  },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  delta: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  deltaText: { fontFamily: FR_FONTS.bodyExtra, fontSize: 11 },
  value: { fontFamily: FR_FONTS.display, fontSize: 26, marginTop: 10, lineHeight: 28 },
  label: { fontFamily: FR_FONTS.bodyBold, fontSize: 12, marginTop: 4 },
});
