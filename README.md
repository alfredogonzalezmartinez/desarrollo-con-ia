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
.claude/skills/mantener-deck/   skill con el procedimiento de mantenimiento
src/index.html            la fuente: aquí se edita todo
src/assets/fonts/         IBM Plex recortada a los caracteres del deck
scripts/build.mjs         compila src → dist
scripts/check-layout.mjs  mide el encaje de las 32 slides con Chromium
scripts/shots.mjs         capturas de las slides, para revisar
scripts/subset-fonts.sh   regenera las fuentes (rara vez hace falta)
docs/definicion.md        qué lleva cada slide y por qué: el documento de definición
dist/index.html           generado por el build, no se versiona
shots/                    capturas de revisión, no se versiona
```

Si vas a trabajar en el deck (tú o un agente), empieza por **`AGENTS.md`**: ahí
están las reglas que no se pueden romper y las trampas conocidas. La skill
`mantener-deck` empaqueta el procedimiento para que un agente lo siga solo.

## Trabajar en él

```bash
npm install
npm run build      # dist/index.html: un solo fichero, sin dependencias de red
npm run build:dev  # lo mismo pero sin minificar, para depurar
npm run check      # mide la maquetación de las 32 slides con un navegador real
npm run shots      # capturas de las 32 slides en shots/ (para revisar)
npm run preview    # compila y sirve en http://127.0.0.1:8811
npm run pack       # además genera .gz y .br, para compartirlo comprimido
```

El build hace tres cosas y **falla si alguna no se cumple**:

1. Embebe las fuentes y cualquier otro asset como *data URI*.
2. Comprueba que no queda ninguna dependencia de red: el deck funciona sin conexión.
3. Comprueba que ningún enlace interno (`#…`) apunta al vacío y que no hay `id` duplicados.

El resultado ronda los **270 KB** (unos 145 KB comprimido con brotli).

### Comprobar la maquetación

El escenario es fijo (1920×1080) y cada slide es una ventana con
`overflow: hidden`: lo que no cabe **se recorta sin avisar**. `npm run check`
abre el deck en un navegador de verdad, mide cada slide y dice cuál se sale:

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

- La **portada** y la última slide llevan la versión y la fecha (`v0 · actualizado AAAA-MM-DD`).
- **La versión la marca el mantenedor**: un agente propone, no sube la versión por su cuenta. Estamos en `v0`; pasará a `v1` al publicar.
- La **fecha de actualización** sí sigue al contenido: cambia siempre que cambie algo visible.
- Cada apartado con documentación externa lleva su `verificado AAAA-MM-DD`.
- Si una herramienta cambia de nombre o desaparece, se corrige en la slide, en
  `docs/definicion.md` y en las referencias; el historial de git guarda la versión anterior.

## Créditos y licencia

- Hecho con la skill [frontend-slides](https://github.com/zarazhangrui/frontend-slides).
- Tipografía **IBM Plex**, bajo SIL Open Font License 1.1
  (ver [`src/assets/fonts/LICENSE-IBMPlex.txt`](src/assets/fonts/LICENSE-IBMPlex.txt)).
- Contenido y código: **MIT** (ver [`LICENSE`](LICENSE)).
