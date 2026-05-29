import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ApprovalCard, ApprovalStatus } from '@/components/fr/ApprovalCard';
import { Chip } from '@/components/fr/Chip';
import { APPROVALS } from '@/constants/fastroute-mock';
import { FRTheme, FR_FONTS } from '@/constants/fastroute-theme';

type Props = { theme: FRTheme };

export function AdminApprovals({ theme }: Props) {
  const [status, setStatus] = useState<Record<string, ApprovalStatus>>(
    () => Object.fromEntries(APPROVALS.map((a) => [a.id, 'pending'])),
  );
  const pending = APPROVALS.filter((a) => status[a.id] === 'pending').length;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <View style={styles.head}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.h2, { color: theme.text }]}>Aprobación de rutas</Text>
          <Text style={[styles.sub, { color: theme.textSoft }]}>
            Rutas personalizadas enviadas por usuarios
          </Text>
        </View>
        <Chip
          theme={theme}
          color="#fff"
          bg={pending ? theme.primary : '#3F9B6B'}
          style={styles.pendChip}>
          <Text style={styles.pendText}>{pending} pendientes</Text>
        </Chip>
      </View>

      <View style={{ gap: 12 }}>
        {APPROVALS.map((a) => (
          <ApprovalCard
            key={a.id}
            theme={theme}
            item={a}
            status={status[a.id]}
            onSet={(s) => setStatus((p) => ({ ...p, [a.id]: s }))}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 28 },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 16,
  },
  h2: { fontFamily: FR_FONTS.display, fontSize: 21, marginBottom: 2 },
  sub: { fontFamily: FR_FONTS.body, fontSize: 13 },
  pendChip: { paddingHorizontal: 11, paddingVertical: 6 },
  pendText: { color: '#fff', fontFamily: FR_FONTS.bodyExtra, fontSize: 13 },
});
