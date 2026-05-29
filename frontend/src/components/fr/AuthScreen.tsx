import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Field } from '@/components/fr/Field';
import { Icon } from '@/components/fr/Icon';
import { Logo, Wordmark } from '@/components/fr/Logo';
import { Role, RoleToggle } from '@/components/fr/RoleToggle';
import { FRStatusBar } from '@/components/fr/StatusBar';
import { FRTheme, FR_FONTS, PALETTE } from '@/constants/fastroute-theme';

export type LoginStyle = 'split' | 'centered';

type Props = {
  theme: FRTheme;
  style?: LoginStyle;
  onLogin: (email: string, pass: string, role: Role) => void;
};

function RouteMotifSplit() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 390 320" style={StyleSheet.absoluteFill}>
      <Path
        d="M-20,250 C80,210 120,150 220,130 320,110 360,60 420,40"
        fill="none"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth={2.5}
        strokeDasharray="2 12"
        strokeLinecap="round"
      />
      <Path
        d="M-20,300 C100,260 160,300 260,250 340,210 380,240 430,200"
        fill="none"
        stroke={PALETTE.bronze}
        strokeOpacity={0.22}
        strokeWidth={3}
      />
      <Circle cx="330" cy="64" r="40" fill="rgba(255,255,255,0.04)" />
      <Circle cx="48" cy="250" r="60" fill="rgba(172,137,61,0.07)" />
    </Svg>
  );
}

function RouteMotifCentered() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 390 844" style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}>
      <Path
        d="M-20,640 C90,600 150,520 250,500 350,480 390,420 460,400"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={2.5}
        strokeDasharray="2 12"
      />
      <Path
        d="M-20,720 C110,680 170,720 270,660 360,610 400,640 470,600"
        fill="none"
        stroke={PALETTE.bronze}
        strokeOpacity={0.18}
        strokeWidth={3}
      />
    </Svg>
  );
}

export function AuthScreen({ theme, style = 'split', onLogin }: Props) {
  const [role, setRole] = useState<Role>('user');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false);

  const demoEmail = role === 'admin' ? 'admin@fastroute.mx' : 'usuario@fastroute.mx';

  const Form = (
    <>
      <RoleToggle role={role} setRole={setRole} theme={theme} />
      <View style={{ gap: 12, marginTop: 18 }}>
        <Field
          icon="mail"
          placeholder={demoEmail}
          value={email}
          onChangeText={setEmail}
          theme={theme}
          keyboardType="email-address"
        />
        <Field
          icon="lock"
          placeholder="Contraseña"
          value={pass}
          onChangeText={setPass}
          theme={theme}
          secureTextEntry={!show}
          trailing={
            <Pressable onPress={() => setShow((s) => !s)} hitSlop={8} style={{ padding: 4 }}>
              <Icon name="eye" size={18} color={theme.textFaint} />
            </Pressable>
          }
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
        <Text style={[styles.forgot, { color: theme.textSoft }]}>¿Olvidaste tu contraseña?</Text>
      </View>
      <Pressable onPress={() => onLogin(email, pass, role)} style={styles.cta}>
        <LinearGradient
          colors={[theme.primary, PALETTE.guindaDk]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ctaInner}>
          <Text style={styles.ctaText}>Iniciar sesión</Text>
          <Icon name="chevR" size={18} color="#fff" stroke={2.6} />
        </LinearGradient>
      </Pressable>
      <View style={[styles.divider, { marginVertical: 18 }]}>
        <View style={[styles.dividerLine, { backgroundColor: theme.line }]} />
        <Text style={[styles.dividerText, { color: theme.textFaint }]}>o continúa con</Text>
        <View style={[styles.dividerLine, { backgroundColor: theme.line }]} />
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {['Google'].map((p) => (
          <Pressable
            key={p}
            style={[
              styles.providerBtn,
              {
                borderColor: theme.line,
                backgroundColor: theme.dark ? 'rgba(255,255,255,0.04)' : '#fff',
              },
            ]}>
            <Text style={[styles.providerText, { color: theme.text }]}>{p}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={[styles.signupHint, { color: theme.textSoft }]}>
        ¿No tienes cuenta?{' '}
        <Text
          onPress={() => router.push('/register')}
          style={{ color: theme.primary, fontFamily: FR_FONTS.bodyExtra }}>
          Regístrate
        </Text>
      </Text>
    </>
  );

  if (style === 'split') {
    return (
      <View style={[styles.root, { backgroundColor: theme.bg }]}>
        <LinearGradient
          colors={[theme.primary, PALETTE.guindaDk]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBlock}>
          <RouteMotifSplit />
          <View style={styles.heroLockup}>
            <Logo size={42} />
            <Wordmark size={24} accent={theme.gold} />
          </View>
          <Text style={styles.heroTitle}>Encuentra tu{'\n'}mejor ruta.</Text>
          <Text style={styles.heroSub}>
            Rutas alternativas inteligentes para cada viaje en la ciudad.
          </Text>
        </LinearGradient>
        <View style={styles.cardWrap}>
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
            {Form}
          </View>
        </View>
      </View>
    );
  }

  // centered
  return (
    <LinearGradient
      colors={[theme.primary, PALETTE.guindaDk]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.7 }}
      style={[styles.root, { padding: 26, justifyContent: 'center' }]}>
      <RouteMotifCentered />
      <View style={styles.centeredLockup}>
        <Logo size={54} accent={theme.gold} />
        <View style={{ marginTop: 14 }}>
          <Wordmark size={28} accent={theme.gold} />
        </View>
        <Text style={styles.centeredTagline}>Gestión inteligente de rutas</Text>
      </View>
      <View
        style={[
          styles.glassCard,
          {
            backgroundColor: theme.dark ? 'rgba(54,16,30,0.7)' : 'rgba(255,255,255,0.97)',
          },
        ]}>
        {Form}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'relative',
  },
  heroBlock: {
    position: 'relative',
    height: 320,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    overflow: 'hidden',
    paddingTop: 64,
    paddingHorizontal: 28,
  },
  heroLockup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  heroTitle: {
    position: 'relative',
    fontFamily: FR_FONTS.display,
    fontSize: 30,
    lineHeight: 33,
    color: '#fff',
    marginTop: 28,
    marginBottom: 8,
    letterSpacing: -0.6,
  },
  heroSub: {
    position: 'relative',
    color: 'rgba(255,255,255,0.72)',
    fontSize: 14,
    fontFamily: FR_FONTS.body,
    maxWidth: 260,
  },
  cardWrap: {
    paddingHorizontal: 26,
    marginTop: -22,
  },
  card: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 36,
    elevation: 8,
  },
  centeredLockup: {
    alignItems: 'center',
    marginBottom: 26,
  },
  centeredTagline: {
    color: 'rgba(255,255,255,0.66)',
    fontFamily: FR_FONTS.body,
    fontSize: 13.5,
    marginTop: 8,
  },
  glassCard: {
    borderRadius: 26,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 30 },
    shadowRadius: 60,
    shadowOpacity: 0.5,
    elevation: 12,
  },
  forgot: {
    fontFamily: FR_FONTS.bodyBold,
    fontSize: 12.5,
  },
  cta: {
    marginTop: 16,
    width: '100%',
    height: 54,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#611232',
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 30,
    shadowOpacity: 0.7,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: {
    fontFamily: FR_FONTS.bodyBold,
    fontSize: 11.5,
  },
  providerBtn: {
    flex: 1,
    height: 48,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerText: {
    fontFamily: FR_FONTS.bodyBold,
    fontSize: 14,
  },
  signupHint: {
    textAlign: 'center',
    fontFamily: FR_FONTS.body,
    fontSize: 12.5,
    marginTop: 20,
  },
});

