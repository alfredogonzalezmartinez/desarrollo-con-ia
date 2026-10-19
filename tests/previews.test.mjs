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
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { numeroDeRama, pideVistaPrevia, publicar, recoger } from '../scripts/previews.mjs';
import { RAIZ_REPO, temporal } from './helpers.mjs';

const HTML = '<!doctype html><title>vista previa</title><p>hola</p>';

// Un comentario de la PR: el cuerpo, la asociación de quien lo escribió y su
// login. Es lo que devuelve la API de GitHub.
const comentario = (body, asoc = 'NONE', login = 'alguien') => ({
    body,
    author_association: asoc,
    login,
});

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

test('publicar dos veces deja la historia en línea, sin force push', () => {
    const remoto = temporal('previews-remoto-');
    execFileSync('git', ['init', '--bare', '--quiet', remoto]);
    const raiz = temporal('previews-raiz-');
    execFileSync('git', ['init', '--quiet', raiz]);
    const fichero = path.join(raiz, 'index.html');

    writeFileSync(fichero, '<p>primera</p>');
    publicar(7, fichero, remoto, '');
    writeFileSync(fichero, '<p>segunda</p>');
    publicar(7, fichero, remoto, '');

    // Los dos commits, uno encima del otro: el segundo push fue un
    // fast-forward y no hizo falta reescribir nada.
    const log = execFileSync('git', ['log', '--format=%s', 'refs/heads/previews/pr-7'],
        { cwd: remoto, encoding: 'utf8' });
    assert.equal(log.trim().split('\n').length, 2, log);
    const ancestro = spawnSync('git',
        ['merge-base', '--is-ancestor', 'refs/heads/previews/pr-7~1', 'refs/heads/previews/pr-7'],
        { cwd: remoto });
    assert.equal(ancestro.status, 0, 'el segundo push no fue un fast-forward');

    // Y lo que se publica es la última versión.
    const html = execFileSync('git', ['show', 'refs/heads/previews/pr-7:index.html'],
        { cwd: remoto, encoding: 'utf8' });
    assert.equal(html, '<p>segunda</p>');
});

// La regla que decide si una PR se refresca sola: hace falta que alguien haya
// pedido la vista previa con `/preview`. Sin eso, un commit nuevo no publica
// nada (y abrir una PR tampoco).
test('una PR sin comentarios no tiene la vista previa pedida', () => {
    assert.equal(pideVistaPrevia([]), false);
});

test('un comentario `/preview` del owner pide la vista previa', () => {
    const c = [comentario('/preview', 'OWNER', 'ana')];
    assert.equal(pideVistaPrevia(c), true);
});

test('un comentario `/preview` de un miembro o un colaborador también cuenta', () => {
    assert.equal(pideVistaPrevia([comentario('/preview', 'MEMBER', 'beto')]), true);
    assert.equal(pideVistaPrevia([comentario('/preview', 'COLLABORATOR', 'carla')]), true);
});

test('un `/preview` de alguien sin permiso no cuenta', () => {
    // Salvo que esté en la lista de autorizados.
    const c = [comentario('/preview', 'NONE', 'rival')];
    assert.equal(pideVistaPrevia(c), false);
    assert.equal(pideVistaPrevia(c, ['rival']), true);
});

test('cualquier otro comentario no pide la vista previa', () => {
    assert.equal(pideVistaPrevia([comentario('hola', 'OWNER')]), false);
    assert.equal(pideVistaPrevia([comentario('mira esto: /preview', 'OWNER')]), false);
});

test('el comentario del bot no cuenta como petición', () => {
    // Es el que lleva la vista previa: si contara, una PR se refrescaría sola
    // para siempre.
    const c = [comentario('<!-- deck-preview -->\n### Vista previa del deck', 'NONE', 'github-actions[bot]')];
    assert.equal(pideVistaPrevia(c), false);
});

test('el comando `pedir` dice si la vista previa está pedida', () => {
    const raiz = temporal('previews-pedir-');
    const fichero = path.join(raiz, 'comentarios.jsonl');
    const script = path.join(RAIZ_REPO, 'scripts', 'previews.mjs');
    const escribir = (...cs) => writeFileSync(fichero, cs.map((c) => JSON.stringify(c)).join('\n') + '\n');

    escribir(comentario('/preview', 'OWNER', 'ana'));
    const si = execFileSync(process.execPath, [script, 'pedir', fichero], { encoding: 'utf8' });
    assert.equal(si.trim(), 'si');

    escribir(comentario('hola', 'OWNER', 'ana'));
    const no = execFileSync(process.execPath, [script, 'pedir', fichero], { encoding: 'utf8' });
    assert.equal(no.trim(), 'no');

    // Con la lista de autorizados, el mismo comentario cuenta.
    escribir(comentario('/preview', 'NONE', 'rival'));
    const conLista = execFileSync(process.execPath,
        [script, 'pedir', '--autorizados=rival', fichero], { encoding: 'utf8' });
    assert.equal(conLista.trim(), 'si');
});
