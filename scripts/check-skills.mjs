#!/usr/bin/env node
/**
 * Comprueba que las skills del proyecto están donde deben.
 *
 * Las skills viven en `.agents/skills/<id>` (el estándar: una sola copia) y se
 * enlazan desde `.claude/skills/<id>` con enlaces simbólicos, para que Claude
 * Code también las vea. Un clon a medias, un sistema sin symlinks o una skill
 * mal copiada rompen esto en silencio: el agente simplemente no la encuentra.
 *
 * Uso:  npm run skills:check
 */
import { readFileSync, readdirSync, lstatSync, readlinkSync, existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const REAL = path.join(ROOT, '.agents', 'skills');    // donde vive la copia de verdad
const PUENTE = path.join(ROOT, '.claude', 'skills');  // donde Claude Code las busca

// `propia` = la mantiene este repositorio. `externa` = copiada de fuera, así que
// además tiene que explicar de dónde viene (PROCEDENCIA.md) y con qué licencia:
// o un fichero `LICENSE`, o un `license:` en el frontmatter del SKILL.md.
const SKILLS = [
    { id: 'codely-git-conventional-commit', clase: 'externa' },
    { id: 'frontend-slides', clase: 'externa' },
    { id: 'mantener-deck', clase: 'propia' },
    { id: 'playwright-cli', clase: 'externa' },
];

// Ancho de la columna del nombre; el id más largo manda.
const ANCHO_ID = Math.max(...SKILLS.map((s) => s.id.length)) + 2;

const problemas = [];
let conProblemas = 0;

const esEnlace = (p) => {
    try { return lstatSync(p).isSymbolicLink(); } catch { return false; }
};
const contarFicheros = (dir) =>
    readdirSync(dir, { recursive: true, withFileTypes: true }).filter((e) => e.isFile()).length;

console.log('\n  Skills del proyecto\n  ' + '-'.repeat(72));
for (const { id, clase } of SKILLS) {
    const real = path.join(REAL, id);
    const enlace = path.join(PUENTE, id);
    const notas = [];
    let fallos = 0;

    // --- La copia de verdad -------------------------------------------------
    const skillMd = path.join(real, 'SKILL.md');
    let licencia = false;
    if (!existsSync(skillMd)) {
        problemas.push('.agents/skills/' + id + ': falta SKILL.md');
        notas.push('SIN SKILL.md');
        fallos++;
    } else {
        const texto = readFileSync(skillMd, 'utf8');
        if (!/^---\r?\n[\s\S]*name:\s*\S/.test(texto)) {
            problemas.push('.agents/skills/' + id + '/SKILL.md: el frontmatter no declara `name:`');
            notas.push('frontmatter sin `name:`');
            fallos++;
        }
        licencia = /^---\r?\n[\s\S]*?license:\s*\S/.test(texto);
        const n = contarFicheros(real);
        notas.push(n + (n === 1 ? ' fichero' : ' ficheros'));
    }
    if (clase === 'externa') {
        if (!existsSync(path.join(real, 'PROCEDENCIA.md'))) {
            problemas.push('.agents/skills/' + id + ': falta PROCEDENCIA.md (skill externa)');
            notas.push('falta PROCEDENCIA.md');
            fallos++;
        }
        // Basta una de las dos: el fichero `LICENSE` o un `license:` en el
        // frontmatter (hay repositorios de origen que no traen ninguno).
        if (!existsSync(path.join(real, 'LICENSE')) && !licencia) {
            problemas.push('.agents/skills/' + id + ': sin licencia: ni `LICENSE` ni `license:` en SKILL.md');
            notas.push('sin licencia');
            fallos++;
        }
    }

    // --- El puente para Claude Code ----------------------------------------
    const esperado = path.relative(path.dirname(enlace), real);
    let estado;
    if (!esEnlace(enlace)) {
        estado = existsSync(enlace) ? 'no es un enlace simbólico' : 'FALTA';
        problemas.push('.claude/skills/' + id + ': ' + estado
            + ' (¿clonado en Windows sin `core.symlinks`?)');
        fallos++;
    } else if (!existsSync(enlace)) {
        estado = 'ROTO (el destino no existe)';
        problemas.push('.claude/skills/' + id + ': enlace roto → ' + readlinkSync(enlace));
        fallos++;
    } else if (readlinkSync(enlace) !== esperado) {
        estado = 'apunta a ' + readlinkSync(enlace);
        problemas.push('.claude/skills/' + id + ': debería apuntar a ' + esperado);
        fallos++;
    } else {
        estado = 'enlace correcto → ' + esperado;
    }

    if (fallos) conProblemas++;
    console.log('  ' + (fallos ? '✗' : '·') + ' ' + id.padEnd(ANCHO_ID) + notas.join(' · '));
    console.log('  ' + ' '.repeat(ANCHO_ID + 2) + '.claude/skills/' + id + '  ' + estado);
}

console.log('  ' + '-'.repeat(72));
if (problemas.length) {
    console.error('\n  Comprobaciones fallidas:');
    for (const p of problemas) console.error('   · ' + p);
    console.error('\n  ' + conProblemas + ' skill(s) con problemas.');
    console.error('  Si es el puente: bórralo y vuelve a crearlo con los comandos de AGENTS.md.');
    console.error('  En Windows, activa el Modo desarrollador (o `git config core.symlinks true`)');
    console.error('  y clona otra vez.\n');
    process.exit(1);
}
console.log('  ' + SKILLS.length + ' skills · copia en .agents/skills · puente en .claude/skills\n');
