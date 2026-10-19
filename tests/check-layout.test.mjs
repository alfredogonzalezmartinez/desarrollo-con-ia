/**
 * Malla de seguridad de `check-layout.mjs`.
 *
 * Necesita el navegador de Playwright. Para no depender de que `dist/` esté
 * compilado —y no pisarlo—, copia el `src/` de verdad a un directorio temporal
 * y compila y mide ahí. Lo que se mide es el deck real: lo único que se toca es
 * lo que cada test estropea a propósito.
 */
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { RAIZ_REPO, ejecutar, temporal } from './helpers.mjs';

const raiz = temporal('deck-layout-');
const deck = path.join(raiz, 'dist', 'index.html');

/** El mismo deck, con lo que le pasa `estropicio`. */
function copia(nombre, estropicio) {
    const fichero = path.join(raiz, nombre);
    writeFileSync(fichero, estropicio(readFileSync(deck, 'utf8')));
    return fichero;
}

before(() => {
    cpSync(path.join(RAIZ_REPO, 'src'), path.join(raiz, 'src'), { recursive: true });
    const r = ejecutar('build.mjs', ['--root=' + raiz, '--no-minify']);
    assert.equal(r.code, 0, 'no he podido compilar el deck de prueba:\n' + r.salida);
});

const medir = (fichero) => ejecutar('check-layout.mjs', ['--deck=' + fichero]);

test('el deck real no se sale de su ventana', () => {
    const r = medir(deck);
    assert.equal(r.code, 0, r.salida);
    assert.ok(r.salida.includes('Ninguna slide se sale de su ventana'), r.salida);
});

test('una slide que se sale por abajo falla', () => {
    const forzado = copia('desbordado.html', (html) => {
        // Se empuja hacia abajo el último hijo del cuerpo de una slide: el
        // desbordamiento clásico de este deck, el que se recorta en silencio.
        const id = html.match(/class="slide" id="([^"]+)"/)[1];
        return html.replace('</head>',
            '<style>#' + id + ' .win-body > *:last-child { padding-bottom: 4000px; }</style></head>');
    });
    const r = medir(forzado);
    assert.equal(r.code, 1, 'debería salir con 1. Salida:\n' + r.salida);
    assert.ok(r.salida.includes('por abajo'), r.salida);
    assert.ok(r.salida.includes('1 slide(s) con desbordamiento'), r.salida);
});

test('sin tooltips del glosario, falla', () => {
    const sinTips = copia('sin-tooltips.html', (html) => html.replace(/ data-term="[^"]*"/g, ''));
    const r = medir(sinTips);
    assert.equal(r.code, 1, 'debería salir con 1. Salida:\n' + r.salida);
    assert.ok(r.salida.includes('NO SE GENERAN'), r.salida);
});
