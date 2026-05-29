# Requirements — `users`

## Objetivo

Permitir que las personas creen una cuenta y entren a FastRoute con email y contraseña. Es la puerta de entrada a la app; sin esto no se accede a las vistas de usuario ni de admin.

## User stories

- Como **visitante no registrado**, quiero **crear una cuenta** con mis datos personales para poder usar la app.
- Como **usuario registrado**, quiero **iniciar sesión** con mi correo y contraseña para retomar mi sesión en cualquier dispositivo.
- Como **usuario**, quiero **ver mensajes de error claros** cuando algo falla (red, credenciales, email duplicado) para saber qué corregir.

## Requisitos funcionales

- **Registro** (`POST /users`):
  - Campos: `nombre`, `apellido`, `fecha_de_nacimiento` (string `DD/MM/YYYY`), `estado`, `ciudad`, `correo_electronico`, `password`.
  - Fecha se elige con un picker nativo (no se teclea).
  - Al éxito, regresa al login para que el usuario inicie sesión.
- **Login**:
  - Campos: `correo_electronico`, `password`.
  - Toggle visual Usuario/Administrador en la pantalla. **TBD:** ¿el rol viene del backend en el response del login, o se manda como hint al loguearse? Si viene del backend, el toggle es solo cosmético.
  - Al éxito, navega al home correspondiente.
- **Errores**:
  - Red caída → "No pudimos conectarnos. Intenta de nuevo."
  - 4xx con mensaje del backend → mostrar `response.data.message`.
  - 5xx → "Algo salió mal en el servidor."

## Validación cliente

- Todos los campos no vacíos.
- Email pasa regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`.
- Fecha de nacimiento matchea `^\d{2}/\d{2}/\d{4}$` (la produce el picker, así que es difícil que falle).
- Password ≥ 8 caracteres.

## Requisitos no funcionales

- UI en **español**.
- Tema FastRoute (paleta guinda/dorado) consistente con el resto del proyecto.
- Auth screen en `/`, registro en `/register`.
- Soporte iOS / Android nativo (web es nice-to-have, no bloquea).
- **TBD:** Persistencia del token entre sesiones — propuesta `expo-secure-store`. Confirmar antes de implementar.

## Fuera de scope (este spec)

- "Olvidé mi contraseña" (recuperación).
- Verificación de email.
- Social login (los botones Google/Apple existen como UI pero no se cablean).
- Edición de perfil / cambio de password.
- Logout (se documenta cuando se necesite, idealmente en un spec `session` aparte).
- Refresh tokens.

## TBD

- **TBD:** Ruta y shape exactos del login. Asumido: `POST /auth/login` con body `{ correo_electronico, password }` → `{ token, user }`. Confirmar con el equipo de backend.
- **TBD:** Origen del rol post-login (backend vs toggle del front).
- **TBD:** Almacenamiento del token (propuesta: `expo-secure-store`).
