# Specs — Spec-Driven Development

Cada feature de la app vive como un **spec** antes (y durante) de implementarse. El spec es la fuente de verdad: si el código diverge del spec, se actualiza el spec en el mismo cambio.

Esta convención está inspirada en el flujo de [Heeki Park con Claude Code](https://heeki.medium.com/using-spec-driven-development-with-claude-code-4a1ebe5d9f29) y en el formato ya estandarizado por Kiro/spec-kit.

## Estructura

```
specs/
├── README.md            # este archivo
├── _template/           # plantillas vacías — cópialas para una nueva feature
│   ├── requirements.md
│   ├── design.md
│   └── tasks.md
└── <feature>/           # un folder por feature, nombre en kebab-case
    ├── requirements.md
    ├── design.md
    └── tasks.md
```

## Los 3 archivos canónicos

| Archivo | Responsable | Contenido |
|---|---|---|
| `requirements.md` | usuario | User stories, requisitos funcionales/no-funcionales, lo que **sí** y lo que **no** está en scope. |
| `design.md` | Claude (con aprobación del usuario) | Endpoints, contratos, tipos TS, archivos a tocar, flujo de navegación, errores, estado. |
| `tasks.md` | Claude (marca avance) + usuario (dicta) | Checklist enumerada. Estado: `[ ]` pending, `[~]` en progreso, `[x]` done. |

No siempre los tres archivos están completos al inicio — el spec evoluciona. Pero al cerrar la feature, los tres deben reflejar lo construido.

## Cómo crear un spec nuevo

```bash
cp -r specs/_template specs/<nueva-feature>
```

Edita los tres archivos. Cualquier punto sin definir va como `**TBD:** <pregunta>` dentro del propio archivo — no se pierde.

## Cómo se trabajan las tareas

1. El usuario abre el spec y marca qué quiere ejecutar (por número de tarea o por texto).
2. Claude lee `requirements.md` + `design.md` para contexto, marca la tarea como `[~]` en `tasks.md` al empezar.
3. Implementa.
4. Marca `[x]` al cerrar. Si la implementación cambió el diseño, edita `design.md` en el mismo paso.

## Reglas

- **El spec se lee antes de implementar.** Está reforzado en `AGENTS.md`.
- **No saltarse el `requirements.md`.** Sin user stories claras, el design es adivinanza.
- **Los `TBD` no se borran silenciosamente.** Se resuelven explícitamente (el usuario los responde) o se mueven a "fuera de scope" si ya no aplican.
- **Un spec no es un PRD.** Es ligero — pensar en docs de ~1-3 páginas por feature, no en novelas.
