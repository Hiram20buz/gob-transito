import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { FR_FONTS } from '@/constants/fastroute-theme';

type Props = { color?: string };

export function FRStatusBar({ color = '#2B0A12' }: Props) {
  return (
    <View style={styles.bar} pointerEvents="none">
      <Text style={[styles.time, { color }]}>9:41</Text>
      <View style={styles.icons}>
        <Svg width={17} height={12} viewBox="0 0 17 12" fill={color}>
          <Rect x="0" y="7" width="3" height="5" rx="1" />
          <Rect x="4.5" y="4.5" width="3" height="7.5" rx="1" />
          <Rect x="9" y="2" width="3" height="10" rx="1" />
          <Rect x="13.5" y="0" width="3" height="12" rx="1" opacity={0.35} />
        </Svg>
        <Svg width={16} height={12} viewBox="0 0 16 12" fill="none" stroke={color} strokeWidth={1.4}>
          <Path d="M1 4.5a10 10 0 0 1 14 0M3.5 7a6.5 6.5 0 0 1 9 0M6 9.4a3 3 0 0 1 4 0" />
        </Svg>
        <Svg width={26} height={13} viewBox="0 0 26 13" fill="none">
          <Rect x="1" y="1" width="21" height="11" rx="3" stroke={color} strokeWidth={1.2} opacity={0.5} />
          <Rect x="2.6" y="2.6" width="16" height="7.8" rx="1.6" fill={color} />
          <Rect x="23" y="4.5" width="2" height="4" rx="1" fill={color} opacity={0.5} />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    zIndex: 60,
  },
  time: {
    fontFamily: FR_FONTS.displayBold,
    fontSize: 14,
    letterSpacing: 0.3,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
