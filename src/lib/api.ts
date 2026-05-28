import axios from 'axios';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

if (!baseURL) {
  console.warn(
    'EXPO_PUBLIC_API_URL no está definida. Configúrala en .env y reinicia el dev server.',
  );
}

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

export type RegisterPayload = {
  nombre: string;
  apellido: string;
  fecha_de_nacimiento: string;
  estado: string;
  ciudad: string;
  correo_electronico: string;
  password: string;
};

export function registerUser(payload: RegisterPayload) {
  return api.post('/users', payload);
}
