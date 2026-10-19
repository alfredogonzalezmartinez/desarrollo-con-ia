# Desarrollo con IA — del chat al agente

Presentación sobre desarrollo de software con agentes: qué es un agente, cómo
elegir modelo, cómo se gestiona el contexto, reglas, skills, MCP, subagentes,
flujos de trabajo y orquestación. Los ejemplos están desarrollados con
**OpenCode** y **Claude Code**; el resto de herramientas se mencionan como
alternativas.

**Verla:** <https://alfredogonzalezmartinez.github.io/desarrollo-con-ia/>

---

## Qué hay dentro

32 slides en una única secuencia lineal:

| | | |
|---|---|---|
| **15** | flujo principal | el recorrido mínimo |
| **17** | profundización | intercaladas donde tocan, para quien quiere más |

No hay que elegir nada al leer: el deck entero se entiende de principio a fin.
Si lo vas a presentar, el **modo charla** esconde las slides de profundización y
deja una charla de unos 30 minutos.

## Cómo se navega

| Tecla | Qué hace |
|---|---|
| `←` `→` o espacio | Avanzar y retroceder |
| `c` | Modo charla (oculta la profundización) |
| `m` | Mapa del deck |
| `g` | Ir al glosario |
| `f` | Pantalla completa |
| `Esc` | Salir del mapa o del modo charla |

Los términos con línea de puntos muestran su definición al pasar el ratón o al
enfocarlos con el teclado. El superíndice que llevan al lado lleva al glosario y
resalta el término.

## Estructura del repositorio

```
AGENTS.md                 guía de trabajo para agentes: reglas, comandos, mapa
CLAUDE.md                 puente para Claude Code (apunta a AGENTS.md)
.agents/skills/           las 4 skills del proyecto: la copia de verdad
.claude/skills/           enlaces simbólicos a las anteriores, para Claude Code
skills-lock.json          de dónde vienen las skills externas (origen y hash)
src/index.html            la fuente: aquí se edita todo
src/assets/fonts/         IBM Plex recortada a los caracteres del deck
scripts/build.mjs         compila src → dist
scripts/check-layout.mjs  mide el encaje de las 32 slides con Chromium
scripts/check-skills.mjs  comprueba las skills del proyecto y sus enlaces
scripts/shots.mjs         capturas de las slides, para revisar
scripts/subset-fonts.sh   regenera las fuentes (rara vez hace falta)
tests/                    los tests de los scripts: cada regla, comprobada
.github/workflows/        CI: valida cada pull request y publica el deck
docs/definicion.md        qué lleva cada slide y por qué: el documento de definición
dist/index.html           generado por el build, no se versiona
shots/                    capturas de revisión, no se versiona
```

Si vas a trabajar en el deck (tú o un agente), empieza por **`AGENTS.md`**: ahí
están las reglas que no se pueden romper y las trampas conocidas. La skill
`mantener-deck` empaqueta el procedimiento para que un agente lo siga solo.

Las **skills** viajan dentro del repositorio, en `.agents/skills/`, con un puente
de enlaces simbólicos en `.claude/skills/` para Claude Code: clonar el repositorio
basta, no hay que instalar nada. `npm run skills:check` comprueba que las cuatro
están y que los enlaces apuntan donde deben.

## Trabajar en él

```bash
npm install
npm run build      # dist/index.html: un solo fichero, sin dependencias de red
npm run build:dev  # lo mismo pero sin minificar, para depurar
npm run check      # mide la maquetación de las 32 slides con un navegador real
npm test           # los tests de los scripts (node --test, sin dependencias)
npm run shots      # capturas de las 32 slides en shots/ (para revisar)
npm run preview    # compila y sirve en http://127.0.0.1:8811
npm run pack       # además genera .gz y .br, para compartirlo comprimido
npm run skills:check  # comprueba que las skills del proyecto están en su sitio
```

El build hace tres cosas y **falla si alguna no se cumple**:

1. Embebe las fuentes y cualquier otro asset como *data URI*.
2. Comprueba que no queda ninguna dependencia de red: el deck funciona sin conexión.
3. Comprueba que ningún enlace interno (`#…`) apunta al vacío y que no hay `id` duplicados.

El resultado ronda los **270 KB** (unos 145 KB comprimido con brotli).

### Comprobar la maquetación

El escenario es fijo (1920×1080) y cada slide es una ventana con
`overflow: hidden`: lo que no cabe **se recorta sin avisar**. `npm run check`
abre el deck en un navegador de verdad, mide cada slide y dice cuál se sale: si
alguna se sale, **sale con 1** y en la CI se para el merge.

```bash
npx playwright install chromium   # una sola vez
npm run check
```

Si una slide se sale, se comprime **solo esa** en el bloque `encaje a 1920×1080`
de `src/index.html` (márgenes y tamaños, sin tocar el diseño de las demás), y se
vuelve a medir.

### Añadir o cambiar una slide

Cada `<section class="slide">` lleva sus datos en atributos y el cromo de la
ventana (barra de pestañas y barra de estado) se genera a partir de ellos. Para
añadir una slide basta con copiar una y ajustar:

```html
<section class="slide" id="s-ejemplo"
         data-ch="04" data-file="04-skills" data-kind="main"
         data-chapter="Skills" data-title="Ejemplo">
    <div class="win"><div class="win-body">
        ...contenido...
    </div></div>
</section>
```

`data-kind="branch"` la marca como profundización (aparece con `▸` en el mapa y
se oculta en modo charla). `data-title` es el nombre que sale en el mapa.

Si una slide estrena un término del glosario, se marca así y **el número del
superíndice se calcula solo** a partir del orden de la lista del glosario:

```html
<span class="term" data-term="harness">harness<a class="term-ref" href="#glosario-harness" title="Ver en el glosario"></a></span>
```

Y la definición breve se escribe una sola vez, en el objeto `GLOSARIO` del script.

## Cómo se mantiene

El deck es material vivo, no la grabación de una charla. Por eso lleva versión y
fecha visibles, y una convención para que dentro de seis meses nadie tenga que
adivinar de cuándo es:

- La **portada** y la última slide llevan la versión y la fecha (`v0.1 · actualizado AAAA-MM-DD`).
- **La versión la marca el mantenedor**: un agente propone, no sube la versión por su cuenta. La primera publicación en GitHub Pages es la `v0.1` (2026-10-18); las siguientes las decide el mantenedor.
- La **fecha de actualización** sí sigue al contenido: cambia siempre que cambie algo visible.
- Cada apartado con documentación externa lleva su `verificado AAAA-MM-DD`.
- Si una herramienta cambia de nombre o desaparece, se corrige en la slide, en
  `docs/definicion.md` y en las referencias; el historial de git guarda la versión anterior.
- Los cambios entran por **pull request**: `main` está protegida y la CI ejecuta
  las mismas comprobaciones (`build`, `check`, `test`, `skills:check`) antes de
  dejar mergear nada.
- Con `/preview` en un comentario de la pull request se compila el deck de esa
  PR y se publica en una URL pública, que deja de funcionar al mergear o
  descartar la PR. Solo lo puede pedir quien tenga acceso de escritura (se
  amplía con la variable `PREVIEW_AUTORIZADOS` del repositorio). Una vez
  pedida, la URL se refresca sola con cada commit nuevo de la PR; abrir una PR
  sin pedirla no compila nada.

## Créditos y licencia

- Hecho con la skill [frontend-slides](https://github.com/zarazhangrui/frontend-slides)
  (MIT, © Zara Zhang), copiada en `.agents/skills/frontend-slides/`; ver su
  [`PROCEDENCIA.md`](.agents/skills/frontend-slides/PROCEDENCIA.md).
- La skill [playwright-cli](https://github.com/microsoft/playwright-cli) se copia
  del paquete `@playwright/cli` (Apache-2.0, © Microsoft), en
  `.agents/skills/playwright-cli/`.
- La skill [codely-git-conventional-commit](https://github.com/CodelyTV/agent-harness)
  (MIT, © Codely) viene del harness de agentes de CodelyTV, en
  `.agents/skills/codely-git-conventional-commit/`.
- Tipografía **IBM Plex**, bajo SIL Open Font License 1.1
  (ver [`src/assets/fonts/LICENSE-IBMPlex.txt`](src/assets/fonts/LICENSE-IBMPlex.txt)).
- Contenido y código: **MIT** (ver [`LICENSE`](LICENSE)).
