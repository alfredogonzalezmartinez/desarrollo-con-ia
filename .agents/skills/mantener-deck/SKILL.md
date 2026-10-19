---
name: Mantener el deck «Desarrollo con IA»
description: Editar, ampliar o revisar las diapositivas del deck (src/index.html) —cambiar el texto de una slide, añadir o quitar slides, tocar el glosario, las referencias o el estilo— y dejarlo verificado con el build, la comprobación de encaje y los tests. Úsala cuando haya que trabajar en las diapositivas o en el contenido de este repositorio.
---

# Mantener el deck «Desarrollo con IA»

Procedimiento para trabajar en el deck. Las reglas del repositorio están en
**`AGENTS.md`** (léelo primero si no lo tienes ya en contexto).

## Antes de empezar

1. Lee `AGENTS.md`.
2. Si el cambio es de **contenido** (qué dice una slide, un término, un enlace),
   la fuente de verdad es `docs/definicion.md`: decide ahí, luego construye.
3. Ten a mano `npm run check` y `npm run shots`: son tus ojos. Las
   comprobaciones **salen con 1** cuando encuentran algo, así que fíjate en el
   código de salida, no solo en lo que se imprime.

## El ciclo de trabajo

Siempre el mismo, sin saltarse pasos:

```bash
npm run build      # 1. compila y valida (red, anclas, ids duplicados)
npm run check      # 2. ¿alguna slide se recorta?  ← obligatorio
npm test           # 3. los tests de los scripts: las reglas siguen mordiendo
npm run shots      # 4. capturas en shots/ para mirar el resultado
```

Y después **mira las capturas** de las slides que has tocado (`shots/14-*.png`).
El check detecta recortes; no detecta que algo se vea mal.

## Tareas típicas

### Cambiar el texto de una slide

Edita `src/index.html` (sección `<section class="slide" id="s-…">`). Respeta las
reglas de estilo: frases cortas, una idea por slide, sin párrafos largos.
No renumeres nada a mano: el cromo y el mapa salen de los `data-*`.

### Añadir una slide

1. Copia una `<section>` existente y ajusta `id`, `data-ch`, `data-file`,
   `data-kind` (`main` o `branch`), `data-chapter` y `data-title`.
2. Colócala donde le toca en la secuencia.
3. Si has decidido el cambio en `docs/definicion.md`, actualiza allí la secuencia
   de slides (§6) y la fecha de versión.
4. `npm run build && npm run check`. Si se sale, comprímela en el bloque
   `encaje a 1920×1080` (ver abajo).
5. **Aviso**: `data-kind` y el número de slides salen en la portada («32 slides ·
   17 de profundización») y se calculan solos, pero la **frase** «Ocho bloques,
   con diecisiete slides de profundización» de la portada es texto literal: si
   cambia el recuento, hay que retocarla.

### Añadir un término al glosario

Toca **tres sitios** que deben coincidir (`AGENTS.md` los detalla):

1. `#s-glosario` → `<div class="gitem" id="glosario-<clave>">`. El **orden** en
   ese bloque fija el número del superíndice.
2. El objeto `GLOSARIO` del script → clave + texto del tooltip.
3. La mención: `<span class="term" data-term="<clave>">…</span>` con
   `<a class="term-ref" href="#glosario-<clave>"></a>`.

Comprueba en la consola del navegador que no aparece
`Término sin definición en GLOSARIO`. Y si añades un término, valora si toca
también `docs/definicion.md` §3.3.

### Actualizar las referencias

`#s-referencias` (slide 15) y `docs/definicion.md` §7. Cada enlace lleva fecha de
verificación; si revisas enlaces, actualiza esa fecha en los dos sitios. Sección
de estilo: `Docs` · `docs` (nombre corto en el texto, URL como enlace).

### Una slide que se sale

`npm run check` te dice cuál y cuánto. **No toques el diseño de las demás**: al
final del `<style>` hay un bloque `encaje a 1920×1080` con ajustes por slide.
Añade o ajusta ahí las reglas de esa slide (`#s-… .mt32 { margin-top: … }`,
`#s-… .cmp td { padding: … }`, tamaños de fuente con `!important` si el markup
lleva `style` en línea…). Vuelve a medir. Si aún no cabe, recorta texto: es
preferible a que se pierda contenido por el borde.

### Ver cómo queda una pull request

Escribe `/preview` en un comentario de la PR: la CI compila el deck de esa PR y
lo publica en `https://<owner>.github.io/<repo>/previews/pr-<n>/`, donde se ve
el deck entero, tal como quedará al mergear. La URL deja de funcionar al
mergear o descartar la PR.

Es para **mirarlo en un navegador**. Para medir, sigue mandando
`npm run check`.

### Cambiar el estilo global

El CSS está entero en el `<style>` de `src/index.html`, con el vocabulario de la
estética «Consola» (variables `--panel`, `--line`, `--blue`…). Si cambias algo
global, vuelve a pasar `npm run check` por las 32 slides y revisa unas cuantas
capturas: un cambio de ritmo global suele descolocar alguna slide.

### Un carácter nuevo que sale como cuadradito

Significa que IBM Plex no lo trae o que no está en el subconjunto. Añádelo a
`UNICODES` en `scripts/subset-fonts.sh` y ejecuta `npm run fonts`. Si es un
adorno, mejor dibújalo con CSS (`.tri`, `.sq`, `.dotg`, `.chev`) y no uses el
carácter.

## Verificación final (no negociable)

- `npm run build` sin errores.
- `npm run check` → *«Ninguna slide se sale de su ventana»*.
- `npm test` en verde.
- Las comprobaciones salen con **0** si todo está bien y con **1** si algo
  falla: aunque el informe se vea tranquilo, el código de salida manda. En la
  CI es lo que para el merge.
- Capturas miradas de las slides tocadas.
- `docs/definicion.md` coherente con lo construido.
- Fechas al día: `date` en `DECK` si cambió el contenido; `verificado` solo si se
  revisaron los enlaces.
- **La versión no se sube** salvo petición expresa del mantenedor.
