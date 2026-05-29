import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Chip } from '@/components/fr/Chip';
import { Icon } from '@/components/fr/Icon';
import { FRTheme, FR_FONTS } from '@/constants/fastroute-theme';
import { Recommended, TRAFFIC } from '@/constants/fastroute-mock';

export type RouteCardLayout = 'rich' | 'compact';

type Props = {
  rt: Recommended;
  active: boolean;
  onSelect: () => void;
  theme: FRTheme;
  layout: RouteCardLayout;
};

export function RouteCard({ rt, active, onSelect, theme, layout }: Props) {
  const tr = TRAFFIC[rt.traffic];
  const border = active ? rt.color : theme.line;

  if (layout === 'compact') {
    return (
      <Pressable
        onPress={onSelect}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        style={[
          styles.compact,
          {
            backgroundColor: theme.surface,
            borderColor: border,
            shadowColor: active ? rt.color : '#000',
            shadowOpacity: active ? 0.5 : 0,
          },
        ]}>
        <View style={styles.compactRow}>
          <View style={[styles.iconWrap, { backgroundColor: rt.color + '22' }]}>
            <Icon name={rt.icon} size={16} color={rt.color} fill={rt.color} stroke={0} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.text }]}>{rt.name}</Text>
            <Text style={[styles.subtle, { color: theme.textSoft }]}>{rt.tag}</Text>
          </View>
          <Text style={[styles.eta, { color: rt.color }]}>
            {rt.eta}
            <Text style={[styles.etaUnit, { color: theme.textSoft }]}> min</Text>
          </Text>
        </View>
        <View style={styles.compactMeta}>
          <Text style={[styles.metaText, { color: theme.textSoft }]}>{rt.dist} km</Text>
          <Chip theme={theme} color={tr.color} bg={tr.color + '1e'}>
            <View style={[styles.dot, { backgroundColor: tr.color }]} />
            <Text style={[styles.chipText, { color: tr.color }]}>{tr.label}</Text>
          </Chip>
          <Text style={[styles.cost, { color: theme.text }]}>${rt.cost}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[
        styles.rich,
        {
          backgroundColor: theme.surface,
          borderColor: border,
          shadowColor: active ? rt.color : theme.shadowColor,
          shadowOpacity: active ? 0.6 : 0.2,
        },
      ]}>
      <View style={[styles.preview, { backgroundColor: theme.surface2 }]}>
        <Svg
          viewBox="0 0 326 200"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          style={StyleSheet.absoluteFill}>
          <Path
            d={rt.path}
            fill="none"
            stroke={rt.color}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </Svg>
        <View style={styles.previewTag}>
          <Chip theme={theme} color="#fff" bg={rt.color}>
            <Icon name={rt.icon} size={12} color="#fff" fill="#fff" stroke={0} />
            <Text style={[styles.chipText, { color: '#fff' }]}>{rt.tag}</Text>
          </Chip>
        </View>
        {active && (
          <View style={[styles.previewCheck, { backgroundColor: rt.color }]}>
            <Icon name="check" size={13} color="#fff" stroke={3} />
          </View>
        )}
      </View>

      <View style={styles.richBody}>
        <View style={styles.richHeader}>
          <Text style={[styles.richTitle, { color: theme.text }]}>{rt.name}</Text>
          <Text style={[styles.richEta, { color: rt.color }]}>
            {rt.eta}
            <Text style={[styles.richEtaUnit, { color: theme.textSoft }]}> min</Text>
          </Text>
        </View>
        <View style={styles.richStats}>
          {[
            { ic: 'route' as const, v: `${rt.dist} km`, c: theme.gold },
            { ic: 'gauge' as const, v: tr.label, c: tr.color },
            { ic: 'money' as const, v: `$${rt.cost}`, c: theme.gold },
          ].map((s, i) => (
            <View key={i} style={[styles.stat, { backgroundColor: theme.surfaceAlt }]}>
              <Icon name={s.ic} size={15} color={s.c} />
              <Text style={[styles.statValue, { color: s.ic === 'gauge' ? s.c : theme.text }]}>{s.v}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  compact: {
    width: 250,
    flexShrink: 0,
    borderRadius: 18,
    borderWidth: 2,
    padding: 14,
    gap: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
  },
  compactRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: FR_FONTS.display, fontSize: 14.5 },
  subtle: { fontFamily: FR_FONTS.bodyBold, fontSize: 11.5 },
  eta: { fontFamily: FR_FONTS.display, fontSize: 22 },
  etaUnit: { fontFamily: FR_FONTS.body, fontSize: 12 },
  compactMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontFamily: FR_FONTS.bodyBold, fontSize: 12.5 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  chipText: { fontFamily: FR_FONTS.bodyBold, fontSize: 11.5 },
  cost: { fontFamily: FR_FONTS.bodyExtra, fontSize: 13, marginLeft: 'auto' },
  rich: {
    width: 268,
    flexShrink: 0,
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 24,
    elevation: 5,
  },
  preview: { height: 76, position: 'relative' },
  previewTag: { position: 'absolute', top: 10, left: 10 },
  previewCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  richBody: { padding: 14 },
  richHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  richTitle: { fontFamily: FR_FONTS.display, fontSize: 16 },
  richEta: { fontFamily: FR_FONTS.display, fontSize: 26 },
  richEtaUnit: { fontFamily: FR_FONTS.bodyBold, fontSize: 12 },
  richStats: { flexDirection: 'row', gap: 7, marginTop: 12 },
  stat: {
    flex: 1,
    borderRadius: 11,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 3,
  },
  statValue: { fontFamily: FR_FONTS.bodyExtra, fontSize: 12.5 },
});
