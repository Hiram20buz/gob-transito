import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

import { Chip } from '@/components/fr/Chip';
import { Icon } from '@/components/fr/Icon';
import { Approval } from '@/constants/fastroute-mock';
import { FRTheme, FR_FONTS, ROUTE_COLORS } from '@/constants/fastroute-theme';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

type Props = {
  theme: FRTheme;
  item: Approval;
  status: ApprovalStatus;
  onSet: (s: ApprovalStatus) => void;
};

export function ApprovalCard({ theme, item, status, onSet }: Props) {
  const done = status !== 'pending';
  const startMatch = item.path.match(/M\d+,(\d+)/);
  const startY = startMatch ? Number(startMatch[1]) : 50;
  const borderColor =
    status === 'approved' ? '#3F9B6B88' : status === 'rejected' ? '#C0573E88' : theme.line;

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: theme.surface,
          borderColor,
          shadowColor: theme.shadowColor,
          shadowOpacity: theme.dark ? 0 : 0.3,
          opacity: done ? 0.92 : 1,
        },
      ]}>
      <View style={styles.header}>
        <View style={[styles.preview, { backgroundColor: theme.surface2, borderColor: theme.line }]}>
          <Svg viewBox="0 0 240 100" preserveAspectRatio="none" width="100%" height="100%">
            <Rect width={240} height={100} fill={theme.dark ? '#2a1320' : '#efe7da'} />
            {[25, 55, 80].map((y, i) => (
              <Line key={`h${i}`} x1={0} y1={y} x2={240} y2={y} stroke={theme.line} strokeWidth={2} />
            ))}
            {[60, 130, 190].map((x, i) => (
              <Line key={`v${i}`} x1={x} y1={0} x2={x} y2={100} stroke={theme.line} strokeWidth={2} />
            ))}
            <Path d={item.path} fill="none" stroke={ROUTE_COLORS.personal} strokeWidth={4.5} strokeLinecap="round" />
            <Circle cx={10} cy={startY} r={5} fill="#3F9B6B" stroke="#fff" strokeWidth={2} />
          </Svg>
        </View>

        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={styles.userRow}>
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              <Text style={styles.avatarText}>{item.user[0]}</Text>
            </View>
            <Text style={[styles.userName, { color: theme.text }]} numberOfLines={1}>
              {item.user}
            </Text>
            <Text style={[styles.date, { color: theme.textFaint }]} numberOfLines={1}>
              {item.date}
            </Text>
          </View>
          <Text style={[styles.route, { color: theme.text }]} numberOfLines={1}>
            {item.from} → {item.to}
          </Text>
          <View style={styles.chipsRow}>
            <Chip theme={theme} color={theme.textSoft} bg={theme.surface2}>
              <Icon name="route" size={11} color={theme.gold} />
              <Text style={[styles.chipText, { color: theme.textSoft }]}>{item.dist} km</Text>
            </Chip>
            <Chip theme={theme} color={theme.textSoft} bg={theme.surface2}>
              <Icon name="target" size={11} color={ROUTE_COLORS.personal} />
              <Text style={[styles.chipText, { color: theme.textSoft }]}>{item.points} pts</Text>
            </Chip>
          </View>
        </View>
      </View>

      {done ? (
        <View
          style={[
            styles.doneBar,
            { backgroundColor: status === 'approved' ? '#3F9B6B14' : '#C0573E14' },
          ]}>
          <Icon
            name={status === 'approved' ? 'check' : 'x'}
            size={16}
            color={status === 'approved' ? '#3F9B6B' : '#C0573E'}
            stroke={3}
          />
          <Text
            style={[
              styles.doneText,
              { color: status === 'approved' ? '#2E7D52' : '#C0573E' },
            ]}>
            {status === 'approved' ? 'Ruta aprobada' : 'Ruta rechazada'}
          </Text>
          <Pressable onPress={() => onSet('pending')} hitSlop={6}>
            <Text style={[styles.undo, { color: theme.textSoft }]}>Deshacer</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.actions}>
          <Pressable
            onPress={() => onSet('rejected')}
            accessibilityRole="button"
            accessibilityLabel="Rechazar ruta"
            style={[styles.btn, styles.rejectBtn]}>
            <Icon name="x" size={16} color="#C0573E" stroke={2.6} />
            <Text style={[styles.btnText, { color: '#C0573E' }]}>Rechazar</Text>
          </Pressable>
          <Pressable
            onPress={() => onSet('approved')}
            accessibilityRole="button"
            accessibilityLabel="Aprobar ruta"
            style={[styles.btn, styles.approveBtn]}>
            <Icon name="check" size={16} color="#fff" stroke={2.8} />
            <Text style={[styles.btnText, { color: '#fff' }]}>Aprobar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 2,
  },
  header: { flexDirection: 'row', gap: 12, padding: 14 },
  preview: {
    width: 88,
    height: 70,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 3 },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontFamily: FR_FONTS.bodyExtra, fontSize: 10 },
  userName: { fontFamily: FR_FONTS.bodyBold, fontSize: 13, flex: 1, minWidth: 0 },
  date: { fontFamily: FR_FONTS.bodyBold, fontSize: 11 },
  route: { fontFamily: FR_FONTS.display, fontSize: 14.5 },
  chipsRow: { flexDirection: 'row', gap: 7, marginTop: 7 },
  chipText: { fontFamily: FR_FONTS.bodyBold, fontSize: 11.5 },
  actions: { flexDirection: 'row', gap: 9, paddingHorizontal: 14, paddingBottom: 14 },
  btn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  rejectBtn: { borderWidth: 1.5, borderColor: '#C0573E88', backgroundColor: 'transparent' },
  approveBtn: { backgroundColor: '#2E7D52' },
  btnText: { fontFamily: FR_FONTS.bodyExtra, fontSize: 13.5 },
  doneBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  doneText: { fontFamily: FR_FONTS.bodyBold, fontSize: 13, flex: 1 },
  undo: { fontFamily: FR_FONTS.bodyBold, fontSize: 12 },
});
