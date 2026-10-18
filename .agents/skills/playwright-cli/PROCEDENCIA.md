# Procedencia

Esta carpeta es una **copia vendorizada** de la skill que instala el CLI de
Playwright (`playwright-cli install --skills=agents`). No viene de un repositorio
de git, sino de dentro del paquete npm.

| | |
|---|---|
| **Origen** | paquete npm `@playwright/cli` (Microsoft) |
| **Repositorio** | <https://github.com/microsoft/playwright-cli> |
| **Versión copiada** | `@playwright/cli@0.1.22` |
| **Licencia** | Apache-2.0 (ver [`LICENSE`](LICENSE)) |
| **Copiada el** | 2026-10-18 |

El contenido es **idéntico** al que trae el paquete en `skills/playwright-cli/`,
así que la comparación con el original es directa (`diff -r`).

## Aviso de deriva

El propio CLI comprueba esta skill y avisa si no coincide con su versión:

> The playwright-cli skill at '.agents/skills/playwright-cli' does not match the
> tool version.

Es decir: la skill está atada al **CLI**, no a la devDependency `playwright` del
repositorio (que hoy es `1.64.1`). Si actualizas el CLI, conviene volver a
copiarla.

## Cómo actualizarla

```bash
npx @playwright/cli@latest install --skills=agents   # deja la copia al día
```

Y luego actualiza la versión y la fecha de la tabla de arriba.
