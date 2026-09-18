# CLAUDE.md — DevPanel (examen tecnico, 2 horas)

## Contexto del examen (leer primero, esto rige todo)

Este es un examen tecnico cronometrado de 2 horas para un puesto de desarrollo. Reglas que
afectan como trabajamos juntos en este repo:

- **No hacer un mega commit al final.** Commits pequenos y frecuentes, uno por cada paso
  logico completado, usando Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`).
  Despues de cada bloque de la tabla de abajo, se hace commit antes de seguir.
- **Prohibido hardcodear usuarios en un JSON.** Los usuarios viven en una base de datos real
  (Postgres via Supabase).
- **Tiene que poder clonarse y correr en menos de 5 minutos**, con instrucciones exactas en
  el README.
- Al final hay que entregar tres archivos obligatorios en la raiz: `README.md`, `AI-LOG.md`,
  y este mismo `CLAUDE.md`.
- El `AI-LOG.md` se completa **progresivamente durante la sesion**, no al final. Cada vez que
  yo (el humano) le pida algo importante a Claude Code, hay que anotar despues en el AI-LOG:
  el prompt, que devolvio, y que se hizo con eso. Si en algun momento se rechaza o modifica
  algo que Claude Code propuso, anotarlo tambien, es un requisito explicito del examen.

## Que es DevPanel

Un mini panel de administracion: login, dashboard con metricas simples, y una tabla de
usuarios con busqueda y paginacion.

## Stack elegido (no cambiar a mitad de camino salvo emergencia)

**React 19 + Vite + TypeScript + React Router + TanStack Query + Tailwind CSS + Supabase
(Postgres + Auth).**

Por que: es el mismo stack de produccion que ya uso en mi CRM real (Mardem), lo domino a
fondo. Supabase actua como backend completo (auth + base de datos + API), asi que no hay
servidor Express/FastAPI/NestJS separado que armar desde cero. Esto libera tiempo real para
las partes con logica propia: busqueda con debounce, rutas protegidas, manejo de sesion.

## Configuracion de Supabase (hacer esto ANTES de escribir codigo)

1. Crear proyecto en supabase.com
2. **Authentication > Settings > desactivar "Confirm email"** — si no se hace esto, el
   usuario de prueba nunca podra loguearse y se pierde tiempo debuggeando algo que no es
   codigo.
3. Guardar la URL del proyecto y el anon key, van al `.env` y tambien se copian tal cual en
   `.env.example` (el anon key esta disenado para ser publico, la seguridad real la da RLS,
   no ocultar esta key — esto se explica asi en el README para que quede claro que no es un
   descuido).

## Esquema de base de datos

Tabla `profiles`:

| Columna | Tipo | Notas |
|---|---|---|
| id | uuid | referencia a auth.users |
| name | text | |
| email | text | |
| role | text | ej: admin, editor, viewer |
| status | text | ej: active, inactive |
| created_at | timestamptz | default now() |

- Habilitar RLS desde la primera migracion.
- Politica: usuarios autenticados pueden leer todas las filas de `profiles` (es un panel
  admin interno, no hace falta aislar por usuario para este examen).
- Seed: generar unas 40 filas de datos falsos realistas (nombres, emails, roles y status
  variados) para que la busqueda y la paginacion tengan sentido al probarlas.

## Funcionalidades, en orden estricto de prioridad (no saltar de orden)

### P0 — MUST, hacer todo esto primero, sin excepcion
1. Login con email + password contra Supabase Auth
2. Sesion persistente (Supabase la maneja via localStorage, verificar `onAuthStateChange` al
   montar la app)
3. Ruta protegida: sin sesion activa, redirige a `/login`
4. Dashboard con al menos 2 tarjetas de metricas (ej: total de usuarios, usuarios activos —
   conteos simples sobre la tabla `profiles`)
5. Tabla de usuarios poblada desde Supabase (fetch real, no datos mock en el frontend)
6. Busqueda en la tabla con debounce real (~300ms), sin recargar toda la tabla en cada tecla

### P1 — SHOULD, solo despues de que TODO lo de arriba funcione de punta a punta
7. Paginacion (usar `.range()` de Supabase) o scroll infinito
8. Logout funcional
9. Manejo de error de sesion vencida (listener de `SIGNED_OUT` o 401 -> redirige a login)

### P2 — NICE, solo si sobra tiempo real, nunca a costa de un P0 o P1
10. Indicador del usuario logueado en el header
11. Filtros por rol o status
12. Pulido visual con Tailwind

**Regla de corte:** si a los 90 minutos los P0 no estan solidos, se abandona todo lo demas y
se pasa directo a dejar documentado README y AI-LOG. Tres P0 completos valen mas que seis
items a medias.

## Orden de trabajo sugerido (bloques, con commit al cierre de cada uno)

1. Setup: Vite + React + TS + Tailwind, proyecto Supabase creado y configurado, `git init`,
   primer commit
2. Schema + seed de `profiles` con RLS
3. Auth: pagina de login, hook de sesion, rutas protegidas
4. Dashboard: tarjetas de metricas, header, logout
5. Tabla: fetch con TanStack Query, columnas, busqueda con debounce
6. Si hay tiempo: paginacion, manejo de sesion expirada
7. Documentacion final: README, AI-LOG, `.env.example`, ultimo commit

## Convenciones de codigo

- TypeScript en todo el proyecto, evitar `any` salvo justificacion puntual
- Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`) en cada commit
- Nada de credenciales ni datos sensibles reales hardcodeados en el codigo fuente

## Que necesito de vos (Claude Code) durante la sesion

- Proponer el codigo bloque por bloque, en el orden de arriba, no todo de una vez
- Antes de avanzar al siguiente bloque, confirmame que el actual funciona
- Si tomas una decision de arquitectura no trivial, decimela en una linea para que la anote
  en el AI-LOG
- Si generas algo que no se ajusta al enunciado (por ejemplo datos hardcodeados, o saltarte
  el debounce), preferible que lo señales vos mismo antes de que lo note yo
