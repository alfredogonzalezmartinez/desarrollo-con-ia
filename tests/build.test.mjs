/**
 * Malla de seguridad de `build.mjs`: las comprobaciones que protegen el deck.
 *
 * Cada regla tiene aquí su parte de «debe fallar». Si alguien suaviza un regex
 * sin querer, esta suite se pone roja aunque el deck siga compilando. Y las
 * plantillas válidas tienen su parte de «no debe quejarse», porque una malla
 * que da falsos positivos se acaba ignorando.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { ejecutar, temporal } from './helpers.mjs';

// Plantilla mínima pero honesta: un ancla interna que existe de verdad, un
// enlace externo de documentación (eso sí está permitido) y ningún recurso que
// haya que descargar.
const VALIDA = `<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Prueba</title>
    <style>
        body { margin: 0; }
    </style>
</head>
<body>
    <section class="slide" id="s-uno" data-title="Uno">
        <h1>Hola</h1>
        <p><a href="#s-dos">Ir a la segunda</a></p>
        <p><a href="https://example.com/doc">Documentación</a></p>
    </section>
    <section class="slide" id="s-dos" data-title="Dos"><p>Adiós</p></section>
    <script>document.body.dataset.listo = '1';</script>
</body>
</html>`;

/** Compila un HTML de prueba en un directorio temporal. */
function compilar(html, { minificar = false, assets = {} } = {}) {
    const raiz = temporal();
    mkdirSync(path.join(raiz, 'src'), { recursive: true });
    writeFileSync(path.join(raiz, 'src', 'index.html'), html);
    for (const [rel, bytes] of Object.entries(assets)) {
        const fichero = path.join(raiz, 'src', rel);
        mkdirSync(path.dirname(fichero), { recursive: true });
        writeFileSync(fichero, bytes);
    }
    const args = ['--root=' + raiz];
    if (!minificar) args.push('--no-minify');
    return { raiz, ...ejecutar('build.mjs', args) };
}

/** Comprueba que esta plantilla falla y que el aviso esperado aparece. */
function esperaFallo(html, aviso, opciones) {
    const r = compilar(html, opciones);
    assert.equal(r.code, 1, 'debería salir con 1. Salida:\n' + r.salida);
    assert.ok(r.salida.includes(aviso), 'esperaba «' + aviso + '» en:\n' + r.salida);
}

test('una plantilla válida compila', () => {
    const r = compilar(VALIDA);
    assert.equal(r.code, 0, r.salida);
    assert.ok(r.salida.includes('Sin dependencias de red'), r.salida);
    assert.ok(statSync(path.join(r.raiz, 'dist', 'index.html')).size > 0);
});

test('sin src/index.html avisa y falla', () => {
    const raiz = temporal();
    const r = ejecutar('build.mjs', ['--root=' + raiz, '--no-minify']);
    assert.equal(r.code, 1, r.salida);
    assert.ok(r.salida.includes('No existe src/index.html'), r.salida);
});

test('CSS enlazado en vez de en línea', () => {
    esperaFallo(VALIDA.replace('</head>', '<link rel="stylesheet" href="deck.css"></head>'),
        'todo el CSS en línea');
});

test('JS enlazado en vez de en línea', () => {
    esperaFallo(VALIDA.replace('</head>', '<script src="deck.js"></script></head>'),
        'todo el JS en línea');
});

test('imagen remota', () => {
    esperaFallo(VALIDA.replace('<h1>Hola</h1>',
        '<h1>Hola</h1><img src="https://cdn.example.com/logo.png" alt="">'),
    'Recursos remotos');
});

test('icono remoto en un <link>', () => {
    esperaFallo(VALIDA.replace('</head>', '<link rel="icon" href="https://example.com/icono.svg"></head>'),
        'Recursos remotos');
});

test('fuente remota dentro de un url()', () => {
    esperaFallo(VALIDA.replace('body { margin: 0; }',
        'body { margin: 0; background: url(https://example.com/fondo.png); }'),
    'sin embeber');
});

test('ancla interna que no existe', () => {
    esperaFallo(VALIDA.replace('href="#s-dos"', 'href="#s-tres"'), 'Anclas rotas');
});

test('id duplicado (y solo eso)', () => {
    const r = compilar(VALIDA.replace('id="s-dos"', 'id="s-uno"').replace('href="#s-dos"', 'href="#s-uno"'));
    assert.equal(r.code, 1, 'debería salir con 1. Salida:\n' + r.salida);
    assert.ok(r.salida.includes('Ids duplicados'), r.salida);
    // El ancla se ha arreglado en la misma plantilla: si además se quejara de
    // ella, sería un falso positivo y el aviso perdería el sentido.
    assert.ok(!r.salida.includes('Anclas rotas'), r.salida);
});

test('asset que no está', () => {
    esperaFallo(VALIDA.replace('body { margin: 0; }',
        'body { margin: 0; background: url(assets/no-existe.png); }'),
    'Falta el asset');
});

test('los assets que sí están se embeben', () => {
    const r = compilar(
        VALIDA.replace('body { margin: 0; }', 'body { margin: 0; background: url(assets/punto.png); }'),
        { assets: { 'assets/punto.png': Buffer.from([0x89, 0x50, 0x4e, 0x47]) } },
    );
    assert.equal(r.code, 0, r.salida);
    const salida = readFileSync(path.join(r.raiz, 'dist', 'index.html'), 'utf8');
    assert.ok(salida.includes('data:image/png;base64,'), 'no se ha embebido el asset');
    assert.ok(!salida.includes('assets/punto.png'), 'ha quedado la referencia al fichero');
});

test('minificado: el HTML de salida pesa menos que la fuente', () => {
    const r = compilar(VALIDA, { minificar: true });
    assert.equal(r.code, 0, r.salida);
    const salida = statSync(path.join(r.raiz, 'dist', 'index.html')).size;
    const fuente = Buffer.byteLength(VALIDA);
    assert.ok(salida < fuente, salida + ' bytes frente a ' + fuente);
});
