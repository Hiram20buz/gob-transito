# Design — `<feature>`

> Cómo se construye. Claude propone, el usuario aprueba o edita. Si la implementación cambia el diseño, este archivo se actualiza en el mismo paso.

## Resumen técnico

Una o dos frases sobre el approach elegido y por qué.

## API / Contratos

| Método | Ruta | Body | Response | Notas |
|---|---|---|---|---|
| POST | `/…` | `{…}` | `{…}` | … |

Si hay TBDs (rutas/responses no confirmados), márcalos aquí.

## Tipos TypeScript

```ts
// Tipos nuevos o modificados
```

## Archivos a tocar

| Archivo | Acción | Resumen |
|---|---|---|
| `src/…` | crear / editar | … |

## Flujo

Pasos del usuario y/o diagrama corto:
1. Usuario hace X.
2. App llama Y.
3. …

## Estado + persistencia

- Local (component state) / Context / SecureStore / etc.

## Manejo de errores

- Cómo se traducen los errores de red a UI (Alerts, toasts, banners).

## TBD

- **TBD:** preguntas técnicas pendientes (rutas, shapes, decisiones de almacenamiento, etc.).
