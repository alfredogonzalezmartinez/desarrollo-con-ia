#!/usr/bin/env node
/**
 * Vistas previas de los pull requests.
 *
 * Cada pull request puede tener una rama `previews/pr-<n>` con el deck ya
 * compilado. Este script se encarga de esas ramas:
 *
 *   - `publicar <n> <fichero>` → deja el HTML en la rama de la PR.
 *   - `recoger`                → copia las ramas existentes a
 *                                 `dist/previews/<n>/index.html`, que es lo
 *                                 que GitHub Pages publica.
 *   - `listar`                 → dice qué PR tienen vista previa.
 *
 * El sitio lo publica **solo** `pages.yml`, que llama a este script. Así hay un
 * único publicador: el despliegue al mergear en `main` no pisa las vistas
 * previas de las PR que siguen abiertas, y la de la PR que se acaba de mergear
 * desaparece sola, porque su rama ya no está.
 */
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(import.meta.dirname, '..');
const PREFIJO = 'previews/pr-';
const ESPACIO = 'refs/previews/';

const arg = (nombre, def) => {
    const hit = process.argv.find((a) => a.startsWith('--' + nombre + '='));
    return hit ? hit.split('=').slice(1).join('=') : def;
};

const git = (args, cwd = RAIZ) =>
    execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

/** Número de PR de una rama de vista previa, o `null` si no lo es. */
export function numeroDeRama(rama) {
    const m = new RegExp('^' + PREFIJO + '(\\d+)$').exec(rama);
    return m ? Number(m[1]) : null;
}

/** Ramas de vista previa que hay en el remoto. */
export function ramas(remoto, cwd = RAIZ) {
    // Ojo con el `*` de la derecha: git solo conserva el prefijo hasta la
    // última barra, así que el destino tiene que ser `refs/previews/*` (y no
    // `refs/previews/pr-*`, que dejaría las refs en `refs/previews/7`).
    git(['fetch', '--quiet', remoto, '+refs/heads/previews/*:' + ESPACIO + '*'], cwd);
    const salida = git(['for-each-ref', '--format=%(refname:short)', ESPACIO], cwd);
    return salida.split('\n').map((s) => s.trim()).filter(Boolean);
}

/** Copia las vistas previas a `dist/previews/pr-<n>/index.html`. Devuelve cuántas. */
export function recoger(raiz = RAIZ, remoto = 'origin') {
    const base = path.join(raiz, 'dist', 'previews');
    rmSync(base, { recursive: true, force: true });
    let n = 0;
    for (const rama of ramas(remoto, raiz)) {
        const pr = numeroDeRama(rama);
        if (pr === null) continue;
        const html = git(['show', 'refs/' + rama + ':index.html'], raiz);
        // La carpeta se llama como la rama, para que la URL del sitio
        // (`/previews/pr-<n>/`) apunte al fichero publicado.
        const destino = path.join(base, 'pr-' + pr);
        mkdirSync(destino, { recursive: true });
        writeFileSync(path.join(destino, 'index.html'), html, 'utf8');
        n++;
    }
    return n;
}

/** Publica el HTML en la rama de la vista previa de la PR. */
export function publicar(pr, fichero, remoto = 'origin', token = '') {
    const rama = PREFIJO + pr;
    const tmp = mkdtempSync(path.join(os.tmpdir(), 'previews-'));
    try {
        // Un remoto que sea una URL necesita credenciales; un path local no.
        const url = remoto.startsWith('http')
            ? 'https://x-access-token:' + token + '@' + remoto.replace(/^https?:\/\//, '')
            : remoto;

        // Si la rama ya existe se clona y se le añade un commit encima: la
        // historia de la vista previa queda en línea y el push es un
        // fast-forward. Nada de force push, ni aquí ni en el repo.
        if (git(['ls-remote', url, 'refs/heads/' + rama], tmp).trim()) {
            git(['clone', '--quiet', '--branch', rama, url, tmp], tmp);
        } else {
            git(['init', '--quiet'], tmp);
            git(['remote', 'add', 'origin', url], tmp);
            git(['checkout', '--quiet', '-b', rama], tmp);
        }
        git(['config', 'user.name', 'github-actions[bot]'], tmp);
        git(['config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com'], tmp);
        copyFileSync(fichero, path.join(tmp, 'index.html'));
        git(['add', 'index.html'], tmp);
        git(['commit', '--quiet', '-m', 'Vista previa de la PR #' + pr], tmp);
        git(['push', '--quiet', 'origin', 'HEAD:refs/heads/' + rama], tmp);
    } finally {
        rmSync(tmp, { recursive: true, force: true });
    }
}

// ---------------------------------------------------------------------------
// Línea de órdenes
// ---------------------------------------------------------------------------
const esPrincipal = process.argv[1]
    && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (esPrincipal) {
    const comando = process.argv[2];
    const raiz = path.resolve(arg('root', RAIZ));
    const remoto = arg('remoto', 'origin');

    if (comando === 'publicar') {
        publicar(Number(process.argv[3]), process.argv[4], remoto,
            process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '');
        console.log('  publicada la vista previa de la PR #' + process.argv[3]);
    } else if (comando === 'recoger') {
        console.log('  ' + recoger(raiz, remoto) + ' vista(s) previa(s) en dist/previews');
    } else if (comando === 'listar') {
        for (const rama of ramas(remoto, raiz)) console.log('  ' + rama);
    } else {
        console.error('  Uso: previews.mjs <publicar|recoger|listar> [...]');
        process.exit(1);
    }
}
