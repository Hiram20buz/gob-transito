import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SegTabs } from '@/components/fr/SegTabs';
import { UserHome } from '@/components/fr/UserHome';
import { UserMenu } from '@/components/fr/UserMenu';
import { UserPersonalized } from '@/components/fr/UserPersonalized';
import { TEST_USERS } from '@/constants/fastroute-mock';
import { useFRTheme } from '@/constants/fastroute-theme';

export default function UserAppRoute() {
  const theme = useFRTheme();
  const [page, setPage] = useState(0);

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.bg }]}
      edges={['top']}>
      <View style={styles.topBar}>
        <View style={{ flex: 1 }}>
          <SegTabs
            tabs={['Recomendadas', 'Personalizada']}
            index={page}
            setIndex={setPage}
            theme={theme}
          />
        </View>
        <UserMenu
          theme={theme}
          variant="user"
          name={TEST_USERS.user.name}
          email={TEST_USERS.user.email}
          onLogout={() => router.replace('/')}
        />
      </View>

      <View style={styles.pages}>
        {page === 0 ? (
          <UserHome theme={theme} cardLayout="rich" />
        ) : (
          <UserPersonalized theme={theme} trackingStyle="pins" />
        )}
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
