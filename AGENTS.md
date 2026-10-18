# AGENTS.md · «Desarrollo con IA»

Guía para cualquier agente (o persona) que trabaje en este repositorio. Léela
antes de tocar nada.

## Qué es esto

Una presentación sobre desarrollo de software con agentes, publicada como
**un único HTML autocontenido**. No es la grabación de una charla: es **material
vivo** que se revisa y amplía con el tiempo, sin autor ni evento en la portada.

- **La fuente es `src/index.html`.** Ahí está todo: las 32 slides, el CSS y el JS.
- **`dist/index.html` es un artefacto generado.** No se edita a mano y no se
  versiona (`npm run build` lo reconstruye).
- **`docs/definicion.md` es la fuente de verdad del contenido**: qué va en cada
  slide, el glosario completo, la secuencia y las referencias. Si el deck y el
  documento se contradicen, el documento manda: primero se decide ahí, luego se
  construye.

## Reglas de oro (no negociables)

1. **Ninguna slide se recorta.** Cada slide es una ventana con `overflow: hidden`
   a 1920×1080: lo que no cabe desaparece **en silencio**. Después de cualquier
   cambio, `npm run check` debe decir *«Ninguna slide se sale de su ventana»*.
2. **El deck funciona sin conexión.** Nada de CDN, ni fuentes remotas, ni
   `url(http…)`. Las fuentes y las imágenes van embebidas. El build **falla** si
   detecta una dependencia de red, un ancla interna rota o un `id` duplicado.
3. **Solo glifos que IBM Plex trae de verdad.** Los adornos (`▸ ● ■ ❯`) se
   dibujan con CSS (`.tri`, `.sq`, `.dotg`, `.chev`), no como caracteres, para
   que no caigan a una fuente del sistema y salgan como cuadraditos. Si hace
   falta un carácter nuevo, primero hay que añadirlo al subconjunto (ver
   *Fuentes*).
4. **Frases cortas, una idea por slide.** Es una presentación, no un manual.
   El detalle largo va a `docs/definicion.md`.
5. **La versión la marca el mantenedor.** Un agente **propone**, no versiona por
   su cuenta (ver *Versionado*).
6. **No inventar cifras ni enlaces.** Todo enlace externo lleva su fecha de
   verificación y toda cifra que envejezca se marca como tal.

## Comandos

```bash
npm install                    # dependencias (html-minifier-terser, playwright)
npx playwright install chromium  # el navegador, una sola vez

npm run build      # src/index.html → dist/index.html (embebe, minifica, valida)
npm run build:dev  # igual, sin minificar: para depurar el HTML resultante
npm run check      # mide las 32 slides a 1920×1080 con Chromium
npm run shots      # capturas de las 32 slides en shots/ (para revisar)
npm run preview    # compila y sirve en http://127.0.0.1:8811
npm run pack       # además genera .gz y .br, para compartirlo comprimido
npm run fonts      # regenera los subconjuntos de IBM Plex (rara vez hace falta)
```

`npm run shots -- --only=14` captura solo la slide 14. `--out=/tmp/deck` cambia
la carpeta de salida.

## Mapa del repositorio

```
src/index.html            # LA FUENTE: las 32 slides, el CSS y el JS
src/assets/fonts/         # IBM Plex recortada a los caracteres del deck (7 woff2)
scripts/build.mjs         # compila y valida (red, anclas, ids duplicados)
scripts/check-layout.mjs  # mide la maquetación con Chromium
scripts/shots.mjs         # capturas de revisión
scripts/subset-fonts.sh   # regenera las fuentes desde Google Fonts
docs/definicion.md        # fuente de verdad del contenido
.claude/skills/mantener-deck/   # skill con el procedimiento de mantenimiento
.github/workflows/pages.yml     # build en CI y publicación en GitHub Pages
dist/                     # generado; ignorado por git
shots/                    # capturas; ignorado por git
```

## Editar el deck

### El cromo se genera solo

La barra de pestañas y la de estado de cada slide **no se escriben a mano**: se
crean por JS a partir de los `data-*` de la `<section>`.

```html
<section class="slide" id="s-ejemplo"
         data-ch="04" data-file="04-skills" data-kind="main"
         data-chapter="Skills" data-title="Ejemplo">
    <div class="win"><div class="win-body">
        …contenido…
    </div></div>
</section>
```

- `data-kind="branch"` → profundización: sale con `▸` en el mapa y se oculta en
  modo charla. `data-kind="main"` → flujo principal.
- `data-ch` numeración del capítulo, `data-file` nombre del fichero que se ve en
  la pestaña, `data-chapter` el rótulo de la barra de estado, `data-title` el
  nombre en el mapa.
- La **portada** (`data-ch="00"`) es la única que enseña versión y fecha.

### El glosario tiene tres piezas que deben cuadrar

Añadir un término toca **tres sitios**, y los tres tienen que coincidir:

1. La entrada visible en la slide del glosario: `<div class="gitem" id="glosario-<clave>">`.
   **Su orden en ese `<div class="gloss">` fija el número** que aparece en todas
   las menciones del deck; no hay que numerar nada a mano.
2. El objeto `GLOSARIO` del script: la clave `<clave>` y el texto que sale en el
   **tooltip** al pasar el ratón.
3. La mención donde se use:
   `<span class="term" data-term="<clave>">texto<a class="term-ref" href="#glosario-<clave>"></a></span>`.

Si `data-term` no existe en `GLOSARIO`, el tooltip no se genera (y la consola
avisa). No hay atajo: la definición del tooltip y la del glosario son dos
textos distintos y los dos hay que escribirlos.

### Encaje a 1920×1080

Si una slide se sale, **no se cambia el diseño de las demás**. Al final del
`<style>` de `src/index.html` hay un bloque `encaje a 1920×1080` con ajustes
**por slide** (`#s-<algo> .mt32 { … }`, tamaños de tabla, etc.). Se comprime esa
slide ahí —márgenes, tamaños o, si hace falta, quitando texto— y se vuelve a
medir. Ese bloque es el único sitio donde se toca el ritmo vertical de una
slide concreta.

## Fuentes

Las fuentes están **recortadas a un juego de caracteres acotado** para que el
HTML pese poco: 7 ficheros `woff2` de IBM Plex (Sans Regular/Medium/SemiBold/Bold
y Mono Regular/Medium/SemiBold). El juego vive en la variable `UNICODES` de
`scripts/subset-fonts.sh`.

**Si el deck estrena un carácter que no está en ese juego**, no aparecerá: hay
que añadirlo a `UNICODES` y ejecutar `npm run fonts` (que descarga IBM Plex de
Google Fonts y regenera los subconjuntos). El script avisa de esta regla.

## Versionado

- La versión vive en el objeto `DECK` del script (`version`) y se repite, a mano,
  en el pie de la última slide (Referencias).
- **Empezamos en `v0`.** El mantenedor marcará **`v1` cuando el material se
  publique**, y decidirá las siguientes. Un agente **no sube la versión** salvo
  que se lo pidan de forma explícita.
- La **fecha de actualización** (`date` en `DECK`) sí sigue al contenido: se
  toca cada vez que cambie algo visible.
- Las referencias llevan su `verificado AAAA-MM-DD` aparte, que solo cambia
  cuando se revisan los enlaces.

## Antes de dar algo por hecho

1. `npm run build` sin errores (red, anclas, ids).
2. `npm run check` → *«Ninguna slide se sale de su ventana»*.
3. Si has tocado contenido, `npm run shots` y **mira las capturas** de las slides
   afectadas: el check detecta recortes, no fealdad.
4. Si has cambiado la estructura o el contenido, actualiza `docs/definicion.md`.
5. Revisa que las fechas que has tocado sigan siendo verdad.

## Qué no hacer

- No editar `dist/index.html` ni versionarlo.
- No añadir dependencias de red (CDN, Google Fonts, imágenes remotas).
- No usar caracteres que IBM Plex no traiga.
- No renumerar slides a mano: el cromo y el mapa salen de los `data-*`.
- No subir la versión por iniciativa propia.
