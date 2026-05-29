import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FRTheme, FR_FONTS } from '@/constants/fastroute-theme';

type Props = {
  tabs: string[];
  index: number;
  setIndex: (i: number) => void;
  theme: FRTheme;
};

export function SegTabs({ tabs, index, setIndex, theme }: Props) {
  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: theme.dark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.9)',
          borderColor: theme.line,
          shadowColor: theme.shadowColor,
          shadowOpacity: theme.shadowOpacity,
        },
      ]}>
      {tabs.map((t, i) => {
        const on = i === index;
        return (
          <Pressable
            key={t}
            onPress={() => setIndex(i)}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            style={[styles.btn, { backgroundColor: on ? theme.primary : 'transparent' }]}>
            <Text style={[styles.label, { color: on ? '#fff' : theme.textSoft }]}>{t}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    borderRadius: 13,
    padding: 4,
    gap: 4,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 3,
  },
  btn: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: FR_FONTS.bodyBold,
    fontSize: 13.5,
  },
});
