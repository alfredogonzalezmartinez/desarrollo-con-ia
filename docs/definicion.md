# Presentación: Desarrollo con IA

> **Documento de definición (v1.1 — definición cerrada, deck construido y con harness de mantenimiento)**
> Este es el documento vivo. `definicion.md` es una copia del borrador original; la fuente de verdad es este fichero.
> Última actualización: 2026-10-18

---

## 0. Resumen

**Qué**: una presentación web sobre *desarrollo de software con agentes de IA*.

**Para quién**: desarrolladores que ya usan (o empiezan a usar) asistentes de IA y quieren pasar de "chatear con un modelo" a *trabajar con agentes* de forma eficaz y controlada.

**Cómo**: presentación HTML generada con la skill [frontend-slides](https://github.com/zarazhangrui/frontend-slides).

**Duración objetivo**: **~30 min** con las **14 slides** del flujo principal. El deck trae **32** en total: las **18 de profundización** (`▸`) se abren a demanda y dan material para una versión de 45-60 min. Se alternan con la tecla `c` (*modo charla* / *modo lectura*).

**Idea fuerza**: *El valor no está en el modelo, está en el harness y en cómo lo usas.*

**Idea fuerza 2** (nueva, sostiene la anterior): *si no puedes comprobarlo, no lo puedes delegar.*

**Criterio de orden**: de lo **más simple a lo más complejo**.

**Resultado esperado al terminar**: que la persona sepa
1. distinguir chat de agente,
2. entender el modelo mental (modelo → contexto → skills → MCP → subagentes),
3. elegir modelo y flujo según coste/calidad,
4. aplicar un flujo de trabajo repetible (explorar → planificar → codificar → confirmar),
5. **verificar** lo que el agente produce antes de darlo por bueno.

---

## 1. Cómo se construye

- **Herramienta**: skill `frontend-slides`, copiada dentro del repositorio en `.agents/skills/frontend-slides/` (viaja con el clon; ver su `PROCEDENCIA.md`).
- **Entregable**: **un solo HTML autocontenido** (decisión tomada), navegable con teclado y ratón.
- **Escenario fijo 16:9 (regla de la skill)**: cada slide se diseña a **1920×1080** y el conjunto se **escala** al viewport. En móvil no se reflowe: se mantiene el 16:9 (letterbox).
- **Estructura de ficheros** (implementada):

  ```
  AGENTS.md                 # guía de trabajo para agentes: reglas, comandos, mapa
  CLAUDE.md                 # puente para Claude Code (apunta a AGENTS.md)
  .agents/skills/           # las 4 skills del proyecto: la copia de verdad
  .claude/skills/           # enlaces simbólicos a las anteriores, para Claude Code
  skills-lock.json          # de dónde vienen las skills externas (origen y hash)
  src/index.html            # la fuente: aquí se edita todo
  src/assets/fonts/         # IBM Plex recortada a los caracteres del deck
  scripts/build.mjs         # compila src → dist (embebe fuentes, minifica, comprueba)
  scripts/check-layout.mjs  # mide la maquetación de las 32 slides con Chromium
  scripts/check-skills.mjs  # comprueba las skills del proyecto y sus enlaces
  scripts/shots.mjs         # capturas de las 32 slides, para revisar
  scripts/subset-fonts.sh   # regenera las fuentes (rara vez hace falta)
  docs/definicion.md        # este documento
  dist/index.html           # generado por el build; no se versiona
  shots/                    # capturas de revisión; no se versiona
  ```

  El deck final sigue siendo **un solo fichero**: `dist/index.html`. Lo que hay
  separado es la *fuente*. Al ser autocontenido, los diagramas son **CSS y SVG
  inline** y las fuentes van embebidas como *data URI*.

- **Harness del proyecto** (implementado): lo que hace falta para que el deck se
  pueda mantener dentro de seis meses, por una persona o por un agente.
  - **`AGENTS.md`** (raíz): las reglas de oro —ninguna slide se recorta, el deck
    funciona sin conexión, solo glifos que IBM Plex trae, la versión la marca el
    mantenedor—, los comandos, el mapa de ficheros y las trampas conocidas. Y,
    lo primero, **cómo trabajar aquí**: preguntar cuando el enunciado admita
    dudas, proponer y esperar el visto bueno antes de un cambio no trivial, no
    hacer cambios que nadie ha pedido y **no hacer `git commit`** si no lo piden
    en ese momento. OpenCode V2 lee solo `AGENTS.md`, así que **`CLAUDE.md` es un
    puente de dos líneas** que apunta a él para Claude Code: una sola copia, sin
    duplicar.
  - **Skills del proyecto** (`.agents/skills/`): las cuatro que necesita el deck
    **viajan dentro del repositorio**, así que clonarlo basta: no hay
    `postinstall` ni descargas de red, igual que el deck.
    - `codely-git-conventional-commit` (externa, MIT © Codely): el formato de los
      commits y su línea de co-autoría.
    - `frontend-slides` (externa, MIT © Zara Zhang): crear y ampliar slides.
    - `playwright-cli` (externa, Apache-2.0 © Microsoft): revisar el deck en un
      navegador de verdad.
    - `mantener-deck` (propia): el procedimiento paso a paso y las tareas típicas
      (cambiar una slide, añadir una, tocar el glosario, comprimir una slide que
      se sale, un glifo nuevo).
    Las externas llevan su **`PROCEDENCIA.md`** (origen, versión, fecha y
    licencia) para saber de dónde vienen y cómo actualizarlas, y `skills-lock.json`
    guarda el origen y el hash de las que llegan por el instalador de *skills.sh*.
    `.claude/skills/<id>` son **enlaces simbólicos** a `.agents/skills/<id>`:
    `.agents/skills` es el estándar (lo lee OpenCode sin configurar nada) y el
    puente existe para que Claude Code, que solo mira `.claude/skills`, vea la
    misma copia **sin duplicar nada**. En Windows hacen falta el Modo
    desarrollador o `core.symlinks`.
  - **Convención de commits** (en `AGENTS.md`): **Conventional Commits**
    (`tipo: resumen`, imperativo, sin punto final) y **una sola** línea de
    co-autoría, la de la herramienta que hizo el commit, con herramienta,
    modelo y **esfuerzo de razonamiento**. La skill de Codely trae los tipos y
    el formato, pero **no define OpenCode**, así que la identidad de cada
    herramienta —y la advertencia de que OpenCode V2 ya no la añade solo, a
    diferencia de la V1— se fija en el repositorio. En OpenCode el esfuerzo es el
    `variant` de la sesión: **no aparece en el prompt del agente**, pero la API lo
    devuelve (`data.model.variant`).
  - **Comprobaciones ejecutables**: `npm run build` (falla si hay dependencia de
    red, ancla rota o id duplicado), `npm run check` (encaje de las 32 slides),
    `npm run shots` (capturas para revisar), `npm run skills:check` (las skills
    y sus enlaces) y `npm test` (que las comprobaciones anteriores sigan
    detectando lo que dicen). Las reglas que se pueden comprobar con un comando
    no dependen de que alguien se acuerde.

- **Encaje a 1920×1080** (implementado): como cada slide es una ventana con
  `overflow: hidden`, lo que no cabe se recorta en silencio. `npm run check` abre
  el deck en un navegador de verdad, mide las 32 slides y avisa de las que se
  salen. Cuando una slide no cabe, se comprime **solo esa** en el bloque
  `encaje a 1920×1080` de `src/index.html` —márgenes y tamaños, sin tocar el
  diseño de las demás— y se vuelve a medir. La regla de oro: **ninguna slide se
  recorta**, y por eso este paso entra en el mantenimiento normal.

- **Pull requests y CI** (implementado): `main` está protegida con un ruleset de
  GitHub, así que los cambios entran por pull request y no se puede mergear nada
  que no haya pasado la CI. `.github/workflows/verify.yml` corre las
  comprobaciones anteriores en cada pull request hacia `main`, y `pages.yml`
  publica el deck cuando el merge ya está en `main`.

- **Material gráfico: todo recreado** (decisión tomada). Las terminales se recrean con CSS/SVG —es lo que ya hace el estilo «Consola»— y las **salidas reales se pegan como texto**, no como imagen. Motivos: pesa 0 KB, se ve nítido a cualquier tamaño, se puede anotar (resaltar la línea que importa) y no envejece mal cuando cambie la interfaz. **No hay capturas PNG.**

- **Versionado y fecha** (el deck es material vivo, no una ponencia):
  - **La versión la marca el mantenedor**, no se sube sola. Empezamos en **`v0`**; la **primera publicación** (GitHub Pages, 2026-10-18) es la **`v0.1`**. A partir de ahí el mantenedor decide cuándo sube (mayor si cambia la estructura o se publica una revisión, menor si solo cambia contenido o estilo). Un agente **propone**, no versiona por su cuenta.
  - La **fecha de actualización** sí sigue al contenido: se toca cada vez que cambie algo visible. Es lo que permite usar el deck meses después sabiendo de cuándo es.
  - Cada apartado con documentación externa lleva su **`verificado AAAA-MM-DD`** en las referencias (§5), para distinguir lo comprobado de lo heredado.
  - La última slide (Referencias) repite versión, fecha y enlace al repositorio: es el punto de entrada para actualizar.

- **Convenciones**:
  - Frases cortas. Una idea por slide. Sin párrafos largos.
  - Cada slide enlaza a documentación para "quien quiera más".
  - Diagramas e imágenes antes que texto.

---

## 2. Modelo de navegación

### 2.1 Flujo principal (columna vertebral)

Se recorre con **→ / ←** (o click). Cada capítulo avanza al siguiente, de lo simple a lo complejo.

> **Decisión de estructura (v0.9)**: la presentación tiene **dos capas**, pero **una sola secuencia lineal**.
> - **Flujo principal: 14 slides** → es lo que se proyecta en la charla. A 2 min por slide, ~30 min.
> - **Profundización: 18 slides** más, intercaladas en su sitio (no escondidas) y marcadas con `▸`.
>
> Así se resuelven las dos necesidades a la vez: **quien lee solo** recorre las 32 y lo entiende todo; **quien presenta** activa el **modo charla** y el deck salta las `▸`. Antes esto era incoherente: las ramas estaban en la secuencia lineal como si fueran obligatorias, y 33 slides no caben en 30 minutos con densidad de lectura (salían a ~55 s por slide, imposible).

| # | Capítulo | Idea que deja | Complejidad |
|---|----------|----------------|-------------|
| 1 | Portada | Qué vamos a ver | — |
| 2 | Evolución: del chat al agente | Qué cambia al pasar de responder a actuar | ● |
| 3 | Modelos | Qué es un LLM y cómo elegirlo | ●● |
| 4 | Contexto y memoria | Lo que el agente "sabe" en cada momento | ●● |
| 5 | Skills | Conocimiento reutilizable a demanda | ●●● |
| 6 | MCP | Cómo conectar el agente con el mundo | ●●● |
| 7 | Subagentes | Especializar y paralelizar (contexto propio) | ●●●● |
| 8 | Flujos de trabajo | explorar → planificar → codificar → confirmar | ●●●● |
| 9 | Orquestación | Muchos agentes a la vez (cerrar escalando) | ●●●●● |
| 10 | Cierre | Cómo empezar mañana + referencias | — |

**Por qué este orden**:
- *Modelos* va justo después de *Agentes* porque el modelo es el núcleo y el resto son capas sobre él.
- *Contexto* antes de *Skills*: las skills son, en buena parte, una optimización de cómo se carga el contexto.
- *Subagentes* al final del bloque técnico porque implican contexto aislado, permisos y paralelismo: es el concepto más avanzado de los "bloques".
- *Flujos de trabajo* conecta todo con la práctica diaria (penúltimo) y *Orquestación* cierra escalando: "esto es el futuro del desarrollo, no un agente, sino muchos".

### 2.2 Rutas alternativas (ramas de profundización)

Desde cada capítulo se puede **profundizar**. Las ramas son bidireccionales: se entra y se vuelve al punto de partida.

| Rama | Desde | Qué profundiza |
|------|-------|----------------|
| 2.a | Agentes | Permisos y modos de trabajo (modo plan, solo lectura, auto-aprobación) |
| 2.b | Agentes | Hooks (eventos automáticos) |
| 3.a | Modelos | Benchmarks y cómo leerlos |
| 3.b | Modelos | Modelos locales |
| 3.c | Modelos | Enrutadores de modelos |
| 3.d | Modelos | API vs suscripción (coste) |
| 3.e | Modelos | Modelos de decisión: los que no escriben texto (System One, de TypeSafe AI) |
| 4.a | Contexto | Ficheros de reglas: `AGENTS.md`, `CLAUDE.md` |
| 4.b | Contexto | Ventana de contexto: `clear`, `compact`, autocompact |
| 4.c | Contexto | Memoria persistente y eficiencia de contexto |
| 5.a | Skills | Cómo crear una skill |
| 5.b | Skills | Catálogo de skills útiles |
| 6.a | MCP | MCP vs CLI |
| 6.b | MCP | Cómo crear un MCP |
| 7.a | Subagentes | Paralelismo y *worktrees* |
| 7.b | Subagentes | Cómo crear un subagente |
| 8.a | Flujos | SDD (Spec-Driven Development) |
| 8.b | Flujos | RPI (Research → Plan → Implement) |
| 8.c | Flujos | **Verificación: cómo sabes que está bien** (`PostToolUse`, revisión del diff) |
| 9.a | Orquestación | Herramientas y comparativa |

> **Dos ramas salen del cajón y van al flujo principal** (4.a Ficheros de reglas y 8.c Verificación): son los dos temas más accionables de toda la charla. El resto de ramas siguen siendo opcionales.

### 2.3 Reglas de navegación

- **Avanzar / retroceder**: `→` `espacio` `PageDown` avanzan; `←` `PageUp` retroceden. También hay botones y puntos.
- **Modo charla / modo lectura**: la tecla `c` (o un botón en la barra) alterna entre los dos.
  - **Modo lectura** (por defecto): las 32 slides. Es lo que recibe quien abre el enlace.
  - **Modo charla**: se saltan las `▸` y quedan las 14 del flujo principal.
  - El modo se refleja en la URL (`#charla`) para poder abrir el deck ya configurado, sin tocar nada delante del público.
- **Rama**: las slides de profundización llevan un **badge `▸`** y un color de acento distinto, para que se reconozcan de un vistazo aunque se estén viendo todas.
- **Progreso**: el contador es consciente del modo — "12 / 14" en charla, "23 / 32" en lectura. Así el presentador no pierde la cuenta al saltar ramas.
- **Mapa**: la tecla `m` abre un índice con las dos capas (principal y profundización) y permite saltar.
- **Volver**: `Esc` devuelve al flujo principal desde cualquier rama (útil si la profundización se alarga).
- **Consistencia**: el modo charla **solo oculta, nunca reordena**; el orden de las slides es idéntico en los dos modos.

### 2.4 Estados visuales de un término/enlace

| Elemento | Apariencia | Acción |
|----------|-----------|--------|
| Navegación (siguiente, volver, mapa, modo) | Botón sólido | Click navega |
| Slide de profundización | Badge `▸` + acento distinto | `Esc` vuelve al flujo principal, `→` sigue el orden |
| Término de glosario | Subrayado punteado + superíndice | Hover/focus = tooltip con definición corta |
| Enlace a glosario | Superíndice `①` | Click navega al término en el glosario |
| Referencia externa | Icono ↗ | Click abre doc en pestaña nueva |

---

## 3. Glosario y anotaciones

**Decisión tomada**: tooltip al *hover* + pestaña de glosario. El *click* se reserva para navegar.

### 3.1 Mecánica propuesta

1. Los términos del glosario se definen una sola vez en un **objeto JS inline** dentro del propio HTML (fuente única; el deck es autocontenido).
2. En el texto, un término se marca con:

   ```html
   <span class="term" data-term="harness">harness</span><a class="term-ref" href="#glosario-harness">①</a>
   ```

3. **Hover / focus** sobre `.term` (o sobre el `①`) muestra un tooltip con la definición breve.
4. **Click** sobre `①` navega al término en la sección Glosario (navegación explícita y predecible).
5. El término en el glosario muestra su definición larga, variantes y referencias.

### 3.2 Accesibilidad

- El tooltip debe abrirse también con **focus por teclado** (no solo hover).
- `aria-describedby` para lectores de pantalla; el tooltip nunca es la única vía (el glosario siempre existe).
- En táctil: el "tap" sobre el término no navega; el `①` navega y un toque sobre el término muestra la definición (a validar).

### 3.3 Términos y definiciones breves

**Revisión de v0.7**: la lista queda en **33 términos**, agrupados por bloque para que el glosario se pueda escanear igual que la presentación. Hay **seis nuevos**, marcados **(nuevo)**: salen de los ejemplos concretos de §5 (herramienta, sesión, frontmatter, modo auto, ADE) o del capítulo de coste (caché de prompt). Se han descartado tres por genéricos o poco útiles en un deck de agentes: *temperatura* (hoy el control real es el *reasoning effort*), *benchmark* y *alucinación*. Se mantiene **CLI** como contraste con MCP.

> **Añadido el 2026-10-18**: **modelo de decisión** (`#glosario-modelo-decision`), en el bloque *Modelos* y justo detrás de *modelo local*, para poder hablar del tipo de modelo que estrena la rama 3.e. La lista queda en **34 términos**; el número de cada uno se recoloca solo, porque sale del orden en el `div.gloss`.

Las definiciones de la columna *breve* son las que aparecen en el **tooltip** y no deben pasar de ~25 palabras. La **larga** (glosario, con ejemplo y referencias) se redacta al generar el deck; aquí se deja apuntada.

#### Fundamentos

| Término | Ancla | Definición breve (tooltip) |
|---------|-------|----------------------------|
| agente | `#glosario-agente` | Un modelo más un bucle que le da herramientas y le deja **actuar** sobre tu código: leer, editar, ejecutar y verificar. |
| modelo / LLM | `#glosario-modelo` | Programa que predice el siguiente token. Sabe "de todo" pero **no hace nada** por sí solo. |
| harness | `#glosario-harness` | El programa que envuelve al modelo: le da herramientas, ejecuta el bucle y decide cuándo parar. |
| prompt | `#glosario-prompt` | Lo que le pides: la instrucción con la que abres el turno. |
| herramienta (tool) **(nuevo)** | `#glosario-herramienta` | Una acción que el agente puede invocar: leer un fichero, escribir, ejecutar un comando, buscar. |
| tool calling | `#glosario-tool-calling` | Capacidad del modelo de **pedir herramientas** en vez de limitarse a escribir texto. |
| sesión **(nuevo)** | `#glosario-sesion` | Una conversación con estado propio: su contexto, su modelo y sus permisos. |
| CLI | `#glosario-cli` | Interfaz de línea de comandos. Es la vía universal para que el agente haga cosas. |

#### Modelos

| Término | Ancla | Definición breve (tooltip) |
|---------|-------|----------------------------|
| modelo frontera | `#glosario-modelo-frontera` | El modelo más capaz (y caro) del momento. Para lo difícil, no para todo. |
| modelo local | `#glosario-modelo-local` | Modelo que corre en tu máquina: privacidad y coste cero a cambio de calidad y hardware. |
| modelo de decisión **(nuevo)** | `#glosario-modelo-decision` | No escribe texto: recibe preguntas con tipo y devuelve valores y probabilidades. Hoy, System One. |
| reasoning effort | `#glosario-reasoning-effort` | Cuánto "piensa" el modelo antes de responder. Subirlo mejora lo difícil y encarece todo. |
| enrutador de modelos | `#glosario-enrutador` | Una sola API delante de muchos modelos: ella decide a cuál va cada petición. |
| caché de prompt **(nuevo)** | `#glosario-cache-prompt` | Reutilizar lo que el modelo ya procesó, para pagar y esperar menos por lo mismo. |
| rate limit / cuota | `#glosario-cuota` | Límite de peticiones o tokens por ventana de tiempo. Es lo que de verdad te frena. |

#### Contexto y memoria

| Término | Ancla | Definición breve (tooltip) |
|---------|-------|----------------------------|
| contexto | `#glosario-contexto` | Todo lo que el modelo tiene delante: reglas, conversación, ficheros y resultados de herramientas. |
| ventana de contexto | `#glosario-ventana-contexto` | Cuántos tokens caben ahí. Al llenarse, la calidad baja y toca compactar. |
| token | `#glosario-token` | Unidad mínima de texto con la que trabaja el modelo (≈ 4 caracteres). Todo se mide y se cobra en tokens. |
| compactar / autocompact | `#glosario-compactar` | Resumir la conversación antigua para liberar espacio. Es **con pérdida**: se pierde detalle. |
| AGENTS.md / CLAUDE.md | `#glosario-agents-md` | Fichero de reglas que el agente lee al empezar: comandos de build/test, estilo, convenciones, avisos. |

#### Skills

| Término | Ancla | Definición breve (tooltip) |
|---------|-------|----------------------------|
| skill | `#glosario-skill` | Carpeta con un `SKILL.md` que el agente carga **a demanda** para hacer bien una tarea concreta. |
| progressive disclosure | `#glosario-progressive-disclosure` | Cargar por capas: primero solo nombre y descripción; el contenido completo, solo si hace falta. |
| frontmatter **(nuevo)** | `#glosario-frontmatter` | La cabecera YAML entre `---` de un `SKILL.md` o un agente: ahí van `name`, `description`, `model`… |

#### MCP

| Término | Ancla | Definición breve (tooltip) |
|---------|-------|----------------------------|
| MCP | `#glosario-mcp` | *Model Context Protocol*: estándar para conectar el agente a herramientas y datos externos. |

#### Subagentes

| Término | Ancla | Definición breve (tooltip) |
|---------|-------|----------------------------|
| subagente | `#glosario-subagente` | Agente con contexto, prompt, modelo y permisos **propios**, al que el principal le delega un trabajo. |
| worktree | `#glosario-worktree` | Copia de trabajo del mismo repositorio, con su carpeta y su rama. Deja que N agentes no se pisen. |

#### Flujos de trabajo

| Término | Ancla | Definición breve (tooltip) |
|---------|-------|----------------------------|
| modo plan | `#glosario-modo-plan` | El agente investiga y propone, pero **no toca** los ficheros. La forma sana de empezar. |
| permiso (allow / ask / deny) | `#glosario-permiso` | Regla que decide si una acción se permite, se pregunta o se bloquea. |
| modo auto **(nuevo)** | `#glosario-modo-auto` | El agente ejecuta sin preguntar lo que considera seguro; tú revisas después. Comodidad a cambio de control. |
| hook | `#glosario-hook` | Acción automática al ocurrir un evento (antes/después de una herramienta, al terminar), sin depender del modelo. |
| SDD | `#glosario-sdd` | *Spec-Driven Development*: la especificación es el artefacto central y el código la sirve. |
| RPI | `#glosario-rpi` | *Research → Plan → Implement*: tres fases con criterios de salida claros entre ellas. |

#### Orquestación

| Término | Ancla | Definición breve (tooltip) |
|---------|-------|----------------------------|
| orquestador | `#glosario-orquestador` | Herramienta que lanza y vigila varios agentes en paralelo. |
| ADE **(nuevo)** | `#glosario-ade` | *Agent Development Environment*: entorno que reúne worktrees, terminales y revisión para varios agentes. |

---

## 4. Estilo visual y recursos

**Estilo elegido: «Consola»** (era la variante D de las previews de exploración; las previews ya no están en el repo, el estilo está implementado en `src/index.html`).

- **Concepto**: interfaz de herramienta de desarrollo. El deck se presenta como una **ventana** con pestañas y barra de estado, donde cada capítulo es un "fichero" abierto.
- **Paleta**:
  - Fondo `#0b0e14` (casi negro azulado) con paneles `#12161f` y bordes `#232b38`.
  - Texto `#e6edf3`; secundario `#8b98a9`.
  - Acentos: azul `#79c0ff` (principal), verde `#7dd3a0`, ámbar `#ffb454`, violeta `#b392f0`.
- **Tipografía**: `IBM Plex Sans` (titulares 600/700) + `IBM Plex Mono` (etiquetas, código, datos), **recortada a los caracteres del deck y embebida** (132 KB en siete subconjuntos). Sin Google Fonts.
- **Elementos firma**: barra de pestañas con el capítulo activo, prompt con cursor parpadeante, **barra de estado** inferior (rama, slide, bloque), árbol de ficheros como diagrama de capas, y chips mono para conceptos.
- **Regla de glifos**: solo se usan caracteres que **IBM Plex trae de verdad**. Los adornos que no están en la fuente —`▸` de rama, `●` de estado, `■` de flujo, el `❯` del prompt, el círculo del superíndice— **se dibujan con CSS** (`.tri`, `.sq`, `.dotg`, `.chev`). Motivo: si se dejan como texto, caen a la fuente del sistema y en otra máquina aparecen como cuadraditos.
- **Por qué encaja**: los ejemplos del deck son de **herramientas de terminal** (OpenCode, Claude Code, Codex…); el estilo y el contenido se refuerzan.
- **Densidad**: **alta / reading-first**. La presentación debe entenderse sin ponente, pero con jerarquía fuerte para que el ponente aporte valor encima.
- **Recursos por slide**: diagramas (árboles, flujos, comparativas), **terminales recreadas** con CSS y la salida real pegada como texto, tablas de especificación, bloques de código cortos, chips y, **solo en el capítulo 2, ocho logotipos** (ver *Iconos*, abajo). Sin capturas de imagen (§1).
- **Iconos**: la fila de proveedores del capítulo 2 usa **logotipos de verdad**: los de [SVGL](https://svgl.app/) —nos quedamos con la variante *para fondo oscuro* que marca cada nombre— y el de Hermes Agent, que no está en esa biblioteca y sale del favicon oficial de `hermes-agent.nousresearch.com`. Se copian **sin retocar** a `src/assets/icons/` y el build los embebe como data URI: el deck sigue sin conexión. Procedencia, licencia y cómo añadir uno: **`src/assets/icons/PROCEDENCIA.md`**.
- **Reglas de contenido**: ≤15 palabras por titular; una idea por slide; código corto.
- **Diagramas**: construidos con CSS (rejillas, columnas y cajas anidadas). Lo único que no se dibuja con CSS son los ocho logotipos de la fila de proveedores (*Iconos*).
- **Movimiento**: revelado escalonado al entrar cada slide (~0,8 s), respetando `prefers-reduced-motion`.
- **Implementado en**: `src/index.html`. El cromo de cada slide (barra de pestañas y de estado) se genera por JS a partir de los `data-*` de la `<section>`, para que añadir una slide sea escribir solo su contenido.

---

## 5. Apartados (detalle)

> Cada apartado incluye: **Objetivo**, **Mensajes clave**, **Ejemplo**, **Visuales**, **Ramas**, **Referencias**.
> La numeración de sub-apartados de este documento (`5.x`) es interna; no coincide con la numeración de capítulos.

> **Nota de fuentes (verificado 2026-10-17)**: los ejemplos citan la documentación **V2 de OpenCode** (`opencode.ai/v2/docs/…`); en V2 lo que era *Rules* ahora es **Instructions** y el fichero sigue siendo `AGENTS.md`. OpenCode y Claude Code son interoperables en la práctica: OpenCode también lee `CLAUDE.md`, `~/.claude/skills` y `~/.agents/skills`. Es un buen mensaje para la charla: **el conocimiento no queda encerrado en una herramienta**.

### 1. Portada

- **Objetivo**: situar en 5 segundos y **explicar cómo se usa** (es la primera y a veces la única slide que alguien ve).
- **Contenido**:
  - Título: **Desarrollo con IA**
  - Subtítulo: *Del chat al agente*
  - **Versión y fecha**: `v0.1 · actualizado 2026-10-18` — sin autor y sin evento (decisión tomada: es un material para compartir y actualizar, no una ponencia concreta). La versión la marca el mantenedor; la fecha sigue al contenido.
  - Referencia al repositorio: <https://github.com/alfredogonzalezmartinez/desarrollo-con-ia>
  - **Ayuda de navegación en la propia portada** (una línea, en tono gris): `← → avanzar · c modo charla · m mapa · hover sobre un término = definición`.
  - Cifras del deck: **32 slides** y **18 de profundización**, marcadas `▸`.
- **Visuales**: título grande + *mock* de terminal con un agente trabajando (recreado, ver §4).
- **Referencias**: [frontend-slides](https://github.com/zarazhangrui/frontend-slides) (cómo se hizo esta presentación).

### 2. Evolución: del chat al agente

- **Objetivo**: fijar el modelo mental mínimo (chat vs agente) y, de paso, situarlo en el tiempo.
- **Mensajes clave**:
  - Un **agente** = un **modelo** (el "cerebro") + un **harness** (el entorno que le da herramientas, memoria y control).
  - **Chat**: respondes preguntas → obtienes texto. **Agente**: le das un objetivo → ejecuta pasos, usa herramientas y verifica.
  - El modelo no ejecuta nada: **pide** herramientas (*tool calling*); quien las ejecuta es el harness.
- **Lo que se ve en la slide** (tres bandas, de arriba abajo):
  1. **Dos columnas**, chat ↔ agente, con un titular cada una (*Responde y se para.* / *Actúa hasta terminar.*) y la explicación debajo. La del agente enlaza al glosario en `herramienta (tool)`: es la primera vez que el deck manda a alguien al glosario.
  2. **Fila de proveedores** (*Quién lo ofrece hoy*): ocho iconos —OpenAI, Copilot, Claude, Gemini, OpenCode, Hermes, DeepSeek y Qwen—. Al pasar el ratón, cada uno enseña una ficha con una frase y **los enlaces a su chat y a su agente**: casi todos los proveedores ya ofrecen los dos, y ese es justo el mensaje.
  3. **Línea de tiempo** (*Cómo hemos llegado aquí*), pegada al pie de la ventana: **trece paradas** —2017 Transformer · 2020 GPT-3 · jun 2021 Copilot · jul 2022 Midjourney y Stable Diffusion · nov 2022 ChatGPT · 2023 GPT-4 y las herramientas · 2023 LLaMA y `llama.cpp` · sep 2024 o1 · nov 2024 MCP · ene 2025 DeepSeek y Qwen · 2025 agentes · 2026 frontera · sep 2026 System One (Jev)—, cada una con su ficha (frase + contexto + *por qué importa* + enlaces). El eje es una línea horizontal y los rótulos **alternan arriba y abajo**: eso es lo que permite que las trece quepan sin que los textos se pisen.
- **Ramas**: 2.a Permisos y modos de trabajo · 2.b Hooks.
- **Referencias**: las de la línea de tiempo van agrupadas en la slide de Referencias (§7); los iconos y su procedencia, en `src/assets/icons/PROCEDENCIA.md`.

#### 5.2.1 Las fichas al pasar el ratón

Las **dos** filas de abajo funcionan igual, y comparten la misma ficha flotante:

- **Proveedores** y **paradas de la línea de tiempo** son elementos con foco (`tabindex="0"`): la ficha sale con el ratón **y** con el teclado.
- La ficha se abre **encima** del elemento; en el primero se alinea a la izquierda y en el último a la derecha, para que no se salga de la ventana a 1920×1080 —y en la línea de tiempo, que va con trece columnas, también la segunda y la penúltima—.
- En táctil no hay *hover*: al tocar se abre, y se cierra al tocar en cualquier otro sitio. Los enlaces de dentro de la ficha no la cierran.

> **Material que se descartó en la fusión** (decisión del mantenedor: no se sustituye): el diagrama de capas *modelo → harness → prompt → contexto → skills → MCP → subagentes* de la antigua slide 2, y la tabla comparativa chat/agente más la tabla de ejemplos (OpenCode, Claude Code, Codex, Gemini CLI, Aider, Cline, Hermes Agent, ChatGPT, Gemini, Claude) de la antigua slide 3. La distinción chat/agente se sigue contando, pero en dos columnas y una frase por lado.

#### 5.2.a Rama — Permisos y modos de trabajo

- **Mensajes clave**:
  - Cada acción sensible (editar ficheros, ejecutar comandos) tiene un permiso: **allow / ask / deny**.
  - **Modo plan**: el agente analiza y propone, pero **no modifica** nada.
  - Modo **solo lectura** para exploración/revisión.
  - Regla de oro: empieza restrictivo, relaja solo lo necesario.
- **Visuales**: captura de un diálogo de aprobación + tabla de modos.
- **Referencias**: OpenCode Permissions <https://opencode.ai/v2/docs/permissions/> · Claude Code permission modes.

#### 5.2.b Rama — Hooks

- **Mensajes clave**:
  - Un **hook** ejecuta algo automáticamente ante un evento (antes/después de una herramienta, al terminar, etc.).
  - Sirven para formatear, lint, validar o bloquear sin depender del modelo.
- **Visuales**: timeline *evento → hook → acción*.
- **Referencias**: Claude Code hooks <https://code.claude.com/docs/en/hooks>.

### 3. Modelos

- **Objetivo**: entender qué es un LLM y cómo elegirlo según coste y calidad.
- **Mensajes clave**:
  - Un **LLM** predice tokens; la calidad depende del modelo, del *harness* y del *esfuerzo*.
  - No hay "el mejor modelo": hay **el mejor modelo para esta tarea** (y al menor coste).
  - Gama típica: **frontera** (caro, difícil) · **medio** (equilibrio) · **pequeño/rápido** (barato, mecánico).
  - Ajustar el **esfuerzo** de razonamiento es tan importante como elegir el modelo.
- **Ejemplo (cambiar de modelo y de esfuerzo)**:
  - *OpenCode*: `/models` cambia el modelo de la sesión; `--model anthropic/claude-sonnet-4-5` para una ejecución suelta; las **variantes** usan `#`, p. ej. `anthropic/claude-sonnet-4-5#high`, y sirven justo para el esfuerzo de razonamiento. El `"model"` de config es el valor por defecto.
  - *Claude Code*: `/model` con alias `sonnet`, `opus`, `haiku`, `opusplan` y `sonnet[1m]` (ventana de 1M). El **esfuerzo** va de `low` a `max` y existe el modo de *thinking* extendido.
  - *En pantalla*: la misma tarea ejecutada dos veces (barato/rápido vs caro/exhaustivo) con tiempo y coste medidos; no se afirma cuál es "mejor".
- **Visuales**: eje **coste ↔ capacidad**; tabla "tarea → modelo/esfuerzo"; demo de la misma tarea con distinto esfuerzo.
- **Ramas**: 3.a Benchmarks · 3.b Modelos locales · 3.c Enrutadores · 3.d API vs suscripción · 3.e Modelos de decisión.
- **Referencias**: Artificial Analysis (coding agents) <https://artificialanalysis.ai/agents/coding-agents>

#### 5.3.a Rama — Benchmarks (y cómo leerlos)

- **Mensajes clave**: hay que leer **el benchmark que se parece a tu trabajo**. SWE-bench = arreglar issues reales; LiveCodeBench = algoritmia; Aider Polyglot = edición multi-lenguaje; Terminal-Bench = tareas de terminal.
- **Cuidado**: contaminación, auto-reporte y sobreajuste. Los benchmarks acotan, no deciden.
- **Visuales**: tabla de benchmarks (qué mide cada uno) + gráfico coste-por-tarea.
- **Referencias**:
  - <https://artificialanalysis.ai/agents/coding-agents>
  - <https://www.swebench.com/>
  - <https://livecodebench.github.io/leaderboard>
  - <https://aider.chat/docs/leaderboards/>
  - <https://www.benchleader.com/best/llm-for-coding>

> Nota editorial: los rankings cambian a diario. Mostraremos **cómo leerlos**, no cifras caducadas.

#### 5.3.b Rama — Modelos locales

- **Mensajes clave**: privacidad y coste cero a cambio de calidad y hardware. Familia Qwen, Gemma, Llama, DeepSeek…
- **Visuales**: tabla "modelo ↔ VRAM necesaria" y captura de Ollama/LM Studio.
- **Referencias**: [Ollama](https://ollama.com/) · [LM Studio](https://lmstudio.ai/) · [Hugging Face](https://huggingface.co/models)

#### 5.3.c Rama — Enrutadores de modelos

- **Mensajes clave**: un **enrutador** pone una sola API delante de muchos modelos y decide a dónde va cada petición (por coste, latencia, fallback…). Facilita usar modelos gratis o mezclar proveedores.
- **Visuales**: diagrama "tu app → router → {OpenAI, Anthropic, Google, local}".
- **Referencias**: [OpenRouter](https://openrouter.ai/) · [LiteLLM](https://docs.litellm.ai/) · [OmniRoute](https://github.com/diegosouzapw/OmniRoute) (gateway open source hacia cientos de proveedores, con estrategias de *fallback*).

#### 5.3.d Rama — API vs suscripción

- **Mensajes clave**: suscripción = cuota fija, simple, límites por ventana; API = pago por uso, escalable, impredecible. Para aprender, suscripción; para automatizar en volumen, API.
- **Visuales**: comparativa de modelos de coste + ejemplo de "optimizar la suscripción" (modelo grande para planificar, pequeño para lo mecánico).

#### 5.3.e Rama — Modelos de decisión: los que no escriben **(nueva, 2026-10-18)**

- **Idea**: casi todos los modelos del deck reciben texto y devuelven texto. Un **modelo de decisión** (System One, de TypeSafe AI) recibe un **estado** y **preguntas con tipo**, y devuelve **valores y probabilidades** que el programa usa directamente: no hay texto que leer ni que interpretar.
- **Los tres tipos de pregunta**: `noul` (sí/no, con su probabilidad) · `choice` (una opción de una lista) · `score` (una nota, según una rúbrica). Se pueden pedir varias en una sola llamada.
- **Para qué sirve**: clasificar, enrutar, puntuar o decidir dentro de un *pipeline*, sin un LLM redactando. **Para qué no**: escribir, resumir, conversar.
- **Por qué está en el deck**: cierra la **idea fuerza 2** (*si no puedes comprobarlo, no lo puedes delegar*): la respuesta es un valor que se comprueba, no una frase en la que hay que confiar. Y es el contraejemplo exacto de «el chat solo genera texto».
- **Visuales**: tabla de los tres tipos de pregunta + la llamada en crudo (JSON) + panel de dónde probarlo.
- **Fechas**: System One se presentó el **15 de septiembre de 2026**; Jev 1.13 se usa desde la consola de OpenCode (`jev-1.13`, con versión gratuita) y Jev 1.14 llegó el **14 de octubre de 2026**.
- **Referencias**: [el anuncio](https://typesafe.ai/blog/introducing-system-one-models-and-jev) · [typesafe.ai](https://typesafe.ai)

### 4. Contexto y memoria

- **Objetivo**: entender qué "ve" el agente y cómo darle memoria.
- **Mensajes clave**:
  - El **contexto** es todo lo que el modelo tiene delante: prompt de sistema, reglas, conversación, ficheros, resultados de herramientas.
  - Es **finito** y **caro**: hay que gestionarlo.
  - El contexto **se degrada** cuando se llena → `clear`, `compact`, autocompact.
  - Para persistir entre sesiones: ficheros de reglas + memoria.
- **Ejemplo (reglas y compactación)**:
  - *OpenCode*: `AGENTS.md`. Se carga el global (`~/.config/opencode/AGENTS.md`) y después todos los del proyecto, incluidos los anidados (gana el más cercano). También lee `CLAUDE.md`. La compactación es **automática** por defecto y configurable (`compaction`, `keep.tokens`); también se puede pedir a mano.
  - *Claude Code*: `CLAUDE.md`, de lo más amplio (organización) a lo más específico (`./CLAUDE.md`). `/init` lo genera, `/context` muestra el desglose y `/compact`, `/clear` y `/autocompact` controlan la ventana.
  - *En pantalla*: el medidor de contexto llenándose hasta que salta la compactación, con lo que se pierde marcado en rojo.
- **Visuales**: barra/medidor de "ventana de contexto" que se llena; diagrama de compactación.
- **Ramas**: 4.a Ficheros de reglas · 4.b Compactación · 4.c Memoria persistente y eficiencia de contexto.
- **Referencias**: OpenCode Instructions (ex-*Rules*) <https://opencode.ai/v2/docs/instructions/> · Claude Code memory <https://code.claude.com/docs/en/memory> · AGENTS.md <https://agents.md/>

#### 5.4.a Rama — Ficheros de reglas (`AGENTS.md`, `CLAUDE.md`)

- **Mensajes clave**: es el "README para agentes": comandos de build/test, estilo, convenciones, avisos. Se lee al inicio y condiciona todo.
- **Visuales**: ejemplo de `AGENTS.md` anotado; monorepo con ficheros anidados (gana el más cercano).

#### 5.4.b Rama — Ventana de contexto: `clear`, `compact`, autocompact

- **Mensajes clave**: `clear` reinicia; `compact` resume la conversación; autocompact lo hace solo al acercarse al límite. Compactar **pierde detalle**.
- **Visuales**: gráfico de uso de contexto antes/después de compactar.

#### 5.4.c Rama — Memoria persistente y eficiencia de contexto

| Herramienta | Idea | Enlace |
|-------------|------|--------|
| **context-mode** | Servidor MCP que mantiene los datos crudos fuera de la ventana de contexto (sandbox + índice SQLite/FTS5); fomenta "que el modelo programe el análisis" en vez de leer 50 ficheros | <https://github.com/mksglu/context-mode> |
| **engram** | Memoria persistente entre sesiones: binario Go, SQLite + FTS5, servidor MCP, HTTP API, CLI y TUI | <https://github.com/Gentleman-Programming/engram> |
| **rtk** | Proxy CLI que recorta el gasto de tokens en los comandos habituales (dice 60-90%): un binario Rust, sin dependencias | <https://github.com/rtk-ai/rtk> |

> **Verificado 2026-10-17**: los tres existen y están vivos. Orden de magnitud de estrellas: `context-mode` ~30k, `rtk` ~84k, `engram` ~7k. Ojo con `rtk` y `OmniRoute` (§5.3.c): sus README usan marketing muy agresivo ("1,62B tokens gratis/mes", "358 proveedores"). Como alternativas para nombrar están bien; no conviene apoyar afirmaciones de la charla en sus cifras.

### 5. Skills

- **Objetivo**: entender cómo empaquetar conocimiento y capacidades reutilizables.
- **Mensajes clave**:
  - Una **skill** = una carpeta con un `SKILL.md` (+ scripts/referencias/assets) que el agente carga **a demanda**.
  - Beneficios: reutilización, consistencia, *progressive disclosure* (carga solo lo necesario) y no inflar el contexto.
  - Hay un formato/estándar abierto (**Agent Skills**).
- **Ejemplo (la misma skill en las dos herramientas)**:
  - *OpenCode*: `.opencode/skills/<id>/SKILL.md` (proyecto) o `~/.config/opencode/skills` (global). Además lee `~/.claude/skills` y `~/.agents/skills`, así que una skill escrita para Claude Code sirve tal cual. El agente "anuncia" la skill y carga sus instrucciones con la herramienta `skill` solo cuando hace falta.
  - *Claude Code*: `~/.claude/skills/<name>/SKILL.md` o `.claude/skills/` (se versiona con el repo). El `description` decide cuándo se usa; `/summarize-changes` la invoca a mano. Con `disable-model-invocation: true` solo la invocas tú, y con `context: fork` corre en un subagente.
  - *En pantalla*: el mismo `SKILL.md` mínimo, abierto y funcionando en las dos herramientas (prueba visible de portabilidad).
- **Visuales**: anatomía de una skill (árbol de ficheros) + diagrama de *progressive disclosure* (metadata → instrucciones → recursos).
- **Ramas**: 5.a Cómo crear skills · 5.b Catálogo de skills.
- **Referencias**:
  - Especificación: <https://agentskills.io/specification>
  - Vídeo de referencia: <https://youtu.be/oZTXrgHRi-k>

#### 5.5.a Rama — Cómo crear una skill

- **Mensajes clave**: `name` + `description` (cuándo usarla) son la parte crítica; el cuerpo `< ~5000 tokens`; detalles en ficheros aparte.
- **Visuales**: `SKILL.md` mínimo anotado.
- **Referencias**: [agentskills.io/specification](https://agentskills.io/specification) · [agentskills](https://github.com/agentskills/agentskills) (especificación y documentación del formato).

#### 5.5.b Rama — Catálogo de skills

| Skill | Para qué | Enlace |
|-------|----------|--------|
| **frontend-slides** | Crear presentaciones HTML (es la que genera este deck) | <https://github.com/zarazhangrui/frontend-slides> |
| **skills** (vercel-labs) | CLI para instalar y gestionar skills en distintos agentes (`npx skills`) | <https://github.com/vercel-labs/skills> |
| **playwright-cli** (Microsoft) | Maneja un navegador real desde el agente; se instala como skill (`playwright-cli install --skills`). Con esta se revisó este deck | <https://playwright.dev/agent-cli/skills> |
| **agent-harness** (CodelyTV) | Harness y skills del curso RPI | <https://github.com/CodelyTV/agent-harness> |
| **security-audit-skill** (Cloudflare) | Auditoría de seguridad en varias fases, con hallazgos verificables | <https://github.com/cloudflare/security-audit-skill> |
| **archify** | Convierte una idea, un plan o un código en un diagrama interactivo | <https://github.com/tt-a1i/archify> |
| **anydoc** | Convierte Word, PowerPoint, Excel, PDF… a Markdown limpio (Rust; herramienta dentro de una skill, no una skill) | <https://github.com/firecrawl/anydoc> |

> **Verificado 2026-10-17**: siete repos existen y están vivos. `archify` es un caso redondo para la charla: es una skill que **genera los diagramas** — justo lo que hace falta en este deck.

### 6. MCP

- **Objetivo**: entender cómo se conecta el agente con herramientas y datos externos.
- **Mensajes clave**:
  - **MCP** (*Model Context Protocol*) es un protocolo estándar para exponer herramientas/datos a un agente.
  - Ventaja: escribes la integración una vez y vale para muchos agentes.
  - Alternativa/complemento: **CLI** (el agente ejecuta comandos).
- **Ejemplo (dar de alta un servidor MCP)**:
  - *OpenCode*: `opencode mcp add <name> --global --url <url>` y `opencode mcp list`. La config vive en `mcp.servers`; los remotos usan OAuth por defecto y desde `/mcps` se completa el login.
  - *Claude Code*: `claude mcp add --transport http <name> <url>`, con `--scope` local / project / user. En un repo, el `.mcp.json` versionado hace que todo el equipo lo tenga. `/mcp` gestiona los servidores de la sesión.
  - *En pantalla*: el mismo servidor (p. ej. GitHub) dado de alta en las dos herramientas, y una llamada real cuya evidencia es la misma en ambas.
- **Visuales**: diagrama agente ↔ servidor MCP ↔ servicio (GitHub, BD, navegador…).
- **Ramas**: 6.a MCP vs CLI · 6.b Cómo crear un MCP.
- **Referencias**: <https://modelcontextprotocol.io/> · OpenCode MCP servers <https://opencode.ai/v2/docs/mcp-servers/>

#### 5.6.a Rama — MCP vs CLI

- **Mensajes clave**: MCP = integración estructurada y portable, pero consume contexto (descripciones de herramientas); CLI = universal, barato y transparente, pero sin contrato. Elegir según el caso.
- **Visuales**: tabla comparativa (portabilidad, contexto, seguridad, esfuerzo).

#### 5.6.b Rama — Cómo crear un MCP

- **Mensajes clave**: servidor con herramientas tipadas; *transport* stdio/HTTP; se registra en el cliente.
- **Visuales**: esqueleto mínimo de servidor MCP.
- **Referencias**: <https://modelcontextprotocol.io/>

### 7. Subagentes

- **Objetivo**: entender cómo especializar y paralelizar trabajo (concepto avanzado).
- **Mensajes clave**:
  - Un **subagente** es un agente con su propio **contexto**, **prompt**, **modelo** y **permisos**.
  - Sirve para: no contaminar el contexto principal, tener especialistas (revisor, explorador, testeador) y trabajar **en paralelo**.
  - El agente principal decide cuándo delegar según la *descripción* del subagente.
- **Ejemplo (el mismo revisor, definido en las dos)**:
  - *OpenCode*: `.opencode/agents/reviewer.md` (proyecto) o `~/.config/opencode/agents/<name>.md` (global). Frontmatter: `description`, `mode: subagent` (también `primary` y `disabled`), `model`, `temperature`. Corre en una sesión hija con contexto nuevo, en primer o segundo plano.
  - *Claude Code*: `.claude/agents/code-reviewer.md` (se versiona con el repo) o `~/.claude/agents/`. Frontmatter: `name`, `description`, `tools: Read, Glob, Grep`, `model: sonnet`; admite `permissionMode`, `mcpServers` e `isolation: worktree`.
  - *En pantalla*: los dos ficheros de subagente lado a lado — casi idénticos — y el ahorro de contexto que supone la delegación.
- **Visuales**: diagrama "agente principal → varios subagentes" con contextos separados; ejemplo de paralelismo.
- **Ramas**: 7.a Paralelismo y worktrees · 7.b Cómo crear un subagente.
- **Referencias**:
  - Claude Code — subagents: <https://code.claude.com/docs/en/sub-agents>
  - OpenCode — agents: <https://opencode.ai/v2/docs/agents/>

#### 5.7.a Rama — Paralelismo y *worktrees*

- **Mensajes clave**: dos agentes en la misma carpeta se pisan → cada uno en su **git worktree** (mismo repo, carpeta y rama propias).
- **Visuales**: diagrama de un repo con N worktrees.
- **Referencias**: documentación de worktrees de tu agente; ver también §9 (orquestación).

#### 5.7.b Rama — Cómo crear un subagente

- **Mensajes clave**: es un fichero Markdown con *frontmatter* (`description`, `mode: subagent`, `model`, `temperature`) + el *prompt*.
- **Visuales**: ejemplo mínimo de `~/.config/opencode/agents/review.md` y `.claude/agents/code-reviewer.md`.
- **Referencias**: OpenCode agents · Claude Code subagents (arriba).

### 8. Flujos de trabajo con IA

- **Objetivo**: dar un proceso repetible, uniendo todo lo anterior con la práctica diaria.
- **Mensajes clave**:
  - Flujo base: **explorar → planificar → codificar → confirmar**.
  - Explorar: entender antes de tocar (agente en solo lectura).
  - Planificar: acordar el plan antes de escribir código (**modo plan**).
  - Codificar: cambios pequeños, revisables.
  - Confirmar: tests, diffs, revisión (idealmente con otro agente/modelo).
  - Métodos formalizados: **SDD** y **RPI**.
- **Ejemplo (planificar antes de tocar)**:
  - *OpenCode*: se cambia al agente incorporado **plan** con `/agents`; explora y planifica sin editar los ficheros del proyecto, y los comandos de shell siguen sujetos a permisos.
  - *Claude Code*: **plan mode** — se cambia de modo con `Shift+Tab`; en plan mode el agente investiga (con el subagente *Plan*) y propone, sin editar. `/rewind` revierte. `acceptEdits` auto-aprueba ediciones.
  - *En pantalla*: la misma tarea en las dos, en cuatro tiempos (explorar → plan → codificar → confirmar), con las puertas humanas marcadas.
- **Visuales**: diagrama de flujo con bucle de confirmación; "checkpoints" humanos.
- **Ramas**: 8.a SDD · 8.b RPI · 8.c Verificación (**en el flujo principal**).
- **Referencias**: [CodelyTV/rpi-course](https://github.com/CodelyTV/rpi-course)

#### 5.8.a Rama — SDD (Spec-Driven Development)

- **Mensajes clave**: la **especificación** es el artefacto central; el código la sirve. Ciclo: *constitution → specify → plan → tasks → implement → converge*.
- **Visuales**: cadena de artefactos (spec → plan → tasks → código → verificación).
- **Referencias**: [github/spec-kit](https://github.com/github/spec-kit/) · <https://github.github.com/spec-kit/>

#### 5.8.b Rama — RPI (Research → Plan → Implement)

- **Mensajes clave**: tres fases con criterios de salida claros; reduce la distancia entre lo esperado y lo generado.
- **Visuales**: diagrama RPI + puertas de calidad.
- **Referencias**: [CodelyTV/rpi-course](https://github.com/CodelyTV/rpi-course) · [patrob/rpi-strategy](https://github.com/patrob/rpi-strategy)

#### 5.8.c Rama — Verificación: cómo sabes que está bien (**nueva**, en el flujo principal)

- **Por qué existe**: es **la idea fuerza de la charla**. El deck repite que el valor está en el harness, pero hasta ahora "confirmar" era media línea del flujo. Sin una slide propia, el mensaje se queda sin sustento.
- **Mensajes clave**:
  - El agente **no sabe** si su cambio está bien. Solo sabe si el comando no falló.
  - La verificación es **tuya** y debe ser **ejecutable**: tests, linter, tipos, build, diff revisado.
  - Regla sana: **si no puedes comprobarlo, no lo puedes delegar** (y menos automatizar).
  - Un buen `AGENTS.md` incluye el comando exacto de test/build justo por esto.
  - Verificación cruzada: **otro modelo o subagente** revisa el diff (el que escribe no es el mejor revisor de lo suyo).
- **Ejemplo (el mismo cambio, verificado)**:
  - *OpenCode*: pedir al agente que ejecute el comando de test y pegue la salida; el subagente `reviewer` en `mode: subagent` revisa el diff con contexto aparte.
  - *Claude Code*: hooks en `settings.json` para lanzar tests tras cada edición (`PostToolUse`); `/rewind` para volver atrás si el resultado no convence.
  - *En pantalla*: la misma función antes/después, con el test en rojo → verde, y el diff al lado. El mensaje: **verde no significa correcto**.
- **Visuales**: el bucle **cambiar → comprobar → decidir**, con la decisión siempre en el humano; semáforo de "no verificado / verificado".
- **Referencias**: [Claude Code hooks](https://code.claude.com/docs/en/hooks) · §4 Contexto (`AGENTS.md`) · §7 Subagentes (revisor).

### 9. Orquestación de agentes / entornos de desarrollo con agentes

- **Objetivo**: cerrar la charla escalando la mirada: varios agentes, en paralelo, bajo control.
- **Mensajes clave**:
  - Se pasa de "un agente en una terminal" a **un entorno con muchos agentes** (cada uno en su worktree).
  - El problema ya no es la capacidad del modelo, sino la **coordinación** y la **revisión**.
- **Ejemplo (tres agentes a la vez)**:
  - *OpenCode*: los subagentes corren en sesiones hijas (primer o segundo plano) con contexto propio; varias sesiones en paralelo, cada una en su worktree.
  - *Claude Code*: `claude --worktree <nombre>` levanta cada sesión en su propio *git worktree* con su rama (mismo repo, carpeta aparte); `--resume` la retoma y los subagentes pueden fijar `isolation: worktree` para no pisarse.
  - *En pantalla*: N worktrees + N sesiones, y el recordatorio de que el cuello de botella pasa a ser **coordinar y revisar**, no generar.
- **Visuales**: captura de un orquestador con varios agentes en paralelo; diagrama worktrees + revisión.
- **Ramas**: 9.a Herramientas y comparativa.
- **Referencias**: [Superset](https://superset.sh/) · [Emdash](https://emdash.com/) · [Herdr](https://herdr.dev/) · [Orca](https://www.onorca.dev/)

#### 5.9.a Rama — Herramientas y comparativa

| Herramienta | Idea | Plataforma | Enlace |
|-------------|------|------------|--------|
| **Superset** | IDE/terminal para lanzar 10+ agentes en paralelo, un worktree por tarea, con revisión de diffs. Open source (Apache 2.0) | Mac/Win/Linux | <https://superset.sh/> · <https://github.com/superset-sh/superset> |
| **Vibe Kanban** | Tablero kanban para agentes: cada tarjeta es una tarea, cada agente su worktree. Open source | Multi | <https://github.com/BloopAI/vibe-kanban> |
| **Emdash** | ADE de escritorio, open source (YC W26): worktree por tarea, diffs, PRs e issues desde la app | Mac/Win/Linux | <https://emdash.com/> · <https://github.com/generalaction/emdash> |
| **Claude Squad** | TUI sobre tmux con un worktree por agente. Soporta Claude Code, Codex, **OpenCode** y Amp | Mac/Linux | <https://github.com/smtg-ai/claude-squad> |
| **Orca** | ADE con worktrees, terminal, navegador y CLI | Mac/Win/Linux | <https://www.onorca.dev/> |
| **Conductor** | Agentes en paralelo con worktree y revisión de diffs. Nació en macOS y ya ofrece agentes en la nube | macOS / nube | <https://conductor.build/> |
| **Sculptor** (Imbue) | UI para agentes en paralelo, cada uno en un contenedor seguro, para probar y fusionar sin conflictos | macOS/Linux | <https://imbue.com/sculptor/> |
| **Nimbalyst** | Wiki + espacio de trabajo para agentes (Claude Code y Codex) | Desktop | <https://nimbalyst.com/> |
| **Herdr** | Runtime de agentes que siguen corriendo; multi-máquina | Mac/Win/Linux | <https://herdr.dev/> |

> **Verificado 2026-10-17** (los nueve enlaces responden). Estrellas como señal de tracción: `Vibe Kanban` ~28k, `Superset` ~15k, `Claude Squad` ~8,6k, `Emdash` ~6k; el resto son productos de empresa sin repo abierto. Dato útil para la charla: **Superset, Emdash y Claude Squad soportan OpenCode explícitamente**, así que encajan con los ejemplos del deck mejor que las herramientas cerradas.
> Ojo con el *marketing*: casi todos se anuncian como "el que multiplica tu productividad". Ninguna resuelve el problema real, que es **revisar**; eso es lo que dice la slide.
>
> **Decisión para la slide 32 (▸ Herramientas)**: la tabla de nueve **no se muestra entera**. La slide lleva una **matriz 2×2** (código abierto ↔ producto de empresa × local ↔ nube) con **cuatro nombres como máximo** — los que soportan OpenCode explícitamente (Superset, Emdash, Claude Squad) y **una** herramienta de empresa (Sculptor, por el contenedor). El resto queda en esta tabla del documento y en §7: el ponente los nombra solo si preguntan.

### 10. Cierre

- **Mensajes clave**: empieza pequeño (1 agente + reglas + modo plan), mide, y añade capas (skills, MCP, subagentes, orquestación) solo cuando aporten.
- **Mini checklist de acción** (con el comando real de cada paso):
  1. Crea las reglas: `AGENTS.md` (OpenCode) o `/init` → `CLAUDE.md` (Claude Code).
  2. Trabaja en **modo plan** por defecto: agente `plan` en OpenCode (`/agents`) o `Shift+Tab` hasta plan mode en Claude Code.
  3. Añade **una** skill útil: `.opencode/skills/<id>/SKILL.md` o `~/.claude/skills/<nombre>/SKILL.md`.
  4. Prueba **un** subagente revisor: `.opencode/agents/reviewer.md` (`mode: subagent`) o `.claude/agents/code-reviewer.md`.
  5. Conecta **un** MCP: `opencode mcp add …` o `claude mcp add --transport http …`.
  6. Cuando quieras paralelizar: una sesión por **worktree** (`claude --worktree <nombre>`).
- **Referencias**: sección completa de bibliografía (abajo).

---

## 6. Secuencia de slides (v1.0 — construida)

**32 slides: 14 de flujo principal (■) + 18 de profundización (▸).** El orden es lineal e idéntico en los dos modos; el modo charla solo oculta las `▸`.

> **Cambio de esta revisión (2026-10-18)**: las antiguas slides **2** (*¿Qué es un agente?*) y **3** (*Chat vs agente*) se han fundido en una sola, **2 · Evolución: del chat al agente** — dos columnas (chat ↔ agente), la fila de proveedores y la línea de tiempo. El deck pasa de 32 a 31 slides y el flujo principal de 15 a 14; los números de estas listas ya son los nuevos.
>
> **Y en la misma fecha, después**: la **línea de tiempo** de la slide 2 pasa de 7 a **13 paradas** —imagen (2022), herramientas y modelo local (2023), razonamiento y MCP (2024) y System One (2026)—, y se añade la rama **3.e · Modelos de decisión**. El deck vuelve a **32 slides** (14 + 18) y el glosario pasa a **34 términos**.

### Flujo principal — 14 slides (modo charla, ~30 min)

```
 1 ■ Portada
 2 ■ Evolución: del chat al agente  chat ↔ agente, quién lo ofrece y la línea de tiempo
 3 ■ Modelos                       qué es un LLM y la gama (frontera → local)
 4 ■ Contexto                      qué ve el agente en cada momento
 5 ■ Reglas: AGENTS.md / CLAUDE.md  ▸ era la rama 4.a — el tema más accionable
 6 ■ Skills                        qué son y por qué funcionan
 7 ■ MCP                           qué es y para qué sirve
 8 ■ Subagentes                    delegar y aislar contexto
 9 ■ Flujos                        explorar → planificar → codificar → confirmar
10 ■ Verificación                  cómo sabes que está bien  ** NUEVA **
11 ■ Orquestación                  varios agentes a la vez
12 ■ Cierre + checklist            6 pasos con el comando real
13 ■ Glosario                      34 términos
14 ■ Referencias                   bibliografía completa
```

### Profundización — 18 slides (modo lectura, en su sitio)

```
15 ▸ Permisos y modos de trabajo       (cap. 2 · agentes)
16 ▸ Hooks                              (cap. 2)
17 ▸ Benchmarks y cómo leerlos          (cap. 3 · modelos)
18 ▸ Modelos locales                    (cap. 3)
19 ▸ Enrutadores de modelos             (cap. 3)
20 ▸ API vs suscripción                 (cap. 3)
21 ▸ Modelos de decisión                (cap. 3 · modelos)
22 ▸ Ventana y compactación             (cap. 4 · contexto)
23 ▸ Memoria y eficiencia de contexto   (cap. 4)
24 ▸ Crear una skill                    (cap. 5 · skills)
25 ▸ Catálogo de skills                 (cap. 5)
26 ▸ MCP vs CLI                          (cap. 6 · MCP)
27 ▸ Crear un MCP                        (cap. 6)
28 ▸ Paralelismo y worktrees             (cap. 7 · subagentes)
29 ▸ Crear un subagente                  (cap. 7)
30 ▸ SDD                                 (cap. 8 · flujos)
31 ▸ RPI                                 (cap. 8)
32 ▸ Herramientas y comparativa          (bloque 8 · orquestación)
```

### Qué ha cambiado respecto a la v0.8 (33 slides)

| Cambio | Por qué |
|--------|---------|
| **2 + 5 → una sola** (el diagrama *era* la definición) | Dos slides decían lo mismo; el diagrama gana y la definición se lee encima |
| **3 + 4 → una sola** (chat vs agente, con ejemplos dentro) | La tabla y los ejemplos se explican juntos |
| **4.a (reglas) al flujo principal** | Es el paso 1 del checklist final; no puede ser una rama opcional |
| **8.c (verificación) creada y al flujo principal** | Era el agujero del deck: "confirmar" eran cinco palabras en el flujo. Es la idea fuerza |
| **Ramas marcadas `▸` y modo charla** | Antes 18 de 33 slides eran "opcionales" pero estaban en la secuencia: imposible saltarlas de verdad |
| **Slide de herramientas: matriz 2×2 con 4 nombres** | Nueve herramientas en una slide no se leen (§5.9.a) |

> **Nota de tiempos**: 14 slides × 2 min = 28-30 min, que es el objetivo. Si se abren ramas, cada una suma ~45-60 s; con 18 disponibles, hay material para 45-60 min. Es deliberado: **el deck aguanta una charla corta y una larga**.
>
> **Nota de numeración**: los números de slide cambiaron respecto a la v0.8 (33 slides). La tabla de arriba se refiere a aquella versión; para cualquier número actual, manda la lista de §6 (32 slides). Y ojo: el deck bajó de 33 a 31 al fundir las antiguas 2 y 3, y volvió a **32** al añadirse la rama 3.e; así que «la slide 32» hoy es una rama real (▸ Herramientas), no una referencia antigua.

---

## 7. Referencias (bibliografía)

**Herramienta de la presentación**
- frontend-slides — <https://github.com/zarazhangrui/frontend-slides>

**Historia (la línea de tiempo del bloque 1)** *(verificado 2026-10-18)*
- Transformer — <https://en.wikipedia.org/wiki/Attention_Is_All_You_Need> (2017)
- GPT-3 — <https://en.wikipedia.org/wiki/GPT-3> (2020)
- GitHub Copilot — <https://en.wikipedia.org/wiki/GitHub_Copilot> (2021)
- Midjourney — <https://en.wikipedia.org/wiki/Midjourney> (2022)
- Stable Diffusion — <https://en.wikipedia.org/wiki/Stable_Diffusion> (2022)
- ChatGPT — <https://en.wikipedia.org/wiki/ChatGPT> (2022)
- GPT-4 — <https://en.wikipedia.org/wiki/GPT-4> (2023)
- Llama (familia de modelos de Meta) — <https://en.wikipedia.org/wiki/Llama_(language_model)> (2023)
- llama.cpp — <https://en.wikipedia.org/wiki/Llama.cpp> (2023)
- o1 — <https://en.wikipedia.org/wiki/OpenAI_o1> (2024)
- Model Context Protocol (MCP) — <https://en.wikipedia.org/wiki/Model_Context_Protocol> (2024)
- DeepSeek — <https://en.wikipedia.org/wiki/DeepSeek_(AI)> (2025)
- Qwen — <https://en.wikipedia.org/wiki/Qwen> (2025)
- Claude Code — <https://en.wikipedia.org/wiki/Claude_(AI)> (2025)
- OpenAI Codex — <https://en.wikipedia.org/wiki/OpenAI_Codex> (2025)
- OpenCode — <https://en.wikipedia.org/wiki/OpenCode> (2025)
- Google Antigravity — <https://en.wikipedia.org/wiki/Google_Antigravity> (2025)
- GPT-6.1 Sol — <https://en.wikipedia.org/wiki/GPT-6.1> (2026)
- System One y Jev (TypeSafe AI) — <https://typesafe.ai/blog/introducing-system-one-models-and-jev> (2026) · <https://typesafe.ai>

**Agentes y harness**
- OpenCode V2 docs — <https://opencode.ai/v2/docs/>
- OpenCode — Instructions (`AGENTS.md`) — <https://opencode.ai/v2/docs/instructions/>
- OpenCode — Compaction — <https://opencode.ai/v2/docs/compaction/>
- OpenCode — Permissions — <https://opencode.ai/v2/docs/permissions/>
- Claude Code docs — <https://code.claude.com/docs/>
- Claude Code — Memory (`CLAUDE.md`) — <https://code.claude.com/docs/en/memory>
- Claude Code — Permission modes — <https://code.claude.com/docs/en/permission-modes>
- Claude Code — Model config (esfuerzo) — <https://code.claude.com/docs/en/model-config>
- Claude Code — Commands — <https://code.claude.com/docs/en/commands>
- Claude Code — Hooks (verificación automática) — <https://code.claude.com/docs/en/hooks>
- Claude Code — Worktrees — <https://code.claude.com/docs/en/worktrees>
- OpenCode — Skills — <https://opencode.ai/v2/docs/skills/>
- OpenCode — Agents — <https://opencode.ai/v2/docs/agents/>
- OpenCode — Models — <https://opencode.ai/v2/docs/models/>
- OpenCode — TUI (comandos `/models`, `/agents`…) — <https://opencode.ai/v2/docs/cli/tui>
- AGENTS.md — <https://agents.md/>
- Hermes Agent — <https://hermes-agent.nousresearch.com/> · <https://github.com/NousResearch/hermes-agent>
- Aider — <https://aider.chat/>

**Skills**
- Agent Skills specification — <https://agentskills.io/specification>
- playwright-cli (skill de Playwright para agentes) — <https://playwright.dev/agent-cli/skills>

**MCP**
- Model Context Protocol — <https://modelcontextprotocol.io/>

**Modelos y benchmarks**
- Artificial Analysis — <https://artificialanalysis.ai/agents/coding-agents>
- SWE-bench — <https://www.swebench.com/>
- LiveCodeBench — <https://livecodebench.github.io/leaderboard>
- Aider leaderboards — <https://aider.chat/docs/leaderboards/>
- BenchLeader — <https://www.benchleader.com/best/llm-for-coding>
- System One (Jev) — modelos de decisión de TypeSafe AI — <https://typesafe.ai> · [el anuncio](https://typesafe.ai/blog/introducing-system-one-models-and-jev)

**Routers y modelos locales**
- OpenRouter — <https://openrouter.ai/>
- LiteLLM — <https://docs.litellm.ai/>
- Ollama — <https://ollama.com/>
- LM Studio — <https://lmstudio.ai/>

**Flujos de trabajo**
- Spec Kit (SDD) — <https://github.com/github/spec-kit/>
- CodelyTV RPI — <https://github.com/CodelyTV/rpi-course>

**Orquestación**
- Superset — <https://superset.sh/>
- Emdash — <https://emdash.com/>
- Vibe Kanban — <https://github.com/BloopAI/vibe-kanban>
- Claude Squad — <https://github.com/smtg-ai/claude-squad>
- Conductor — <https://conductor.build/>
- Sculptor (Imbue) — <https://imbue.com/sculptor/>
- Nimbalyst — <https://nimbalyst.com/>
- Herdr — <https://herdr.dev/>
- Orca — <https://www.onorca.dev/>

> Verificación de enlaces: completa el **2026-10-18** — 84 enlaces (los 77 únicos del deck más los que solo están en este documento), más los **nueve que trajo la línea de tiempo ampliada** (Midjourney, Stable Diffusion, GPT-4, Llama, `llama.cpp`, o1, MCP, System One y `typesafe.ai`), comprobados el mismo día: responden todos, incluido el del repositorio (`github.com/alfredogonzalezmartinez/desarrollo-con-ia`), que entonces daba **404 porque aún no estaba publicado** y hoy ya es público. Los 403 de `chatgpt.com`, `claude.ai` y `openai.com/codex` son protección antibots, no enlaces roscos.
>
> Esta sección es también la **última slide** del deck: allí aparecen la versión, la fecha de actualización y el enlace al repositorio, para que el material se pueda retomar y actualizar sin buscar nada.

---

## 8. Preguntas abiertas

Ya cerradas en la **v1.0 de este documento**: **material gráfico** (todo recreado, salidas reales como texto), **portada** (sin autor ni evento; versión y fecha), **enlaces** (verificados 2026-10-18) y **estructura de la secuencia** (32 slides: 14 + 18).

Implementado al construir el deck: **modo charla** (`c` y `#charla`), **glosario** con tooltips y numeración automática desde la lista, **cromo generado por slide** desde los `data-*`, y **comprobación de encaje a 1920×1080** (`npm run check`): ninguna de las 32 slides se recorta.

Lo que queda:

1. **Glosario**: las 34 definiciones breves están escritas (§3.3). Queda la **definición larga** de cada término (con ejemplo y referencia).
2. **Glosario en táctil** (§3.2): validar que el tap sobre un término muestra la definición sin navegar.
3. **Verificación (8.c)**: decidir si la slide enseña un caso real de test rojo → verde del propio repositorio, o un ejemplo sintético. Con datos reales convence más, pero hay que prepararlo.
4. **Caducidad de las cifras**: los ejemplos citan versión de herramienta (OpenCode V2) y las referencias llevan `verificado 2026-10-18`. Decidir cada cuánto se revisa —propuesta: **al publicar cada versión mayor**— y qué pasa si una herramienta cambia de nombre o desaparece.
