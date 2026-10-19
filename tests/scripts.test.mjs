/**
 * Capa barata: que los ficheros de `scripts/` al menos se puedan leer.
 *
 * Un `}` de menos deja un script roto, y algunos (como `subset-fonts.sh`) se
 * ejecutan tan de tarde en tarde que nadie lo nota hasta que hacen falta.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { SCRIPTS } from './helpers.mjs';

const ficheros = readdirSync(SCRIPTS).sort();
const mjs = ficheros.filter((f) => f.endsWith('.mjs'));
const sh = ficheros.filter((f) => f.endsWith('.sh'));

test('hay scripts que revisar', () => {
    assert.ok(mjs.length > 0, 'no he encontrado ningún .mjs en scripts/');
    assert.ok(sh.length > 0, 'no he encontrado ningún .sh en scripts/');
});

test('todos los .mjs tienen sintaxis correcta', () => {
    for (const f of mjs) {
        const r = spawnSync(process.execPath, ['--check', path.join(SCRIPTS, f)], { encoding: 'utf8' });
        assert.equal(r.status, 0, f + ' no pasa `node --check`:\n' + r.stderr);
    }
});

test('los .sh tienen sintaxis correcta', { skip: process.platform === 'win32' ? 'sin bash' : false }, () => {
    for (const f of sh) {
        const r = spawnSync('bash', ['-n', path.join(SCRIPTS, f)], { encoding: 'utf8' });
        assert.equal(r.status, 0, f + ' no pasa `bash -n`:\n' + r.stderr);
    }
});
