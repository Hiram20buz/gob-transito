import { useState } from 'react';
import { Alert } from 'react-native';

import { AuthScreen, LoginStyle } from '@/components/fr/AuthScreen';
import { Role } from '@/components/fr/RoleToggle';
import { useFRTheme } from '@/constants/fastroute-theme';

export default function AuthRoute() {
  const theme = useFRTheme();
  const [loginStyle] = useState<LoginStyle>('split');

  function handleLogin(role: Role) {
    Alert.alert(
      'FastRoute',
      role === 'admin'
        ? 'Inicio de sesión como Administrador (pendiente).'
        : 'Inicio de sesión como Usuario (pendiente).',
    );
  }

  return <AuthScreen theme={theme} style={loginStyle} onLogin={handleLogin} />;
}
