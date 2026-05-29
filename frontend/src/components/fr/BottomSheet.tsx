import { ReactNode, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { FRTheme } from '@/constants/fastroute-theme';

type Props = {
  theme: FRTheme;
  peek: number;
  expanded: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  header?: ReactNode;
  children?: ReactNode;
};

export function BottomSheet({ theme, peek, expanded, open, setOpen, header, children }: Props) {
  const height = useRef(new Animated.Value(open ? expanded : peek)).current;

  useEffect(() => {
    Animated.timing(height, {
      toValue: open ? expanded : peek,
      duration: 360,
      useNativeDriver: false,
    }).start();
  }, [open, expanded, peek, height]);

  return (
    <Animated.View
      style={[
        styles.wrap,
        {
          height,
          backgroundColor: theme.surface,
          borderColor: theme.line,
        },
      ]}>
      <Pressable
        onPress={() => setOpen(!open)}
        accessibilityRole="button"
        accessibilityLabel={open ? 'Contraer panel' : 'Expandir panel'}
        style={styles.handleHit}>
        <View style={[styles.handle, { backgroundColor: theme.lineStrong }]} />
      </Pressable>
      {header}
      <View style={styles.body}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    borderBottomWidth: 0,
    shadowColor: '#3A0B1D',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: -8 },
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
  },
  handleHit: { paddingVertical: 10, alignItems: 'center' },
  handle: { width: 40, height: 5, borderRadius: 3 },
  body: { flex: 1, paddingHorizontal: 18, paddingBottom: 22 },
});
