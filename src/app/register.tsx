import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatusBar } from 'expo-status-bar';

import { Field } from '@/components/fr/Field';
import { Icon } from '@/components/fr/Icon';
import { Logo, Wordmark } from '@/components/fr/Logo';
import { FR_FONTS, PALETTE, useFRTheme } from '@/constants/fastroute-theme';
import { registerUser } from '@/lib/api';
import { estadosRepublica } from '@/utils/constant';

type FormState = {
  nombre: string;
  apellido: string;
  fecha_de_nacimiento: string;
  estado: string;
  ciudad: string;
  correo_electronico: string;
  password: string;
  role: string;
};

const EMPTY: FormState = {
  nombre: '',
  apellido: '',
  fecha_de_nacimiento: '',
  estado: '',
  ciudad: '',
  correo_electronico: '',
  password: '',
  role: 'user',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{2}\/\d{2}\/\d{4}$/;

function toDDMMYYYY(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function RegisterScreen() {
  const theme = useFRTheme();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [estadoPickerOpen, setEstadoPickerOpen] = useState(false);
  const [ciudadPickerOpen, setCiudadPickerOpen] = useState(false);

  // Derived state for available cities
  const selectedEstadoObj = estadosRepublica.find(e => e.nombre === form.estado);
  const availableCiudades = selectedEstadoObj ? selectedEstadoObj.ciudades : [];

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleEstadoSelect(estadoNombre: string) {
    if (form.estado !== estadoNombre) {
      setForm(f => ({ ...f, estado: estadoNombre, ciudad: '' }));
    }
    setEstadoPickerOpen(false);
  }

  function handleCiudadSelect(ciudadNombre: string) {
    set('ciudad', ciudadNombre);
    setCiudadPickerOpen(false);
  }

  function onPickDate(event: DateTimePickerEvent, selected?: Date) {
    if (event.type === 'dismissed' || !selected) {
      setPickerOpen(false);
      return;
    }
    setBirthDate(selected);
    set('fecha_de_nacimiento', toDDMMYYYY(selected));
    setPickerOpen(false);
  }

  function validate(): string | null {
    if (!form.nombre.trim()) return 'Ingresa tu nombre.';
    if (!form.apellido.trim()) return 'Ingresa tu apellido.';
    if (!DATE_RE.test(form.fecha_de_nacimiento)) return 'Fecha de nacimiento en formato DD/MM/AAAA.';
    if (!form.estado.trim()) return 'Ingresa tu estado.';
    if (!form.ciudad.trim()) return 'Ingresa tu ciudad.';
    if (!EMAIL_RE.test(form.correo_electronico)) return 'Correo electrónico inválido.';
    if (form.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    return null;
  }

  async function handleSubmit() {
    const err = validate();
    if (err) {
      Alert.alert('Revisa el formulario', err);
      return;
    }
    setSubmitting(true);
    try {
      await registerUser(form);
      Alert.alert('Cuenta creada', 'Ya puedes iniciar sesión.', [
        { text: 'OK', onPress: () => router.replace('/') },
      ]);
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        'No pudimos crear tu cuenta. Intenta de nuevo.';
      Alert.alert('Error al registrar', String(msg));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[theme.primary, PALETTE.guindaDk]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}>
        <SafeAreaView edges={['top']} style={styles.heroSafe}>
          <View style={styles.heroBar}>
            <Pressable
              onPress={() => router.back()}
              hitSlop={10}
              style={styles.backBtn}
              accessibilityLabel="Volver">
              <Icon name="chevL" size={22} color="#fff" stroke={2.4} />
            </Pressable>
            <View style={styles.heroLockup}>
              <Logo size={26} accent={theme.gold} />
              <Wordmark size={18} accent={theme.gold} />
            </View>
            <View style={styles.backBtn} />
          </View>
          <Text style={styles.heroTitle}>Crear cuenta</Text>
          <Text style={styles.heroSub}>Únete a FastRoute y guarda tus rutas favoritas.</Text>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.surface,
                borderColor: theme.line,
                shadowColor: theme.shadowColor,
                shadowOpacity: theme.shadowOpacity,
              },
            ]}>
            <View style={{ gap: 12 }}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Field
                    icon="user"
                    placeholder="Nombre"
                    value={form.nombre}
                    onChangeText={(v) => set('nombre', v)}
                    theme={theme}
                    autoCapitalize="sentences"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Field
                    icon="user"
                    placeholder="Apellido"
                    value={form.apellido}
                    onChangeText={(v) => set('apellido', v)}
                    theme={theme}
                    autoCapitalize="sentences"
                  />
                </View>
              </View>

              <Pressable
                onPress={() => setPickerOpen(true)}
                style={[
                  styles.dateField,
                  {
                    backgroundColor: theme.dark ? 'rgba(255,255,255,0.06)' : '#fff',
                    borderColor: theme.line,
                  },
                ]}>
                <Icon name="cal" size={19} color={theme.gold} stroke={2} />
                <Text
                  style={[
                    styles.dateText,
                    { color: form.fecha_de_nacimiento ? theme.text : theme.textFaint },
                  ]}>
                  {form.fecha_de_nacimiento || 'DD/MM/AAAA'}
                </Text>
                <Icon name="chevD" size={16} color={theme.textFaint} />
              </Pressable>

              {pickerOpen && (
                <DateTimePicker
                  value={birthDate ?? new Date(2000, 0, 1)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                  onChange={onPickDate}
                />
              )}

              <Pressable
                onPress={() => setEstadoPickerOpen(true)}
                style={[
                  styles.dateField,
                  {
                    backgroundColor: theme.dark ? 'rgba(255,255,255,0.06)' : '#fff',
                    borderColor: theme.line,
                  },
                ]}>
                <Icon name="layers" size={19} color={theme.gold} stroke={2} />
                <Text
                  style={[
                    styles.dateText,
                    { color: form.estado ? theme.text : theme.textFaint },
                  ]}>
                  {form.estado || 'Estado'}
                </Text>
                <Icon name="chevD" size={16} color={theme.textFaint} />
              </Pressable>

              <Modal
                visible={estadoPickerOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setEstadoPickerOpen(false)}>
                <View style={styles.modalOverlay}>
                  <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.line }]}>
                    <Text style={[styles.modalTitle, { color: theme.text }]}>Selecciona un estado</Text>
                    <FlatList
                      data={estadosRepublica}
                      keyExtractor={(item) => item.nombre}
                      renderItem={({ item }) => (
                        <Pressable
                          style={[styles.modalItem, { borderBottomColor: theme.line }]}
                          onPress={() => handleEstadoSelect(item.nombre)}>
                          <Text style={[styles.modalItemText, { color: theme.text }]}>{item.nombre}</Text>
                        </Pressable>
                      )}
                    />
                    <Pressable style={styles.modalCloseBtn} onPress={() => setEstadoPickerOpen(false)}>
                      <Text style={styles.modalCloseText}>Cerrar</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>

              <Pressable
                onPress={() => {
                  if (form.estado) {
                    setCiudadPickerOpen(true);
                  } else {
                    Alert.alert('Selecciona un estado primero');
                  }
                }}
                style={[
                  styles.dateField,
                  {
                    backgroundColor: theme.dark ? 'rgba(255,255,255,0.06)' : '#fff',
                    borderColor: theme.line,
                    opacity: form.estado ? 1 : 0.6,
                  },
                ]}>
                <Icon name="pin" size={19} color={theme.gold} stroke={2} />
                <Text
                  style={[
                    styles.dateText,
                    { color: form.ciudad ? theme.text : theme.textFaint },
                  ]}>
                  {form.ciudad || 'Ciudad'}
                </Text>
                <Icon name="chevD" size={16} color={theme.textFaint} />
              </Pressable>

              <Modal
                visible={ciudadPickerOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setCiudadPickerOpen(false)}>
                <View style={styles.modalOverlay}>
                  <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.line }]}>
                    <Text style={[styles.modalTitle, { color: theme.text }]}>Selecciona una ciudad</Text>
                    <FlatList
                      data={availableCiudades}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <Pressable
                          style={[styles.modalItem, { borderBottomColor: theme.line }]}
                          onPress={() => handleCiudadSelect(item)}>
                          <Text style={[styles.modalItemText, { color: theme.text }]}>{item}</Text>
                        </Pressable>
                      )}
                    />
                    <Pressable style={styles.modalCloseBtn} onPress={() => setCiudadPickerOpen(false)}>
                      <Text style={styles.modalCloseText}>Cerrar</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>

              <Field
                icon="mail"
                placeholder="correo@ejemplo.com"
                value={form.correo_electronico}
                onChangeText={(v) => set('correo_electronico', v)}
                theme={theme}
                keyboardType="email-address"
              />

              <Field
                icon="lock"
                placeholder="Contraseña (mín. 8 caracteres)"
                value={form.password}
                onChangeText={(v) => set('password', v)}
                theme={theme}
                secureTextEntry={!show}
                trailing={
                  <Pressable onPress={() => setShow((s) => !s)} hitSlop={8} style={{ padding: 4 }}>
                    <Icon name="eye" size={18} color={theme.textFaint} />
                  </Pressable>
                }
              />
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={submitting}
              style={[styles.cta, submitting && { opacity: 0.7 }]}>
              <LinearGradient
                colors={[theme.primary, PALETTE.guindaDk]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaInner}>
                <Text style={styles.ctaText}>
                  {submitting ? 'Creando cuenta…' : 'Registrarme'}
                </Text>
                {!submitting && <Icon name="chevR" size={18} color="#fff" stroke={2.6} />}
              </LinearGradient>
            </Pressable>

            <Text style={[styles.loginHint, { color: theme.textSoft }]}>
              ¿Ya tienes cuenta?{' '}
              <Text
                onPress={() => router.replace('/')}
                style={{ color: theme.primary, fontFamily: FR_FONTS.bodyExtra }}>
                Inicia sesión
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: {
    paddingBottom: 28,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    overflow: 'hidden',
  },
  heroSafe: { paddingTop: 12, paddingHorizontal: 22 },
  heroBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 18,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLockup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroTitle: {
    fontFamily: FR_FONTS.display,
    fontSize: 26,
    color: '#fff',
    letterSpacing: -0.5,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.72)',
    fontFamily: FR_FONTS.body,
    fontSize: 13.5,
    marginTop: 4,
    maxWidth: 280,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 36,
    elevation: 8,
    marginTop: -18,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    height: 54,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  dateText: {
    flex: 1,
    fontFamily: FR_FONTS.body,
    fontSize: 15,
  },
  cta: {
    marginTop: 18,
    width: '100%',
    height: 54,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#611232',
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 30,
    shadowOpacity: 0.6,
    elevation: 6,
  },
  ctaInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  ctaText: {
    color: '#fff',
    fontFamily: FR_FONTS.display,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  loginHint: {
    textAlign: 'center',
    fontFamily: FR_FONTS.body,
    fontSize: 12.5,
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    padding: 20,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontFamily: FR_FONTS.display,
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalItemText: {
    fontFamily: FR_FONTS.body,
    fontSize: 16,
    textAlign: 'center',
  },
  modalCloseBtn: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontFamily: FR_FONTS.bodyExtra,
    fontSize: 16,
    color: '#D42351', // Assuming guinda accent for close
  },
});
