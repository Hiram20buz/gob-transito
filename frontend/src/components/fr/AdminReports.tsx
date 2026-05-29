import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BarChart } from '@/components/fr/BarChart';
import { Icon } from '@/components/fr/Icon';
import { KpiCard } from '@/components/fr/KpiCard';
import { FILE_TINT, REPORTS } from '@/constants/fastroute-mock';
import { FRTheme, FR_FONTS } from '@/constants/fastroute-theme';

type Props = { theme: FRTheme };

export function AdminReports({ theme }: Props) {
  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Text style={[styles.h2, { color: theme.text }]}>Reportes y estadísticas</Text>
      <Text style={[styles.sub, { color: theme.textSoft }]}>
        Resumen operativo de la red de rutas
      </Text>

      <View style={styles.grid}>
        <View style={styles.gridRow}>
          <KpiCard theme={theme} icon="route" value="12,840" label="Rutas trazadas" delta="12%" up />
          <KpiCard theme={theme} icon="users" value="3,210" label="Usuarios activos" delta="8%" up />
        </View>
        <View style={styles.gridRow}>
          <KpiCard theme={theme} icon="flag" value="46" label="Aprob. pendientes" delta="5%" up={false} />
          <KpiCard theme={theme} icon="gauge" value="9.4 km" label="Distancia promedio" delta="3%" up />
        </View>
      </View>

      <View style={{ marginTop: 16, marginBottom: 16 }}>
        <BarChart theme={theme} />
      </View>

      <View style={styles.filesHead}>
        <Text style={[styles.filesTitle, { color: theme.text }]}>Archivos de reporte</Text>
        <Text style={[styles.filesAll, { color: theme.primary }]}>Ver todos</Text>
      </View>

      <View style={{ gap: 9 }}>
        {REPORTS.map((f) => {
          const tint = FILE_TINT[f.type] ?? theme.gold;
          return (
            <View
              key={f.id}
              style={[
                styles.fileRow,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.line,
                  shadowColor: theme.shadowColor,
                  shadowOpacity: theme.dark ? 0 : 0.25,
                },
              ]}>
              <View style={[styles.fileIcon, { backgroundColor: tint + '1c' }]}>
                <Icon name="file" size={20} color={tint} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[styles.fileName, { color: theme.text }]} numberOfLines={1}>
                  {f.name}
                </Text>
                <Text style={[styles.fileMeta, { color: theme.textSoft }]}>
                  <Text style={[styles.fileType, { color: tint }]}>{f.type}</Text>
                  {' · '}
                  {f.size}
                  {' · '}
                  {f.date}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Descargar ${f.name}`}
                style={[
                  styles.dlBtn,
                  { backgroundColor: theme.surfaceAlt, borderColor: theme.line },
                ]}>
                <Icon name="download" size={18} color={theme.primary} />
              </Pressable>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 28 },
  h2: { fontFamily: FR_FONTS.display, fontSize: 21, marginBottom: 2 },
  sub: { fontFamily: FR_FONTS.body, fontSize: 13, marginBottom: 16 },
  grid: { gap: 11 },
  gridRow: { flexDirection: 'row', gap: 11 },
  filesHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filesTitle: { fontFamily: FR_FONTS.display, fontSize: 16 },
  filesAll: { fontFamily: FR_FONTS.bodyExtra, fontSize: 12.5 },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 13,
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 1,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: { fontFamily: FR_FONTS.bodyBold, fontSize: 14 },
  fileMeta: { fontFamily: FR_FONTS.bodyBold, fontSize: 11.5, marginTop: 2 },
  fileType: { fontFamily: FR_FONTS.bodyExtra },
  dlBtn: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
