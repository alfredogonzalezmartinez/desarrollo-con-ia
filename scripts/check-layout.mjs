#!/usr/bin/env node
/**
 * Comprueba la maquetación de las 32 slides con un navegador de verdad.
 *
 * El escenario es fijo (1920×1080) y cada slide es una ventana con
 * `overflow: hidden`: lo que no cabe, se recorta sin avisar. Este script abre
 * el deck, mide cada slide y dice qué elementos se salen de la ventana.
 *
 * Uso:  npm run check
 * Requiere:  npx playwright install chromium
 */
import { chromium } from 'playwright';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');
const DECK = path.join(ROOT, 'dist', 'index.html');

// `install chromium` puede haber dejado solo el navegador completo o solo el
// *headless shell* según la versión de Playwright; vale cualquiera de los dos.
async function launch() {
    try {
        return await chromium.launch();
    } catch (err) {
        if (!String(err).includes("Executable doesn't exist")) throw err;
        return await chromium.launch({ channel: 'chromium' });
    }
}

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(pathToFileURL(DECK).href);
await page.waitForTimeout(400);

const report = await page.evaluate(() => {
    // Sin animaciones: se mide el estado final, no el de entrada.
    const style = document.createElement('style');
    style.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}'
        + '.reveal{opacity:1!important;transform:none!important}';
    document.head.appendChild(style);

    const out = [];
    document.querySelectorAll('.slide').forEach((slide, k) => {
        const win = slide.querySelector('.win');
        const w = win.getBoundingClientRect();
        const bad = [];
        win.querySelectorAll('*').forEach((el) => {
            if (el.closest('.tip')) return;                    // los tooltips se salen a propósito
            const cs = getComputedStyle(el);
            if (cs.visibility === 'hidden' || cs.display === 'none') return;
            const r = el.getBoundingClientRect();
            if (!r.width && !r.height) return;
            // Desbordamiento respecto a la ventana (con 2px de tolerancia para
            // los redondeos de borde). Sin sumar holguras: eso daba falsos
            // positivos con el cromo pegado a los bordes de `.win`.
            const down = Math.round(r.bottom - w.bottom);
            const right = Math.round(r.right - w.right);
            const up = Math.round(w.top - r.top);
            if (down > 2 || right > 2 || up > 2) {
                bad.push({
                    sel: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string'
                        ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''),
                    down: Math.max(0, down), right: Math.max(0, right), up: Math.max(0, up),
                    text: (el.textContent || '').trim().slice(0, 46),
                });
            }
        });
        // De cada slide, solo el peor desbordamiento de cada eje.
        const worst = (axis) => bad.slice().sort((a, b) => b[axis] - a[axis])[0] || null;
        out.push({
            k: k + 1,
            id: slide.id,
            title: slide.dataset.title || '',
            h: Math.round(win.querySelector('.win-body').scrollHeight),
            over: Math.round(win.querySelector('.win-body').scrollHeight - win.querySelector('.win-body').clientHeight),
            down: worst('down'), right: worst('right'), up: worst('up'),
        });
    });

    // Interacciones que conviene verificar de paso.
    const mode = document.getElementById('mode');
    mode.click();
    const charla = document.body.classList.contains('charla');
    const visibles = [...document.querySelectorAll('.slide')].filter((s) => s.dataset.kind !== 'branch').length;
    mode.click();

    const tip = document.querySelector('.term .tip');
    return {
        slides: out, charla, visibles,
        tieneTip: !!tip,
        tipTexto: tip ? tip.textContent.trim().slice(0, 60) : '',
        numeroSuperindice: (document.querySelector('.term-ref') || {}).textContent || '',
        mapa: document.querySelectorAll('#mapGrid .mi').length,
    };
});

await browser.close();

let fallos = 0;
console.log('\n  Maquetación de ' + report.slides.length + ' slides\n  ' + '-'.repeat(52));
for (const s of report.slides) {
    const problemas = [];
    if (s.down && s.down.down > 2) problemas.push('se sale ' + s.down.down + 'px por abajo: ' + s.down.sel);
    if (s.right && s.right.right > 2) problemas.push('se sale ' + s.right.right + 'px por la derecha: ' + s.right.sel);
    if (s.up && s.up.up > 2) problemas.push('se sale ' + s.up.up + 'px por arriba: ' + s.up.sel);
    if (s.over > 2) problemas.push('contenido ' + s.over + 'px más alto que el hueco');
    const tag = String(s.k).padStart(2, '0');
    if (problemas.length) {
        fallos++;
        console.log('  ' + tag + ' ✗ ' + s.title);
        for (const p of problemas) console.log('        ' + p);
    } else {
        console.log('  ' + tag + ' · ' + s.title + '  (' + s.h + 'px)');
    }
}

console.log('\n  ' + '-'.repeat(52));
console.log('  modo charla: ' + (report.charla ? 'activa y se apaga' : 'NO FUNCIONA') + ' · deja ' + report.visibles + ' slides visibles');
console.log('  tooltips: ' + (report.tieneTip ? 'generados — "' + report.tipTexto + '…"' : 'NO SE GENERAN'));
console.log('  numeración del glosario: primer superíndice = "' + report.numeroSuperindice + '"');
console.log('  mapa: ' + report.mapa + ' entradas');
console.log(fallos ? '\n  ' + fallos + ' slide(s) con desbordamiento\n' : '\n  Ninguna slide se sale de su ventana\n');
process.exit(0);
