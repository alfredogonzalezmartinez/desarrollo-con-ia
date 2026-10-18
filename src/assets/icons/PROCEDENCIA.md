# Iconos de la fila «Quién lo ofrece hoy» (slide 02)

Los logos de la slide `#s-agente` salen de **SVGL** y se copian **tal cual**, sin
retocarlos. El build los embebe como data URI (`src/assets/icons/*.svg` →
`dist/index.html`), así que el deck sigue funcionando sin conexión.

- **Origen**: <https://svgl.app/> · repositorio <https://github.com/pheralb/svgl>
- **Ruta dentro del repositorio**: `static/library/<fichero>.svg` (rama `main`)
- **Descargados**: 2026-10-18
- **Nombres**: se conserva el nombre original de SVGL. El sufijo `-dark` / `_dark`
  **es de SVGL, no nuestro**: marca las variantes pensadas para fondo oscuro, que
  es el que usa el deck. No es «este icono es oscuro».

| Fichero | Marca | Dónde sale |
|---|---|---|
| `openai_dark.svg` | OpenAI | tile «OpenAI» |
| `copilot_dark.svg` | GitHub Copilot | tile «Copilot» |
| `claude-ai-icon.svg` | Claude (Anthropic) | tile «Claude» |
| `gemini.svg` | Gemini (Google) | tile «Gemini» |
| `opencode-dark.svg` | OpenCode | tile «OpenCode» |
| `deepseek.svg` | DeepSeek | tile «DeepSeek» |
| `qwen_dark.svg` | Qwen (Alibaba) | tile «Qwen» |
| `hermes-agent.png` | Hermes Agent | tile «Hermes» |

### El caso de Hermes

**No está en SVGL** y su icono no se ha cogido de un sitio cualquiera: sale del
**favicon oficial del producto** (el que declara el propio sitio).

- Origen: <https://hermes-agent.nousresearch.com/> →
  `assets/hermes-agent/icon.png` (48×48, RGBA, 4,1 KB)
- Descargado: 2026-10-18
- Sin retocar: se embebe tal cual.
- **Ojo con la URL**: `hermes-agent.org` (sin `nousresearch`) es otro sitio. El
  bueno es `hermes-agent.nousresearch.com`, y así está en la slide 02 y en las
  Referencias.

## Licencia

SVGL es una biblioteca de logotipos: **el código del repositorio es MIT**
(`LICENSE`, © 2022 Pablo Hdez), pero **cada logo es de su marca**. Aquí se usan de
forma **nominativa**: para nombrar la herramienta de la que habla la slide, no
como imagen del deck. Si algún día deja de ser así, hay que revisarlo.

## Cómo añadir otro

1. Búscalo en <https://svgl.app/> y coge la variante **para fondo oscuro**.
2. Bájalo con el nombre original:

   ```bash
   curl -o src/assets/icons/<fichero>.svg \
     https://raw.githubusercontent.com/pheralb/svgl/main/static/library/<fichero>.svg
   ```

3. Añade su `<div class="tool">` a `#s-agente` y sube el número del
   `repeat(N, 1fr)` de `.evo-tools` (en el CSS, dentro del bloque
   `evolución: chat vs agente`).
4. Añade la fila a la tabla de arriba.
5. `npm run build && npm run check`.
