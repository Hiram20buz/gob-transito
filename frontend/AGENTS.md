# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

# Spec-driven workflow

This project uses spec-driven development. Every feature lives under `specs/<feature>/` with three canonical files: `requirements.md`, `design.md`, `tasks.md`. See `specs/README.md` for the convention.

**Before implementing anything**, read the relevant spec — start with `requirements.md`, then `design.md`, then `tasks.md`. If the user names a feature, jump straight to `specs/<that-feature>/`.

**While implementing**, mark the task you're working on as `[~]` in `tasks.md` and `[x]` when done. If the implementation diverges from the design, update `design.md` in the same change — don't leave the spec stale.

**If something is ambiguous**, look for a `**TBD:**` entry in the spec. If your question isn't there, add it as a `TBD` and ask the user before proceeding.
