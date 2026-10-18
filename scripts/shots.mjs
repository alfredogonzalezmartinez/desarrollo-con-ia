#!/usr/bin/env node
/**
 * Captura todas las slides a 1920×1080, una imagen por slide.
 *
 * Sirve para revisar el deck fuera del navegador (y para enseñárselo a alguien
 * que no lo tenga abierto). El escenario es el mismo que mide
 * `check-layout.mjs`, con las animaciones desactivadas para ver el estado final.
 *
 * Uso:  npm run shots            → shots/01-portada.png …
 *       npm run shots -- --only=14    → solo la slide 14
 *       npm run shots -- --out=/tmp/deck
 * Requiere:  npx playwright install chromium
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '..');
const DECK = path.join(ROOT, 'dist', 'index.html');

const arg = (name, def) => {
    const hit = process.argv.find((a) => a.startsWith('--' + name + '='));
    return hit ? hit.split('=').slice(1).join('=') : def;
};
const outDir = path.resolve(arg('out', path.join(ROOT, 'shots')));
const only = Number(arg('only', 0));

if (!fs.existsSync(DECK)) {
    console.error('\n  No hay dist/index.html. Ejecuta `npm run build` primero.\n');
    process.exit(1);
}

// `install chromium` puede haber dejado el navegador completo o el *headless
// shell* según la versión de Playwright; vale cualquiera de los dos.
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
await page.waitForTimeout(600);
await page.addStyleTag({
    content: '*,*::before,*::after{animation:none!important;transition:none!important}'
        + '.reveal{opacity:1!important;transform:none!important}',
});

const ids = await page.evaluate(() => [...document.querySelectorAll('.slide')].map((s) => s.id));
fs.mkdirSync(outDir, { recursive: true });

const desde = only ? Math.max(1, only) : 1;
const hasta = only ? Math.min(only, ids.length) : ids.length;
for (let k = desde; k <= hasta; k++) {
    const name = String(k).padStart(2, '0') + '-' + ids[k - 1].replace(/^s-/, '');
    await page.screenshot({ path: path.join(outDir, name + '.png') });
    process.stdout.write(name + ' ');
    if (k < hasta) {
        await page.click('#next');
        await page.waitForTimeout(120);
    }
}

await browser.close();
console.log('\n  ' + (hasta - desde + 1) + ' captura(s) en ' + outDir + '\n');
