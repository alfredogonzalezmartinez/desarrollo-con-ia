# Procedencia

Esta carpeta es una **copia vendorizada** de la skill
`codely-git-conventional-commit`, del harness de agentes de CodelyTV. Viaja con
el repositorio para que cualquiera la tenga al clonar.

| | |
|---|---|
| **Origen** | <https://github.com/CodelyTV/agent-harness> |
| **Autor** | Codely (`support@codely.com`) |
| **Licencia** | MIT, **declarada en el frontmatter del `SKILL.md`** (el repositorio de origen no trae fichero `LICENSE`) |
| **Commit copiado** | `9efa61c33cbfe7e1783d5cf7ef8ac9a66debc1fc` (2026-10-16) |
| **Hash del `SKILL.md`** | `15762b9173cad5c10a6de27c4bfb56b1106d5addd71339a1edfe17308aa5dcfd` (el que anota `skills-lock.json`) |
| **Copiada el** | 2026-10-18 |

## Cómo se instaló

```bash
npx skills@latest add codelytv/agent-harness -s codely-git-conventional-commit -y
```

El instalador la deja en `.agents/skills/<id>/` y escribe **`skills-lock.json`**
en la raíz, que es donde vive la trazabilidad (origen y hash). El enlace de
`.claude/skills/` se añadió a mano, porque el instalador no lo crea.

> **Ojo con la sintaxis**: `--skill=nombre` (con `=`) **se ignora** y el
> instalador mete *todas* las skills del repositorio. Hay que usar
> `-s nombre` o `--skill nombre`.

> **Ojo con el nombre**: la skill se llamaba `codely-git-conventional_commit`
> (con guion bajo) y ahora es `codely-git-conventional-commit` (con guiones).

## Cómo actualizarla

```bash
npx skills@latest update codely-git-conventional-commit
```

Comprueba después que el hash de `skills-lock.json` y la fecha de esta tabla
siguen teniendo sentido, y pasa `npm run skills:check`.

## Nota: el trailer de co-autoría

La skill exige añadir un trailer `Co-Authored-By` a cada commit, pero **solo
define la identidad de Claude Code, Cursor, Copilot y Codex: OpenCode no
aparece**. Eso se resuelve en el repositorio, no aquí: ver la sección *Commits*
de `AGENTS.md`, que fija la identidad de OpenCode. Este fichero no se edita para
adaptarlo (es una copia del original).
