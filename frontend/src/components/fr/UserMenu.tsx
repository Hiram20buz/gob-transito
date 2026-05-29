import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, IconName } from '@/components/fr/Icon';
import { FRTheme, FR_FONTS, PALETTE } from '@/constants/fastroute-theme';

type Variant = 'user' | 'admin';

type Props = {
  theme: FRTheme;
  variant: Variant;
  name: string;
  email: string;
  onLogout: () => void;
};

export function UserMenu({ theme, variant, name, email, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const items: { icon: IconName; label: string }[] =
    variant === 'user'
      ? [
          { icon: 'user', label: 'Mi perfil' },
          { icon: 'settings', label: 'Ajustes' },
        ]
      : [];

  const gradient: readonly [string, string] =
    variant === 'admin' ? [theme.gold, PALETTE.bronze] : [theme.primary, PALETTE.guindaDk];
  const avatarChild =
    variant === 'admin' ? (
      <Icon name="shield" size={19} color={theme.onGold} />
    ) : (
      <Text style={[styles.avatarText, { color: '#fff' }]}>JA</Text>
    );

  return (
    <View>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Abrir menú de usuario"
        style={[
          styles.trigger,
          {
            borderColor: theme.line,
            shadowColor: theme.shadowColor,
            shadowOpacity: theme.shadowOpacity,
          },
        ]}>
        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.triggerInner}>
          {avatarChild}
        </LinearGradient>
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable
            style={[
              styles.menu,
              {
                backgroundColor: theme.surface,
                borderColor: theme.line,
                shadowColor: theme.shadowColor,
                shadowOpacity: theme.shadowOpacity,
              },
            ]}>
            <View style={[styles.menuHead, { borderBottomColor: theme.line }]}>
              <Text style={[styles.menuName, { color: theme.text }]}>{name}</Text>
              <Text style={[styles.menuEmail, { color: theme.textSoft }]}>{email}</Text>
            </View>
            {items.map((it) => (
              <Pressable key={it.label} style={styles.menuItem}>
                <Icon name={it.icon} size={16} color={theme.textSoft} />
                <Text style={[styles.menuItemText, { color: theme.text }]}>{it.label}</Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => {
                setOpen(false);
                onLogout();
              }}
              style={styles.menuItem}>
              <Icon name="logout" size={16} color="#C0573E" />
              <Text style={[styles.menuItemText, { color: '#C0573E' }]}>Cerrar sesión</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 3,
  },
  triggerInner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: FR_FONTS.display, fontSize: 14 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingTop: 110,
    paddingRight: 16,
    alignItems: 'flex-end',
  },
  menu: {
    width: 210,
    borderRadius: 14,
    padding: 6,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 22,
    elevation: 6,
  },
  menuHead: { padding: 10, borderBottomWidth: 1, marginBottom: 4 },
  menuName: { fontFamily: FR_FONTS.bodyExtra, fontSize: 13.5 },
  menuEmail: { fontFamily: FR_FONTS.body, fontSize: 11.5 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 9,
  },
  menuItemText: { fontFamily: FR_FONTS.bodyBold, fontSize: 13.5 },
});
