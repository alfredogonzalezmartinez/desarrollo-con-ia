#!/usr/bin/env node
/**
 * Compila `src/index.html` en un único HTML autocontenido.
 *
 *   1. Embebe los assets (fuentes woff2, imágenes…) como data URI.
 *   2. Comprueba que el resultado no depende de la red y que ningún
 *      enlace interno apunta a un ancla que no existe.
 *   3. Minifica HTML, CSS y JS.
 *
 * Uso:
 *   npm run build            → dist/index.html minificado
 *   npm run build:dev        → dist/index.html sin minificar (para depurar)
 */
import { readFileSync, existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src', 'index.html');
const OUT_DIR = path.join(ROOT, 'dist');
const OUT = path.join(OUT_DIR, 'index.html');
const MINIFY = !process.argv.includes('--no-minify');

const MIME = {
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
};

const kb = (n) => (n / 1024).toFixed(1).padStart(6) + ' KB';
const problems = [];

if (!existsSync(SRC)) {
    console.error('No existe ' + path.relative(ROOT, SRC));
    process.exit(1);
}

let html = readFileSync(SRC, 'utf8');
const rawSize = Buffer.byteLength(html);

// ---------------------------------------------------------------------------
// 1. Assets → data URI
// ---------------------------------------------------------------------------
const embedded = [];
const inlined = (rel) => {
    const abs = path.join(ROOT, 'src', rel);
    if (!existsSync(abs)) throw new Error('Falta el asset ' + rel);
    const ext = path.extname(rel).toLowerCase();
    const mime = MIME[ext] ?? 'application/octet-stream';
    const buf = readFileSync(abs);
    embedded.push([rel, buf.length]);
    return 'data:' + mime + ';base64,' + buf.toString('base64');
};

// url(assets/…) dentro de <style> (fuentes, fondos).
html = html.replace(/url\(\s*(['"]?)(assets\/[^'")]+)\1\s*\)/g,
    (m, q, rel) => 'url(' + q + inlined(rel) + q + ')');

// src="assets/…" / href="assets/…" (imágenes, si algún día las hay).
html = html.replace(/(\b(?:src|href)\s*=\s*)(['"])(assets\/[^'"]+)\2/g,
    (m, attr, q, rel) => attr + q + inlined(rel) + q);

// ---------------------------------------------------------------------------
// 2. Comprobaciones
// ---------------------------------------------------------------------------
const depr = html.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi);
if (depr) problems.push('Se esperaba todo el CSS en línea, pero hay <link rel="stylesheet">: ' + depr.join(', '));

const scripts = html.match(/<script[^>]+\bsrc=/gi);
if (scripts) problems.push('Se esperaba todo el JS en línea, pero hay <script src=…>');

// Los <a href="http…"> son enlaces a documentación y se cuentan aparte; lo que no
// puede quedar son recursos que haya que descargar para que el deck se vea bien.
const remoteAttr = html.match(/\bsrc\s*=\s*["']https?:\/\/[^"']+/gi);
if (remoteAttr) problems.push('Recursos remotos (deben ir embebidos): ' + remoteAttr.join(', '));

const remoteLink = html.match(/<link\b[^>]*\bhref\s*=\s*["']https?:\/\/[^"']+/gi);
if (remoteLink) problems.push('Recursos remotos (deben ir embebidos): ' + remoteLink.join(', '));

const remoteUrl = html.match(/url\(\s*['"]?https?:\/\//gi);
if (remoteUrl) problems.push('Hay ' + remoteUrl.length + ' url(http…) sin embeber.');

// Anclas internas: que ningún href="#…" apunte al vacío.
const idList = [...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map((m) => m[1]);
const ids = new Set(idList);
const dangling = [...new Set(
    [...html.matchAll(/\bhref\s*=\s*["']#([^"']+)["']/g)].map((m) => m[1]).filter((h) => !ids.has(h))
)];
if (dangling.length) problems.push('Anclas rotas (#' + dangling.join(', #') + ')');

// Ids duplicados: rompen los enlaces internos y el tooltip.
const dupes = [...new Set(idList.filter((id, k) => idList.indexOf(id) !== k))];
if (dupes.length) problems.push('Ids duplicados: ' + dupes.join(', '));

// ---------------------------------------------------------------------------
// 3. Minificado
// ---------------------------------------------------------------------------
if (MINIFY) {
    const { minify } = await import('html-minifier-terser');
    html = await minify(html, {
        collapseWhitespace: true,
        conservativeCollapse: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
        removeRedundantAttributes: true,
        collapseBooleanAttributes: true,
        keepClosingSlash: false,
        useShortDoctype: true,
        sortAttributes: false,
    });
}

await mkdir(OUT_DIR, { recursive: true });
await writeFile(OUT, html, 'utf8');

// ---------------------------------------------------------------------------
// 4. Informe
// ---------------------------------------------------------------------------
const out = Buffer.from(html, 'utf8');
const slides = (html.match(/class="slide(?: |")/g) ?? []).length;
const externalLinks = (html.match(/<a\b[^>]*\bhref\s*=\s*["']https?:\/\//gi) ?? []).length;
const breadth = (html.match(/data-kind="branch"/g) ?? []).length;

console.log('\n  Desarrollo con IA · build' + (MINIFY ? '' : ' (sin minificar'));
console.log('  ' + '-'.repeat(46));
console.log('  fuente   src/index.html      ' + kb(rawSize));
for (const [rel, size] of embedded) console.log('  embebido ' + rel.padEnd(28) + kb(size));
console.log('  salida   dist/index.html     ' + kb(out.length));
console.log('  comprimido  gzip             ' + kb(zlib.gzipSync(out, { level: 9 }).length));
console.log('  comprimido  brotli           ' + kb(zlib.brotliCompressSync(out).length));
console.log('  ' + '-'.repeat(46));
console.log('  ' + slides + ' slides · ' + breadth + ' de profundización · ' + embedded.length + ' assets embebidos');
console.log('  ' + externalLinks + ' enlaces externos (a documentación)\n');

if (problems.length) {
    console.error('  Comprobaciones fallidas:');
    for (const p of problems) console.error('   · ' + p);
    console.error('');
    process.exit(1);
}
console.log('  Sin dependencias de red · anclas internas correctas\n');
