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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Field } from '@/components/fr/Field';
import { Icon } from '@/components/fr/Icon';
import { Logo, Wordmark } from '@/components/fr/Logo';
import { FR_FONTS, PALETTE, useFRTheme } from '@/constants/fastroute-theme';
import { requestPasswordRecovery, verifyRecoveryCode, resetPassword } from '@/lib/api';

type Step = 'email' | 'code' | 'new_password';

export default function ForgotPasswordScreen() {
  const theme = useFRTheme();
  const [step, setStep] = useState<Step>('email');
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function getErrorMessage(e: any): string {
    return (
      e?.response?.data?.detail ||
      e?.response?.data?.message ||
      e?.message ||
      'Ocurrió un error inesperado.'
    );
  }

  async function handleRequestCode() {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Ingresa un correo electrónico válido.');
      return;
    }

    setSubmitting(true);
    try {
      await requestPasswordRecovery({ correo_electronico: email });
      Alert.alert('Código enviado', `Hemos enviado un código de 6 dígitos a ${email}`);
      setStep('code');
    } catch (e: any) {
      Alert.alert('Error', getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyCode() {
    if (code.length !== 6) {
      Alert.alert('Error', 'El código debe tener 6 dígitos.');
      return;
    }

    setSubmitting(true);
    try {
      await verifyRecoveryCode({ correo_electronico: email, code });
      setStep('new_password');
    } catch (e: any) {
      Alert.alert('Error', getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetPassword() {
    if (newPassword.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword({
        correo_electronico: email,
        code,
        new_password: newPassword,
      });
      Alert.alert('¡Éxito!', 'Tu contraseña ha sido actualizada.', [
        { text: 'Ir a Iniciar Sesión', onPress: () => router.replace('/') },
      ]);
    } catch (e: any) {
      Alert.alert('Error', getErrorMessage(e));
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
          <Text style={styles.heroTitle}>Recuperar cuenta</Text>
          <Text style={styles.heroSub}>
            {step === 'email' && 'Ingresa tu correo para recibir un código.'}
            {step === 'code' && 'Ingresa el código de 6 dígitos enviado a tu correo.'}
            {step === 'new_password' && 'Crea una nueva contraseña para tu cuenta.'}
          </Text>
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
              {step === 'email' && (
                <Field
                  icon="mail"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChangeText={setEmail}
                  theme={theme}
                  keyboardType="email-address"
                />
              )}

              {step === 'code' && (
                <View style={{ gap: 16 }}>
                  <Field
                    icon="layers"
                    placeholder="Código de 6 dígitos"
                    value={code}
                    onChangeText={setCode}
                    theme={theme}
                    keyboardType="default"
                  />
                  <Pressable
                    onPress={handleRequestCode}
                    disabled={submitting}
                    style={{ alignSelf: 'center' }}>
                    <Text
                      style={{
                        color: theme.primary,
                        fontFamily: FR_FONTS.bodyBold,
                        fontSize: 13.5,
                      }}>
                      ¿No te llegó? Reenviar código
                    </Text>
                  </Pressable>
                </View>
              )}

              {step === 'new_password' && (
                <Field
                  icon="lock"
                  placeholder="Nueva contraseña (mín. 8)"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  theme={theme}
                  secureTextEntry={!showPass}
                  trailing={
                    <Pressable onPress={() => setShowPass((s) => !s)} hitSlop={8} style={{ padding: 4 }}>
                      <Icon name="eye" size={18} color={theme.textFaint} />
                    </Pressable>
                  }
                />
              )}
            </View>

            <Pressable
              onPress={
                step === 'email'
                  ? handleRequestCode
                  : step === 'code'
                  ? handleVerifyCode
                  : handleResetPassword
              }
              disabled={submitting}
              style={[styles.cta, submitting && { opacity: 0.7 }]}>
              <LinearGradient
                colors={[theme.primary, PALETTE.guindaDk]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaInner}>
                <Text style={styles.ctaText}>
                  {submitting
                    ? 'Procesando…'
                    : step === 'email'
                    ? 'Enviar Código'
                    : step === 'code'
                    ? 'Verificar Código'
                    : 'Actualizar Contraseña'}
                </Text>
                {!submitting && <Icon name="chevR" size={18} color="#fff" stroke={2.6} />}
              </LinearGradient>
            </Pressable>
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
});