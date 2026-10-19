/**
 * Malla de seguridad de `check-skills.mjs`.
 *
 * Monta en un directorio temporal un árbol como el de verdad (la copia en
 * `.agents/skills` y el puente en `.claude/skills`) y estropea una cosa en cada
 * test. Los enlaces simbólicos se dejan fuera en Windows, donde crearlos pide
 * Modo desarrollador.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { RAIZ_REPO, ejecutar, temporal } from './helpers.mjs';

const enWindows = process.platform === 'win32';
const soloConEnlaces = { skip: enWindows ? 'Windows no crea enlaces simbólicos sin permisos' : false };

// La lista de skills vive en el script; se lee de ahí para no tenerla duplicada
// (si mañana se añade una, estos tests la ven solos).
const FUENTE = readFileSync(path.join(RAIZ_REPO, 'scripts', 'check-skills.mjs'), 'utf8');
const SKILLS = [...FUENTE.matchAll(/\{ id: '([^']+)', clase: '(\w+)' \}/g)]
    .map((m) => ({ id: m[1], clase: m[2] }));
const EXTERNA = SKILLS.find((s) => s.clase === 'externa');

const skillMd = (id, conLicencia = false) => '---\n'
    + 'name: ' + id + '\n'
    + 'description: Skill de prueba\n'
    + (conLicencia ? 'license: MIT\n' : '')
    + '---\n\n# ' + id + '\n';

/**
 * Árbol correcto y, además, lo que `romper` estropee.
 * La skill propia se queda sin `LICENSE` a propósito: la licencia solo se le
 * exige a las externas, así que el caso feliz ya comprueba que no se lo
 * pedimos a las nuestras.
 */
function montar(romper) {
    const raiz = temporal('deck-skills-');
    mkdirSync(path.join(raiz, '.claude', 'skills'), { recursive: true });
    for (const { id, clase } of SKILLS) {
        const real = path.join(raiz, '.agents', 'skills', id);
        mkdirSync(real, { recursive: true });
        writeFileSync(path.join(real, 'SKILL.md'), skillMd(id));
        if (clase === 'externa') {
            writeFileSync(path.join(real, 'PROCEDENCIA.md'), '# Procedencia\n');
            writeFileSync(path.join(real, 'LICENSE'), 'MIT\n');
        }
        const puente = path.join(raiz, '.claude', 'skills', id);
        symlinkSync(path.relative(path.dirname(puente), real), puente);
        romper?.(id, { real, puente, clase });
    }
    return raiz;
}

const revisar = (romper) => ejecutar('check-skills.mjs', ['--root=' + montar(romper)]);

/** Estropear solo la skill `elegida`. */
const soloEn = (elegida, fn) => (id, ctx) => { if (id === elegida) fn(id, ctx); };

function esperaFallo(romper, aviso) {
    const r = revisar(romper);
    assert.equal(r.code, 1, 'debería salir con 1. Salida:\n' + r.salida);
    assert.ok(r.salida.includes(aviso), 'esperaba «' + aviso + '» en:\n' + r.salida);
}

test('el script declara sus skills (si no, los tests no valen)', () => {
    assert.ok(SKILLS.length > 0, 'no he podido leer la lista de SKILLS');
    assert.ok(EXTERNA, 'no hay ninguna skill externa que revisar');
});

test('un árbol correcto pasa', () => {
    const r = revisar();
    assert.equal(r.code, 0, r.salida);
    assert.ok(r.salida.includes(SKILLS.length + ' skills'), r.salida);
});

test('falta el SKILL.md', () => {
    esperaFallo(soloEn(SKILLS[0].id, (id, { real }) => rmSync(path.join(real, 'SKILL.md'))),
        'falta SKILL.md');
});

test('el frontmatter no declara `name:`', () => {
    esperaFallo(soloEn(SKILLS[0].id, (id, { real }) =>
        writeFileSync(path.join(real, 'SKILL.md'), '---\ndescription: sin name\n---\n')),
    'no declara `name:`');
});

test('una skill externa sin PROCEDENCIA.md', () => {
    esperaFallo(soloEn(EXTERNA.id, (id, { real }) => rmSync(path.join(real, 'PROCEDENCIA.md'))),
        'falta PROCEDENCIA.md');
});

test('una skill externa sin licencia', () => {
    esperaFallo(soloEn(EXTERNA.id, (id, { real }) => rmSync(path.join(real, 'LICENSE'))),
        'sin licencia');
});

test('la licencia vale también en el frontmatter', () => {
    const r = revisar(soloEn(EXTERNA.id, (id, { real }) => {
        rmSync(path.join(real, 'LICENSE'));
        writeFileSync(path.join(real, 'SKILL.md'), skillMd(id, true));
    }));
    assert.equal(r.code, 0, r.salida);
});

test('el puente que no es un enlace simbólico', soloConEnlaces, () => {
    esperaFallo(soloEn(SKILLS[0].id, (id, { puente }) => {
        rmSync(puente);
        mkdirSync(puente);
    }), 'no es un enlace simbólico');
});

test('el puente roto', soloConEnlaces, () => {
    esperaFallo(soloEn(SKILLS[0].id, (id, { puente }) => {
        rmSync(puente);
        symlinkSync('../../.agents/skills/no-existe', puente);
    }), 'enlace roto');
});

test('el puente que apunta a otra skill', soloConEnlaces, () => {
    const otra = SKILLS.find((s) => s.id !== SKILLS[0].id).id;
    esperaFallo(soloEn(SKILLS[0].id, (id, { puente }) => {
        rmSync(puente);
        symlinkSync('../../.agents/skills/' + otra, puente);
    }), 'debería apuntar a');
});
