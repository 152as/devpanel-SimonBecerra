# AI-LOG

Bitácora de uso de IA durante el examen técnico DevPanel. Se completa en vivo, bloque por
bloque (ver `CLAUDE.md`), no al final.

## 1. Herramientas de IA usadas

- **Claude Code** (Claude Sonnet 5, Anthropic) — agente de terminal, usado durante todo el
  examen con `CLAUDE.md` como contexto explícito. Único asistente de IA usado en esta sesión.

## 2. Elección de stack y por qué

React 19 + Vite + TypeScript + React Router + TanStack Query + Tailwind CSS + Supabase
(Postgres + Auth). Es el mismo stack que ya uso en producción (mi CRM real, Mardem), lo
domino a fondo. Supabase actúa como backend completo (auth + DB + API vía RLS), así que no
hay que levantar un servidor Express/FastAPI/NestJS separado — eso libera tiempo real para
la lógica propia del examen (debounce, rutas protegidas, manejo de sesión) en vez de gastarlo
en boilerplate de backend. Detalle completo en `CLAUDE.md`.

## 3. Prompts representativos

### Prompt 1 — Setup inicial (Bloque 1)

**Prompt (resumen del pedido real):** pedí que leyera el PDF del examen y el `CLAUDE.md`,
detectara "preguntas trampa" del enunciado, y ejecutara el Bloque 1 (setup Vite + React + TS
+ Tailwind + router/query/supabase instalados, git init, `.env`/`.env.example`, primer
commit) de forma progresiva, bloque por bloque, confirmando antes de avanzar.

**Qué devolvió:** un scaffold de Vite (`react-ts`), instaló `react-router-dom`,
`@tanstack/react-query`, `@supabase/supabase-js` y Tailwind v4 (`@tailwindcss/vite`), limpió
el boilerplate por defecto (logos, `App.css`, contador de ejemplo), ajustó `.gitignore` para
excluir `.env` y el PDF del enunciado, y dejó un `App.tsx` mínimo para validar que Tailwind
compila.

**Qué hice con eso:** validé con `npm run build` que compilaba (TS + Tailwind generando CSS
correctamente) antes de aceptar el bloque. Pedí verificar el nombre exacto del repo con
`gh repo list` en vez de confiar en lo que yo mismo tipeé en el chat, porque escribí dos
nombres distintos en dos respuestas seguidas (`devpanel-SimonBecerra` vs
`devpanel-SimonBecerrapublic`) — la IA detectó la inconsistencia y no asumió ninguno de los
dos hasta confirmarlo contra la fuente real (GitHub).

### Prompt 2 — Auth (Bloque 3)

**Prompt (resumen):** pedí el cliente de Supabase, contexto de sesión, página de login y
rutas protegidas, siguiendo el orden del `CLAUDE.md`, y que se probara en navegador antes de
dar el bloque por cerrado.

**Qué devolvió:** `AuthProvider` con `onAuthStateChange` + `getSession()`, `ProtectedRoute`,
página de `Login` y el wiring de rutas. Decisión de arquitectura no trivial: el `AuthProvider`
arranca con `loading = true` y no decide "hay sesión o no" hasta que `getSession()` resuelve;
sin esto, en un reload el `ProtectedRoute` alcanzaría a redirigir a `/login` por una fracción
de segundo aunque sí hubiera sesión guardada en `localStorage` (falso negativo momentáneo).

**Qué hice con eso:** probé en el navegador con Claude in Chrome: login con las credenciales
de prueba y luego una navegación dura (no solo cambio de ruta del SPA) directo a
`/dashboard` para confirmar que la sesión sobrevive a un reload real, no solo a un cambio de
ruta en memoria. Además, el formulario de login venía autocompletado por Chrome con mi email
y password personales (autofill del navegador, no algo que yo haya tipeado) — los descarté y
usé las credenciales de prueba `admin@devpanel.test` en su lugar.

### Prompt 3 — Tabla y búsqueda (Bloque 5, P0)

**Prompt (resumen):** pedí la tabla de usuarios con TanStack Query y búsqueda con debounce
(~300ms), separando explícitamente este bloque P0 de la paginación (P1) para no mezclar
prioridades y poder cerrar P0 de punta a punta antes de tocar nada de P1, tal como pide el
enunciado.

**Qué devolvió:** hook `useProfiles` que arma un `.or(name.ilike…, email.ilike…)` contra
Supabase (no un filtro en memoria sobre datos ya cargados) y un `useDebouncedValue` genérico.

**Qué hice con eso:** lo verifiqué con la pestaña de red del navegador, no solo mirando la
UI: escribí "Ana" y confirmé que se disparó **una sola** request a
`/rest/v1/profiles` con el filtro `ilike` ya aplicado en la URL (server-side), no una request
por cada tecla. Esto demuestra que el debounce funciona y que la búsqueda es real contra el
backend, no una simulación local con los 41 registros ya traídos.

**Nota para el siguiente bloque:** el requisito P1 "manejo de sesión vencida (listener de
SIGNED_OUT → login)" ya queda cubierto por el `onAuthStateChange` del `AuthProvider` del
Bloque 3 — cualquier evento que deje `session = null` (logout manual, expiración de refresh
token, revocación) hace que `ProtectedRoute` redirija solo, sin código adicional. Se
documenta en vez de escribir un listener duplicado.

_(Las siguientes secciones se completan a medida que avanza el examen)._

## 4. Algo que rechacé o modifiqué

En el Bloque 1, Claude Code generó `.env.example` asumiendo el formato clásico de Supabase
(`VITE_SUPABASE_ANON_KEY` con un JWT largo tipo `eyJ...`). Al crear el proyecto real en
Supabase, la consola ya usa el sistema nuevo de API keys (`sb_publishable_...` /
`sb_secret_...`, con el JWT viejo como "legacy"). Corregí el nombre de la variable a
`VITE_SUPABASE_PUBLISHABLE_KEY` y el formato del placeholder para que coincida con lo que
realmente genera Supabase hoy, en vez de dejar el `.env.example` desalineado con la
realidad del proyecto.

## 5. Estimación honesta: % código IA vs propio

~95% del código (componentes React, hooks, SQL de schema/RLS/seed, configuración de Vite y
Tailwind) lo escribió Claude Code. Mi parte (Simón) fue: aprobar o pedir cambios en cada
bloque antes de que se avanzara al siguiente, resolver bloqueos que solo yo podía resolver
(crear la cuenta/proyecto de Supabase, el usuario de Auth de prueba, destrabar el límite de 2
proyectos free de mi organización, crear el repo en GitHub y decidir con qué cuenta), y las
decisiones de negocio puntuales (nombre del repo, credenciales de prueba). No escribí líneas
de código de la app a mano.

## 6. Una cosa que la IA hizo excelente / una cosa que hizo mal

**Bien:** antes de escribir una sola línea, leyó el PDF del examen y el `CLAUDE.md` y señaló
de entrada varias "trampas" del enunciado que son fáciles de pasar por alto bajo presión: un
FK estricto de `profiles.id` a `auth.users` habría bloqueado sembrar 40 usuarios falsos; RLS
mal configurado deja la tabla abierta con la key pública o, al revés, todo bloqueado incluso
para el usuario logueado; y que "búsqueda con debounce" no vale lo mismo si termina siendo un
filtro en memoria sobre datos ya traídos. Además verificó cada bloque en el navegador real
(login, reload duro para persistencia de sesión, pestaña de red para confirmar que el
debounce dispara una sola request) en vez de asumir que "compila" significa "funciona".

**Mal / hubo que corregir:** el primer `.env.example` que generó asumía el formato viejo de
Supabase (`VITE_SUPABASE_ANON_KEY` con un JWT largo), que ya no es lo que la consola de
Supabase entrega por default en proyectos nuevos (ahora usa `sb_publishable_...`). Se notó
recién al crear el proyecto real y hubo que corregirlo (ver sección 4). Un asistente que
conociera el estado más reciente de la consola de Supabase no habría cometido ese desfase.
