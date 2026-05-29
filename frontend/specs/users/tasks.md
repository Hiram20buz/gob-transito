# Tasks — `users`

> Estado: `[ ]` pending · `[~]` en progreso · `[x]` done

## Registro

1. `[x]` Crear cliente axios con `EXPO_PUBLIC_API_URL`. — `src/lib/api.ts`
2. `[x]` Tipar `RegisterPayload` y exponer `registerUser(payload)` → `POST /users`. — `src/lib/api.ts`
3. `[x]` Construir pantalla de registro con los 7 campos. — `src/app/register.tsx`
4. `[x]` Reemplazar input de fecha por date picker nativo; guardar como string `"DD/MM/YYYY"`. — `src/app/register.tsx`
5. `[x]` Validación cliente (campos vacíos, email regex, fecha regex, password ≥ 8).
6. `[x]` Wire del link "Regístrate" desde `AuthScreen` → `/register`.

## Login

7. `[ ]` Confirmar con backend la ruta (`/auth/login` vs `/sessions` vs otra) y shape del response. **TBD** en `design.md`.
8. `[ ]` Agregar `LoginPayload`, `UserDTO`, `AuthResponse` y `loginUser` en `src/lib/api.ts`.
9. `[ ]` Decidir y configurar persistencia del token. Propuesta: `expo-secure-store`.
10. `[ ]` Crear `AuthProvider` + `useAuth()` en `src/lib/auth.tsx`. Inyectar interceptor para `Authorization: Bearer <token>` en el axios `api`.
11. `[ ]` Envolver el root layout con `<AuthProvider>` en `src/app/_layout.tsx`. Hidratar token al boot.
12. `[ ]` Conectar `AuthScreen.onLogin` al `loginUser` real (reemplazar el `Alert` placeholder en `src/app/index.tsx`).
13. `[ ]` Cambiar firma de `AuthScreen.onLogin` para que pase `{ email, password, role }`.
14. `[ ]` Estados de loading + error en login (mismo patrón que en `register.tsx`).
15. `[ ]` Redirigir post-login según rol (depende de tarea 7 — quién manda el rol).
16. `[ ]` **TBD:** Verificar si hay `/auth/me` para rehidratar la sesión al boot.

## Verificación

- `[ ]` Registro: tap en "Regístrate", llenar formulario, "Registrarme" → toast de éxito + vuelta al login.
- `[ ]` Login: ingresar credenciales válidas → navega al home del rol.
- `[ ]` Login con credenciales malas → muestra mensaje legible.
- `[ ]` Cerrar la app y reabrirla → la sesión persiste (cuando esté la tarea 9 lista).

## Bloqueos / TBDs

- **TBD (7):** Ruta y shape del login → bloquea las tareas 8 en adelante.
- **TBD (9):** OK para usar `expo-secure-store` o preferencia diferente.
- **TBD (15):** ¿Rol post-login viene del backend o del toggle del front?
