Quiero crear una persentación sobre desasorollo con con IA.  

La idea es hacer una presentacion usando [https://github.com/zarazhangrui/frontend-slides](https://github.com/zarazhangrui/frontend-slides)

La presentacion tendra un flujo pricipal que permite ir avanzzando al os siguientes temas o puntos. Pero tabien tendra "rutas alternativas" que permitan profundizar en ese apartado.

Añadir una sección de glosario que recoja los terminos mas relevantes y cuado dse usen eson reminos haya un enlace a la definición en el glosario si se clica (algo como un super indice de anotaciones) y aque al poner el enlace sea posible ver la definición si no se quiere navegar al glosario. (evaluar como hacer esto y si tiene sentido la sección o que simplemente se muesre la definidin de los temos relobates al porner el raton encima o clicar, aun que clicar se deberia reservar para navegaciones)



La presentación debe ser visual, fácil de comprender y seguir, por lo que se debe incluir imagenes, graficos, diagramas, ejemplos y todos aquellos recursos que ayuden a esto. Se priorizan frase cortar, fácil de comprender, pero que den la información necesarias, para complementar se aportaran enlaces a documentación, artículos u otros recursos.



Tiene que incluir referencias a la documentación, artículos u otros recursos relevantes usado para generar la presentación.



## Apartados

### Portada

- Titulo: Desarrollo con IA
- Referencia al repositorio de github: [https://github.com/alfredogonzalezmartinez/desarrollo-con-ia](https://github.com/alfredogonzalezmartinez/desarrollo-con-ia)



### ¿Qué es un agente?

- definición de  de que es un agente
- diferencias entre chat y agente
- Ejemplos de agentes (opencode, claude, code, codex, Hermes Agent, ...) y chats (chatGPT, geminis, ...) con una pequeña descricion y enlaces
- Un diagrama interactivo en el que parta del nucleo o cerebro, es decir el modelo, se encapsula en el harnes y poco a poco se vayan añadiendo de forma logica y facil de compreder los coneptos de Subagente, Skill, MCP(o CLI), Prompt, Contexto. Al poner el ratón encima de cada concepto se vera una frase explicativa breve y la posibilidad de navegar al apartado de la presentación donde se trate el tema.
- Gestión de permiso y modo de trabajo (por ejemplo modo plan, solo lectura permitida)
  - Hooks 



### Subagentes

- ¿que es un subagente?
- tabajos en paralelo y con agentes especializados
- ¿como crear un sub agente?

### Skills

- ¿que es una skill? beneficios
- Como crear skills
  - [https://youtu.be/oZTXrgHRi-k?si=SZa_vYKRq3k0Rpsk](https://youtu.be/oZTXrgHRi-k?si=SZa_vYKRq3k0Rpsk)
  - [https://agentskills.io/specification](https://agentskills.io/specification)
- Algunas skills:
  - [**++skills++**](https://github.com/vercel-labs/skills)
  - [**agent-harness**](https://github.com/CodelyTV/agent-harness)
  - [**frontend-slides**](https://github.com/zarazhangrui/frontend-slides)
  - [**security-audit-skill**](https://github.com/cloudflare/security-audit-skill)
  - [**archify**](https://github.com/tt-a1i/archify)
  - [**anydoc**](https://github.com/firecrawl/anydoc)



### Contexto/Memoria

- ¿Que es el contexto?
- agents.md, claude.md
- como persitir información para tenerla disponible en diferentes sesiones
- Tamaño de la ventata de contexto (clear, compact, autocompact)
- optimizaciones para reducir/otimizar consumos
- heramientas:
  - [**++context-mode++**](https://github.com/mksglu/context-mode)
  - [**++engram++**](https://github.com/Gentleman-Programming/engram)
  - [**++rtk++**](https://github.com/rtk-ai/rtk)



### MCP

- ¿que es un MCP?
- MCP vs CLI
- ¿como crear un mcp? 
  - [https://modelcontextprotocol.io/](https://modelcontextprotocol.io/)



### Orquestación de agentes/Entonos de desarrollo con agentes

- Nueva pespectiva en el desarollo 
- [https://herdr.dev/](https://herdr.dev/)
- [https://www.onorca.dev/](https://www.onorca.dev/)
- otras alternativas



### Modelos

- ¿que es modelo? LLM 
- consumo de api vs suscripción
- Modelos frontera
- Benchmarks
  - [http://artificialanalysis.ai/agents/coding-agents](http://artificialanalysis.ai/agents/coding-agents)
  - buscar graficas de coparacion de los modelos (haiku, sonnet, opus) 5.5 de antropic
  - determinar en que casos usar cada modelo y en que esfuerzo para optimizar la supcricion basica de claude 
  - buscar otros sitios de benchmarks o control de degradado del modelos
- Modelos locales
  - ejemplos: qwen, ...
  - heramientas: Ollama, LM Studio, ...
- Enrutadores de modelos
  - ¿que es  y que ofrece un enrutador de modelos?
  - ejemplos: [OmniRoute](https://github.com/diegosouzapw/OmniRoute), [openrouter](https://openrouter.ai/), ...
- Modelos gratuitos



### Flujos de trabajo con IA

- explorar → planificar → codificar → confirmar
- SDD, RPI
  - [https://github.com/CodelyTV/rpi-course](https://github.com/CodelyTV/rpi-course)
  - Buscar mas recursos