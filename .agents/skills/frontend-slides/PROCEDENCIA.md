# Procedencia

Esta carpeta es una **copia vendorizada** de la skill `frontend-slides`: viaja con
el repositorio para que cualquier persona, en cualquier dispositivo, la tenga al
clonar. No es un clon a medias ni un submódulo.

| | |
|---|---|
| **Origen** | <https://github.com/zarazhangrui/frontend-slides> |
| **Autora** | Zara Zhang |
| **Licencia** | MIT (ver [`LICENSE`](LICENSE)) |
| **Commit copiado** | `9906a34d640d2111f724544cbc50f7f130569ae1` (2026-06-23) |
| **Copiada el** | 2026-10-18 |

## Qué no se copió

- `.git/` — un repositorio embebido dejaría de versionarse: git lo anota como
  *gitlink* y no guarda su contenido.
- `plugins/` — es una **copia byte a byte** de este mismo contenido, empaquetada
  para el marketplace de plugins de Claude Code. Aquí no aporta nada (~2 MB).
- `.claude-plugin/` — el manifiesto de ese marketplace, que apunta a `plugins/`.
- `.gitignore` — el de la raíz del repositorio ya cubre lo necesario.

## Cómo actualizarla

No se actualiza sola. Para traer una versión nueva del original:

```bash
git clone --depth 1 https://github.com/zarazhangrui/frontend-slides /tmp/fs
git -C /tmp/fs log -1 --format=%H   # apunta el commit nuevo
rsync -a --delete \
      --exclude .git --exclude plugins --exclude .claude-plugin \
      --exclude .gitignore --exclude PROCEDENCIA.md \
      /tmp/fs/ .agents/skills/frontend-slides/
```

Después actualiza el commit y la fecha de la tabla de arriba.
