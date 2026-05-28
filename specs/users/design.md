# Design — `users`

## Resumen técnico

Dos pantallas (login + registro) más un cliente axios compartido (`src/lib/api.ts`). El registro ya está; el login todavía no. Se agrega un `AuthContext` ligero para mantener `{ user, token }` accesible desde cualquier ruta y un helper `loginUser` que apunta al endpoint que confirme backend. Persistencia del token con `expo-secure-store` (cuando se confirme).

## API / Contratos

| Método | Ruta | Body | Response | Estado |
|---|---|---|---|---|
| POST | `/users` | `RegisterPayload` | usuario creado | **implementado** |
| POST | `/auth/login` *(TBD ruta)* | `LoginPayload` | `AuthResponse` | pendiente |

> **TBD:** la ruta exacta del login puede ser `/auth/login`, `/sessions`, o `/login` — confirmar con backend. También el shape del response: ¿`{ token, user }` plano? ¿`{ data: { token, user } }`?

## Tipos TypeScript

Ya en `src/lib/api.ts`:

```ts
export type RegisterPayload = {
  nombre: string;
  apellido: string;
  fecha_de_nacimiento: string; // "DD/MM/YYYY"
  estado: string;
  ciudad: string;
  correo_electronico: string;
  password: string;
};
```

A agregar:

```ts
export type LoginPayload = {
  correo_electronico: string;
  password: string;
};

export type UserDTO = {
  id: string | number;
  nombre: string;
  apellido: string;
  correo_electronico: string;
  rol?: 'user' | 'admin';     // TBD si viene del backend
  // …campos extra cuando backend confirme
};

export type AuthResponse = {
  token: string;
  user: UserDTO;
};

export function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  return api.post('/auth/login', payload).then((r) => r.data);
}
```

## Archivos a tocar

| Archivo | Acción | Resumen |
|---|---|---|
| `src/lib/api.ts` | editar | Agregar `LoginPayload`, `UserDTO`, `AuthResponse`, `loginUser`. |
| `src/lib/auth.tsx` | crear | `AuthProvider` + `useAuth()` con `{ user, token, login, logout }`. |
| `src/app/_layout.tsx` | editar | Envolver el `Stack` con `<AuthProvider>`. Cargar token persistido al boot. |
| `src/app/index.tsx` | editar | Pasar `onLogin` real a `AuthScreen`, llamar a `login()` del context. |
| `src/components/fr/AuthScreen.tsx` | editar | Ya recibe `onLogin(role)`; cambiarle la firma a `onLogin({ email, password, role })`. |
| `src/app/register.tsx` | sin cambios funcionales | Ya está. |

## Flujo

**Registro:**
1. Usuario en `/` toca "Regístrate" → navega a `/register`.
2. Llena formulario, toca "Registrarme".
3. App valida cliente, hace `POST /users`.
4. Éxito → `Alert` + `router.replace('/')` para volver al login.

**Login** (pendiente):
1. Usuario en `/` ingresa email + password, elige rol, toca "Iniciar sesión".
2. App valida cliente, hace `POST /auth/login`.
3. Éxito → guarda `{ token, user }` en `AuthContext` y en `SecureStore`.
4. Navega a `/(app)/user` o `/(app)/admin` según el rol del response (no del toggle, si backend manda el rol).

## Estado + persistencia

- **Context**: `AuthProvider` en `src/lib/auth.tsx`. Expone `user`, `token`, `login`, `logout`. Inyecta el `Authorization: Bearer <token>` en el `api` axios via interceptor.
- **Persistencia**: `expo-secure-store` para el token. Al boot, `AuthProvider` intenta leer el token; si existe, hidrata el contexto y opcionalmente llama un endpoint `/auth/me` para refrescar el `user`. **TBD:** confirmar si existe `/auth/me`.

## Manejo de errores

Patrón único, ya en uso en `register.tsx`:

```ts
catch (e: any) {
  const msg =
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    'Algo salió mal.';
  Alert.alert('Error', String(msg));
}
```

## TBD

- **TBD:** Ruta exacta del login (`/auth/login` vs `/sessions` vs otra).
- **TBD:** Shape del response del login.
- **TBD:** ¿El backend devuelve el `rol` o se infiere?
- **TBD:** ¿Existe `/auth/me` para rehidratar la sesión al boot?
- **TBD:** Persistencia con `expo-secure-store` — agregar dep cuando se vaya a implementar.
