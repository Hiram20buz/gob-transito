import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/fr/Icon';
import { FRTheme, FR_FONTS } from '@/constants/fastroute-theme';

type Props = {
  theme: FRTheme;
  from: string;
  to: string;
  onSwap?: () => void;
};

export function FromTo({ theme, from, to, onSwap }: Props) {
  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: theme.surface,
          borderColor: theme.line,
          shadowColor: theme.shadowColor,
          shadowOpacity: theme.shadowOpacity,
        },
      ]}>
      <View style={styles.dots}>
        <View style={[styles.originRing, { borderColor: theme.primary }]} />
        <View style={[styles.dotLine, { backgroundColor: theme.line }]} />
        <Icon name="pin" size={15} color={theme.gold} fill={theme.gold} stroke={0} />
      </View>
      <View style={styles.col}>
        <Text style={[styles.row, { color: theme.text }]} numberOfLines={1}>{from}</Text>
        <View style={[styles.divider, { backgroundColor: theme.line }]} />
        <Text style={[styles.row, { color: theme.text }]} numberOfLines={1}>{to}</Text>
      </View>
      <Pressable
        onPress={onSwap}
        accessibilityRole="button"
        accessibilityLabel="Intercambiar origen y destino"
        style={[
          styles.swapBtn,
          { backgroundColor: theme.surfaceAlt, borderColor: theme.line },
        ]}>
        <Icon name="swap" size={18} color={theme.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 4,
  },
  dots: { alignItems: 'center', gap: 4, paddingTop: 2 },
  originRing: { width: 11, height: 11, borderRadius: 6, borderWidth: 3 },
  dotLine: { width: 2, height: 18, borderRadius: 2 },
  col: { flex: 1, gap: 6 },
  row: { fontFamily: FR_FONTS.bodyBold, fontSize: 14.5 },
  divider: { height: 1 },
  swapBtn: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
