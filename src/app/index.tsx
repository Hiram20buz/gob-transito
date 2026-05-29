import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { AuthScreen, LoginStyle } from '@/components/fr/AuthScreen';
import { Role } from '@/components/fr/RoleToggle';
import { TEST_USERS } from '@/constants/fastroute-mock';
import { useFRTheme } from '@/constants/fastroute-theme';

export default function AuthRoute() {
  const theme = useFRTheme();
  const [loginStyle] = useState<LoginStyle>('split');

  function handleLogin(role: Role, email: string, password: string) {
    const trimmedEmail = email.trim().toLowerCase();
    const expected = TEST_USERS[role];

    if (!trimmedEmail || !password) {
      Alert.alert(
        'FastRoute',
        `Credenciales de prueba:\n\nUsuario: ${TEST_USERS.user.email} / ${TEST_USERS.user.password}\nAdmin: ${TEST_USERS.admin.email} / ${TEST_USERS.admin.password}`,
      );
      return;
    }

    if (trimmedEmail !== expected.email || password !== expected.password) {
      Alert.alert(
        'Credenciales incorrectas',
        `Para entrar como ${role === 'admin' ? 'Administrador' : 'Usuario'} usa:\n\n${expected.email}\n${expected.password}`,
      );
      return;
    }

    router.replace(role === 'admin' ? '/admin' : '/user');
  }

  return <AuthScreen theme={theme} style={loginStyle} onLogin={handleLogin} />;
}
