# AGENTS.md · «Desarrollo con IA»

Guía para cualquier agente (o persona) que trabaje en este repositorio. Léela
antes de tocar nada.

## Cómo trabajar aquí (lo primero)

**Este repositorio no se toca por iniciativa propia.** Antes de nada:

- **Confirma antes de actuar.** Si el enunciado admite más de una lectura, o
  falta un detalle (un texto, un orden, un enlace, un nombre), **pregunta**. No
  elijas por tu cuenta ni rellenes huecos con suposiciones.
- **Propón y espera.** Para cualquier cambio que no sea trivial, di primero qué
  vas a hacer y por qué, y espera el visto bueno.
- **No hagas `git commit`** —ni `amend`, ni `push`— si no te lo piden
  explícitamente **en ese momento**. Un commit anterior no autoriza el siguiente.
- **Antes de hacer push, rebasea sobre `origin/main`.** Una rama desfasada
  nace con `mergeable_state: behind` y GitHub no la deja mergear aunque la CI
  esté en verde. El orden es: `git pull` (para tener `main` al día), `git rebase
  origin/main` y solo entonces el push. Con la política estricta del ruleset
  («require branches to be up to date before merging») es obligatorio.
- **Una pull request no se mergea sola.** Si te pido una PR, la abro y la dejo
  lista —con la CI en verde y la descripción puesta—, pero **el merge es del
  mantenedor**. Tampoco la mergeas por tu cuenta si la has creado tú.
- **Nada de cambios de propina.** No arregles, renombres o reformatees cosas que
  nadie te ha pedido; si ves algo raro, dilo y espera.
- **Ve poco a poco.** Es mejor un cambio pequeño confirmado que cinco cambios
  grandes por confirmar.
- Al terminar, resume qué has hecho, qué queda pendiente y **pregunta cómo
  seguir**.

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
   cambio, `npm run check` debe decir *«Ninguna slide se sale de su ventana»* —y si
   no lo dice, **sale con 1** y la CI se para.
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
npm test           # los tests de los propios scripts (tests/)
npm run shots      # capturas de las 32 slides en shots/ (para revisar)
npm run preview    # compila y sirve en http://127.0.0.1:8811
npm run pack       # además genera .gz y .br, para compartirlo comprimido
npm run fonts      # regenera los subconjuntos de IBM Plex (rara vez hace falta)

npm run skills:check  # comprueba que las skills del proyecto están en su sitio
```

`npm run shots -- --only=14` captura solo la slide 14. `--out=/tmp/deck` cambia
la carpeta de salida.

Los tres scripts que comprueban algo aceptan un destino, para poder lanzarlos
contra un árbol de prueba sin tocar el repositorio: `--root=<dir>` en
`build.mjs` y `check-skills.mjs`, y `--deck=<fichero>` en `check-layout.mjs`.
Los tests de `tests/` se apoyan en eso; a mano no hace falta.

## Mapa del repositorio

```
src/index.html            # LA FUENTE: las 32 slides, el CSS y el JS
src/assets/fonts/         # IBM Plex recortada a los caracteres del deck (7 woff2)
src/assets/icons/         # logos de la fila de proveedores (SVGL) + PROCEDENCIA.md
scripts/build.mjs         # compila y valida (red, anclas, ids duplicados)
scripts/check-layout.mjs  # mide la maquetación con Chromium
scripts/shots.mjs         # capturas de revisión
scripts/subset-fonts.sh   # regenera las fuentes desde Google Fonts
scripts/check-skills.mjs  # comprueba las skills del proyecto y sus enlaces
scripts/previews.mjs      # vistas previas de los pull requests (ramas y publicación)
docs/definicion.md        # fuente de verdad del contenido
.agents/skills/           # las 4 skills del proyecto: la copia de verdad
.claude/skills/           # enlaces simbólicos a las anteriores (para Claude Code)
skills-lock.json          # de dónde vienen las skills externas (origen y hash)
.github/workflows/pages.yml     # build en CI y publicación en GitHub Pages
.github/workflows/verify.yml    # valida cada pull request hacia main
.github/workflows/preview.yml   # publica la vista previa del deck de una PR
tests/                    # los tests de los propios scripts (npm test)
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

### La línea de tiempo de la slide 02

Las paradas son `<div class="evo-node">` dentro de `.evo-tl`, en **orden
cronológico**, y el eje es una sola línea horizontal. Los rótulos (año y nombre)
**alternan arriba y abajo** del eje (`:nth-child(odd)` / `:nth-child(even)`): eso
es lo que permite que las trece paradas quepan sin que los textos se pisen, así
que si añades o quitas una, **los rótulos siguientes cambian de lado** y hay que
volver a medir.

Dos cosas dependen de cuántas paradas haya: la rejilla es `repeat(N, 1fr)` —hoy,
`repeat(13, 1fr)`— y las fichas de la **segunda** y la **penúltima** se alinean
a los bordes, como la primera y la última, para no salirse de la ventana. Todo
está en las reglas `.evo-*` del CSS.

### Los enlaces externos se abren en una pestaña nueva

También por JS: al cargar, el script marca `target="_blank"` y
`rel="noopener noreferrer"` en todo `<a href="http…">`. **No hace falta
escribirlo en el HTML** —y no se escribe—, así que cualquier enlace que se añada
hereda el comportamiento. Los enlaces internos (glosario, mapa) siguen
abriéndose en la misma pestaña.

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

## Comprobaciones y CI

Cada regla que protege el deck tiene su comprobación, y cada comprobación tiene
su **test**. Todas ellas **salen con 1** cuando encuentran algo: no basta con
leer el informe.

- **`npm run build`** — que nada dependa de la red, que ningún `href="#…"` apunte
  al vacío y que no haya `id` duplicados.
- **`npm run check`** — que ninguna slide se salga de su ventana a 1920×1080, y
  que el cromo que genera el JS (modo charla, tooltips, mapa) se haya construido
  entero. Falla tanto con un desbordamiento como con el cromo a medias.
- **`npm run skills:check`** — que las 4 skills estén en su sitio, con su
  procedencia y su licencia, y que el puente de `.claude/skills/` apunte bien.
- **`npm test`** — que **las tres anteriores sigan detectando lo que dicen**.
  Falla si una regla ha dejado de morder.

Los tests viven en `tests/` y corren con el runner de Node (`node --test`): no
añaden ninguna dependencia. Montan un árbol de prueba en un directorio temporal,
lanzan el script de verdad y miran el **código de salida** y el mensaje, no sus
tripas. Por eso cada regla nueva necesita sus dos mitades: una plantilla que
**deba** fallar y otra válida que **no** deba quejarse. Una malla que da falsos
positivos se acaba ignorando.

Si dudas de si un test sirve para algo, **rompe la regla a propósito** y mira si
se pone rojo: un test que no puede fallar no protege nada.

### En GitHub

`.github/workflows/verify.yml` corre `build`, `check`, `test` y `skills:check` en
cada pull request hacia `main`; `pages.yml` publica después, cuando el merge ya
está en `main`. El job se llama **`validar`**: ese es el nombre del check.

Que la CI mida no basta si se puede escribir directamente en `main`. La rama
está protegida con un **ruleset de GitHub** (Settings → Rules → Rulesets), que no
vive en el repositorio y hay que configurar a mano:

- *Require a pull request before merging*, con **0 aprobaciones** (GitHub no deja
  aprobar tu propio PR; la regla ya impide el push directo).
- *Require status checks to pass* con el check `validar`, y **«Require branches
  to be up to date before merging»**: eso es lo que evita que dos PRs verdes por
  separado rompan `main` al juntarse.
- *Block force pushes* y *Restrict deletions*, sin lista de excepciones.

> El check solo se puede marcar como obligatorio **después** de que el workflow
> esté en `main`. Y una regla de encaje que imprima los fallos pero salga con 0
> es decorativa: si algún día ves un informe con `✗` y un exit code 0, eso es un
> fallo del script, no del deck.

Los workflows se validan **en local**, antes de subirlos:

```bash
brew install actionlint          # una sola vez
actionlint .github/workflows/*.yml
```

Es lo que caza los errores que GitHub solo acusa cuando el fichero ya está en
`main`: una expresión como `x in ('a', 'b')` no es válida, y el workflow no
arranca ni siquiera para dar el error. Si el `shellcheck` de `actionlint` se
queja de la glibc —típico en el linuxbrew—, se salta con `-shellcheck=`.

### Vistas previas de un pull request

Con `/preview` en un comentario de la PR —solo el owner y quien tenga acceso a
escritura— o desde la pestaña Actions, el deck de esa PR se compila. Al mergear
o descartar la PR, se borra la rama de la vista previa y se vuelve a publicar el
sitio: **la URL muere con la PR**.

| De dónde viene la PR | Qué se entrega |
|---|---|
| De **este repositorio** | El deck publicado en `https://<owner>.github.io/<repo>/previews/pr-<n>/`, para verlo en el navegador. |
| De un **fork** | El deck compilado como **artefacto**, para descargarlo y abrirlo en local. |

La vista previa es **una foto del momento**: no se refresca sola. Después de un
commit nuevo hay que volver a pedirla con `/preview`.

Hay **un solo publicador** (`pages.yml`). El preview no despliega nada: deja el
HTML en la rama `previews/pr-<n>` y pide a `pages.yml` que lo recoja. Por eso el
despliegue al mergear en `main` **no pisa** las vistas previas de las PR que
siguen abiertas, y la de la PR que se acaba de mergear desaparece sola, porque
su rama ya no está. `scripts/previews.mjs` se encarga de las ramas; el sitio lo
publica `pages.yml`.

Y dos cuidados con el código de la PR, que no es de fiar:

- **El código de la PR corre en un job con un token de solo lectura.** El token
  con permisos de escritura vive en otro job, donde no se ejecuta nada de la
  PR: el HTML viaja entre los dos como **artefacto**, que es solo datos. La PR
  se trae además con `persist-credentials: false`, para que su código no
  encuentre ninguna credencial de git.
- **El deck de un fork no se publica en el sitio.** El dominio del sitio es el
  dominio del deck, y no va a servir código ejecutable de otro repositorio. De
  ahí que su entrega sea el artefacto.

## Skills

El proyecto trabaja con **cuatro skills**, y las cuatro viajan dentro del
repositorio: quien lo clone las tiene, sin instalar nada ni tocar `npm install`
(no hay `postinstall` ni descargas: como el deck, esto funciona sin conexión).

| Skill | Para qué | Origen |
|---|---|---|
| `codely-git-conventional-commit` | Escribir los commits: formato y co-autoría (ver *Commits*). | Externa |
| `frontend-slides` | Crear o ampliar diapositivas: diseño, plantillas, animación. | Externa |
| `playwright-cli` | Automatizar un navegador para revisar el deck. | Externa |
| `mantener-deck` | El procedimiento de mantenimiento de este deck. | Propia |

### Dónde viven

- **La copia de verdad está en `.agents/skills/<id>/`.** Es el estándar, y
  OpenCode la lee sin configurar nada.
- **`.claude/skills/<id>` es un enlace simbólico** a la anterior, para que Claude
  Code (que solo mira `.claude/skills`) vea la misma copia. Una copia real, dos
  puertas; nada duplicado.
- Las skills **externas** llevan un `PROCEDENCIA.md` (origen, versión, fecha y
  licencia) y su `LICENSE`. **No se editan a mano**: se actualizan desde su
  origen, como explica ese mismo fichero.

Para comprobar que todo está en su sitio: `npm run skills:check`. Avisa de una
skill que falta, de un enlace roto o de un clon hecho sin enlaces simbólicos.

### Añadir o actualizar una skill

1. Copia la skill en `.agents/skills/<id>/`. Si viene de un clon, **sin su
   `.git/`**: un repositorio embebido deja de versionarse (git lo anota como
   *gitlink* y no guarda el contenido).
   Si está publicada en el instalador de *skills.sh*, se puede traer con él:
   `npx skills@latest add <owner>/<repo> -s <id> -y`. Deja el rastro en
   `skills-lock.json`.
   > Ojo: `--skill=<id>` **con `=` se ignora** y te instala *todas* las skills
   > del repositorio. Hay que usar `-s <id>` o `--skill <id>`.
2. Si es externa, añade su `PROCEDENCIA.md` y su licencia: el fichero `LICENSE`
   o, si el repositorio de origen no trae ninguno, un `license:` en el
   frontmatter del `SKILL.md`.
3. Enlázala: `cd .claude/skills && ln -s ../../.agents/skills/<id> <id>`
   (el instalador de *skills.sh* no crea este enlace).
4. Añádela a la lista de `scripts/check-skills.mjs` y pasa `npm run skills:check`.

### En Windows

Los enlaces simbólicos necesitan **Modo desarrollador** (o `git config
core.symlinks true` **antes** de clonar). Sin eso, `.claude/skills/` se llena de
ficheros sueltos y Claude Code no encuentra las skills; `npm run skills:check` lo
detecta y lo dice.

## Commits

Los commits siguen **Conventional Commits** y llevan **una** línea de
co-autoría. El detalle de los tipos y del resumen lo trae la skill
`codely-git-conventional-commit`; lo que **no** trae es la identidad de OpenCode,
así que se fija aquí.

Formato: `tipo[!]: resumen`, con `feat`, `fix`, `docs`, `style`, `refactor`,
`perf`, `build`, `ci`, `chore`, `revert` o `test`. Resumen en imperativo, en
minúscula y sin punto final. El cuerpo, si hace falta, explica **por qué**, no
**qué**.

Y **una sola** línea de co-autoría, la de la herramienta que ha hecho el commit:

```text
Co-Authored-By: {herramienta} - {modelo} ({esfuerzo}) <{email}>
```

| Herramienta | Email |
|---|---|
| OpenCode | `noreply@opencode.ai` |
| Claude Code | `noreply@anthropic.com` |
| Cursor | `cursoragent@cursor.com` |
| Copilot | `copilot@github.com` |
| Codex | `codex@openai.com` |

- `{modelo}` es el modelo que ha hecho el cambio. En OpenCode lo tienes en la
  sección **«# Your Model»** de tu propio prompt (`- Name: …`); ese nombre ya
  lleva la versión, así que no se repite en un campo aparte.
- `{esfuerzo}` es el esfuerzo de razonamiento. **En OpenCode no sale en tu
  prompt**, pero sí en la sesión:

  ```bash
  opencode api get "/api/session/$OPENCODE_SESSION_ID"   # mira data.model.variant
  ```

  Ese `variant` **es** el esfuerzo (`low`, `high`, `max`… los que admita el
  modelo). En una sesión real sale, por ejemplo,
  `{ id: 'deepseek-v4.1-flash-free', providerID: 'opencode', variant: 'high' }`.
- **Ninguna herramienta lo añade sola por nosotros.** OpenCode lo hacía en la V1
  —`Co-Authored-By: opencode <noreply@opencode.ai>`, y no se podía desactivar—,
  pero **en la V2 ya no lo hace**: no queda nada de eso en su código. Claude Code
  sí lo añade por su cuenta. Por eso la regla vive aquí, en el repositorio.
- Si el modelo no tiene variantes, o la herramienta no expone el esfuerzo, **no
  se inventa**: se omite el paréntesis.
- Y sigue valiendo lo de arriba: **aquí no se commitea sin permiso explícito**.

## Fuentes

Las fuentes están **recortadas a un juego de caracteres acotado** para que el
HTML pese poco: 7 ficheros `woff2` de IBM Plex (Sans Regular/Medium/SemiBold/Bold
y Mono Regular/Medium/SemiBold). El juego vive en la variable `UNICODES` de
`scripts/subset-fonts.sh`.

**Si el deck estrena un carácter que no está en ese juego**, no aparecerá: hay
que añadirlo a `UNICODES` y ejecutar `npm run fonts` (que descarga IBM Plex de
Google Fonts y regenera los subconjuntos). El script avisa de esta regla.

## Iconos

La fila de proveedores del capítulo 2 usa **logotipos de verdad**, y salen de
**SVGL** (<https://svgl.app/>, repositorio `pheralb/svgl`): se copian **sin
retocar** a `src/assets/icons/` y el build los embebe como data URI, así que el
deck sigue funcionando sin conexión.

- **Los ficheros conservan su nombre original, y ahí manda SVGL**: el sufijo
  `-dark` / `_dark` marca la variante **para fondo oscuro** (la que usamos),
  **no** que el icono sea oscuro.
- **Hermes Agent no está en SVGL**: su logo sale del favicon oficial de
  `hermes-agent.nousresearch.com` (ojo: `hermes-agent.org`, sin
  `nousresearch`, es otro sitio).
- Fichero a fichero, licencia y el paso a paso para añadir uno:
  **`src/assets/icons/PROCEDENCIA.md`**.

## Versionado

- La versión vive en el objeto `DECK` del script (`version`) y se repite, a mano,
  en el pie de la última slide (Referencias).
- **Empezamos en `v0`**; la primera publicación en GitHub Pages es la **`v0.1`**
  (2026-10-18), y el mantenedor decidirá las siguientes. Un agente **no sube la
  versión** salvo que se lo pidan de forma explícita.
- La **fecha de actualización** (`date` en `DECK`) sí sigue al contenido: se
  toca cada vez que cambie algo visible.
- Las referencias llevan su `verificado AAAA-MM-DD` aparte, que solo cambia
  cuando se revisan los enlaces.

## Antes de dar algo por hecho

1. `npm run build` sin errores (red, anclas, ids).
2. `npm run check` → *«Ninguna slide se sale de su ventana»*.
3. `npm test` → la suite en verde: es lo que comprueba que las tres
   comprobaciones anteriores siguen sirviendo para algo.
4. Si has tocado contenido, `npm run shots` y **mira las capturas** de las slides
   afectadas: el check detecta recortes, no fealdad.
5. Si has cambiado la estructura o el contenido, actualiza `docs/definicion.md`.
6. Si has tocado las skills o sus enlaces, `npm run skills:check`.
7. Revisa que las fechas que has tocado sigan siendo verdad.

## Qué no hacer

- No editar `dist/index.html` ni versionarlo.
- No añadir dependencias de red (CDN, Google Fonts, imágenes remotas).
- No usar caracteres que IBM Plex no traiga.
- No renumerar slides a mano: el cromo y el mapa salen de los `data-*`.
- No editar a mano las skills de `.agents/skills/`: las externas se actualizan
  desde su origen (ver su `PROCEDENCIA.md`).
- No dejar una comprobación que no pueda fallar: si una regla vigila algo, tiene
  que **salir con 1** y tener su test en `tests/` (ver *Comprobaciones y CI*).
- No subir la versión por iniciativa propia.
