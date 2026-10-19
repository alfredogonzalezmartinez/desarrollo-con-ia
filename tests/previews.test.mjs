/**
 * Malla de seguridad de `scripts/previews.mjs`.
 *
 * Las vistas previas son el mecanismo que deja el HTML de una PR en una URL
 * pública, así que aquí se comprueba lo importante: que la rama se llama como
 * toca, que el HTML llega intacto y que solo se recoge lo que es una vista
 * previa.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { numeroDeRama, publicar, recoger } from '../scripts/previews.mjs';
import { temporal } from './helpers.mjs';

const HTML = '<!doctype html><title>vista previa</title><p>hola</p>';

test('el número de PR se lee del nombre de la rama', () => {
    assert.equal(numeroDeRama('previews/pr-123'), 123);
    assert.equal(numeroDeRama('previews/pr-7'), 7);
});

test('una rama que no es vista previa no cuenta', () => {
    assert.equal(numeroDeRama('main'), null);
    assert.equal(numeroDeRama('previews/pr-abc'), null);
    assert.equal(numeroDeRama('previews/pr-'), null);
    assert.equal(numeroDeRama('otra/previews/pr-1'), null);
});

test('publicar deja el HTML en la rama y recoger lo copia a dist', () => {
    // Un remoto de mentira: un repositorio vacío en el disco.
    const remoto = temporal('previews-remoto-');
    execFileSync('git', ['init', '--bare', '--quiet', remoto]);

    // Y un repositorio de trabajo donde se ejecuta el `fetch`.
    const raiz = temporal('previews-raiz-');
    execFileSync('git', ['init', '--quiet', raiz]);

    const fichero = path.join(raiz, 'index.html');
    writeFileSync(fichero, HTML);

    publicar(7, fichero, remoto, '');

    const ramas = execFileSync('git', ['for-each-ref', '--format=%(refname:short)', 'refs/heads/'],
        { cwd: remoto, encoding: 'utf8' });
    assert.ok(ramas.includes('previews/pr-7'), 'la rama no se ha creado:\n' + ramas);

    assert.equal(recoger(raiz, remoto), 1);
    // La carpeta se llama como la rama: la URL del sitio es /previews/pr-7/.
    const destino = path.join(raiz, 'dist', 'previews', 'pr-7', 'index.html');
    assert.ok(existsSync(destino), 'no se ha copiado la vista previa');
    assert.equal(readFileSync(destino, 'utf8'), HTML);
});

test('recoger sin previews no inventa nada', () => {
    const remoto = temporal('previews-remoto-');
    execFileSync('git', ['init', '--bare', '--quiet', remoto]);
    const raiz = temporal('previews-raiz-');
    execFileSync('git', ['init', '--quiet', raiz]);

    assert.equal(recoger(raiz, remoto), 0);
    assert.ok(!existsSync(path.join(raiz, 'dist', 'previews')));
});
