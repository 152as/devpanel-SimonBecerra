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

_(pendiente — se completa al cierre, pero se va llevando registro por bloque)_

## 6. Una cosa que la IA hizo excelente / una cosa que hizo mal

_(pendiente — se completa al cierre)_
