import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AdminApprovals } from '@/components/fr/AdminApprovals';
import { AdminReports } from '@/components/fr/AdminReports';
import { SegTabs } from '@/components/fr/SegTabs';
import { UserMenu } from '@/components/fr/UserMenu';
import { TEST_USERS } from '@/constants/fastroute-mock';
import { useFRTheme } from '@/constants/fastroute-theme';

export default function AdminAppRoute() {
  const theme = useFRTheme();
  const [page, setPage] = useState(0);

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.bg }]}
      edges={['top']}>
      <View style={styles.topBar}>
        <View style={{ flex: 1 }}>
          <SegTabs
            tabs={['Reportes', 'Aprobaciones']}
            index={page}
            setIndex={setPage}
            theme={theme}
          />
        </View>
        <UserMenu
          theme={theme}
          variant="admin"
          name={TEST_USERS.admin.name}
          email={TEST_USERS.admin.email}
          onLogout={() => router.replace('/')}
        />
      </View>

      <View style={styles.pages}>
        {page === 0 ? <AdminReports theme={theme} /> : <AdminApprovals theme={theme} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  pages: { flex: 1 },
});
