import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FRTheme, FR_FONTS } from '@/constants/fastroute-theme';
import { Icon } from '@/components/fr/Icon';

export type Role = 'user' | 'admin';

type Props = {
  role: Role;
  setRole: (r: Role) => void;
  theme: FRTheme;
};

const OPTIONS: { k: Role; label: string; icon: 'user' | 'shield' }[] = [
  { k: 'user', label: 'Usuario', icon: 'user' },
  { k: 'admin', label: 'Administrador', icon: 'shield' },
];

export function RoleToggle({ role, setRole, theme }: Props) {
  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: theme.dark ? 'rgba(0,0,0,0.25)' : 'rgba(58,11,29,0.06)' },
      ]}>
      {OPTIONS.map((o) => {
        const on = role === o.k;
        return (
          <Pressable
            key={o.k}
            onPress={() => setRole(o.k)}
            style={[
              styles.btn,
              {
                backgroundColor: on ? theme.primary : 'transparent',
                shadowOpacity: on ? 0.6 : 0,
              },
            ]}>
            <Icon name={o.icon} size={17} color={on ? '#fff' : theme.textSoft} />
            <Text
              style={[
                styles.label,
                { color: on ? '#fff' : theme.textSoft },
              ]}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: 8,
    padding: 5,
    borderRadius: 15,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    borderRadius: 11,
    shadowColor: '#611232',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
  },
  label: {
    fontFamily: FR_FONTS.bodyBold,
    fontSize: 14,
  },
});
