import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { FRTheme } from '@/constants/fastroute-theme';

type ChipProps = {
  theme: FRTheme;
  color: string;
  bg?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Chip({ theme, color, bg, children, style }: ChipProps) {
  return (
    <View style={[styles.chip, { backgroundColor: bg ?? theme.chipBg }, style]}>
      {typeof children === 'string' ? (
        <Text style={[styles.text, { color }]}>{children}</Text>
      ) : (
        <View style={styles.row}>
          {Array.isArray(children)
            ? children.map((c, i) =>
                typeof c === 'string' ? (
                  <Text key={i} style={[styles.text, { color }]}>{c}</Text>
                ) : (
                  c
                ),
              )
            : children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  text: {
    fontSize: 11.5,
    fontWeight: '700',
    lineHeight: 14,
  },
});
