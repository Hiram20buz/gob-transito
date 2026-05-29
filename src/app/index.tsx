import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { AuthScreen, LoginStyle } from '@/components/fr/AuthScreen';
import { Role } from '@/components/fr/RoleToggle';
import { TEST_USERS } from '@/constants/fastroute-mock';
import { useFRTheme } from '@/constants/fastroute-theme';
import { loginUser } from '@/lib/api';

export default function AuthRoute() {
  const theme = useFRTheme();
  const [loginStyle] = useState<LoginStyle>('split');

  async function handleLogin(email: string, pass: string, role: Role) {
    if (!email.trim() || !pass.trim()) {
      Alert.alert('Faltan datos', 'Ingresa tu correo y contraseña.');
      return;
    }

    try {
      const response = await loginUser({
        correo_electronico: email,
        password: pass,
      });
      
      // Navegar a la pantalla de user
      router.replace('/user');
    } catch (e: any) {
      // El backend nos devuelve un HTTP 401 si las credenciales fallan, 
      // y configuramos el backend para devolver exactamente "error al iniciar sesion"
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        'error al iniciar sesion';
        
      Alert.alert('Error', String(msg));
    }
  }

  return <AuthScreen theme={theme} style={loginStyle} onLogin={handleLogin} />;
}
