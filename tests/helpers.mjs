/**
 * Utilidades de los tests.
 *
 * Los scripts del proyecto aceptan un argumento para apuntar a otro sitio
 * (`--root=` en `build.mjs` y `check-skills.mjs`, `--deck=` en
 * `check-layout.mjs`), así que los tests montan un árbol de prueba en un
 * directorio temporal y lanzan el script de verdad: comprueban el código de
 * salida y el mensaje, no sus tripas.
 *
 * Cada fichero de test corre en su propio proceso, así que los temporales se
 * borran al salir.
 */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const RAIZ_REPO = path.resolve(import.meta.dirname, '..');
export const SCRIPTS = path.join(RAIZ_REPO, 'scripts');

const temporales = [];
process.on('exit', () => {
    for (const dir of temporales) rmSync(dir, { recursive: true, force: true });
});

/** Directorio temporal que se borra al terminar el proceso. */
export function temporal(prefijo = 'deck-test-') {
    const dir = mkdtempSync(path.join(os.tmpdir(), prefijo));
    temporales.push(dir);
    return dir;
}

/**
 * Lanza un script del repositorio con Node.
 *
 * @param {string} script   nombre del fichero dentro de `scripts/`
 * @param {string[]} args   argumentos de la línea de órdenes
 * @returns {{code: number|null, salida: string}} `salida` mezcla stdout y stderr
 */
export function ejecutar(script, args = []) {
    const r = spawnSync(process.execPath, [path.join(SCRIPTS, script), ...args], {
        cwd: RAIZ_REPO,
        encoding: 'utf8',
    });
    return { code: r.status, salida: (r.stdout ?? '') + (r.stderr ?? '') };
}
