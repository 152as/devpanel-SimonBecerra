# DevPanel

Mini panel de administración: login, dashboard con métricas y una tabla de usuarios con
búsqueda, paginación y filtros. Examen técnico práctico — Credicorp Bank.

## Stack

React 19 + Vite + TypeScript + React Router + TanStack Query + Tailwind CSS + Supabase
(Postgres + Auth). Supabase actúa como backend completo (auth + base de datos + API vía RLS),
así que no hay servidor separado que levantar.

## Prerrequisitos

- Node.js 18 o superior
- Una cuenta de Supabase (gratuita) — supabase.com

## Cómo correrlo (< 5 minutos)

1. Clona el repo e instala dependencias:

   ```bash
   git clone https://github.com/152as/devpanel-SimonBecerra.git
   cd devpanel-SimonBecerra
   npm install
   ```

2. Crea un proyecto en [supabase.com](https://supabase.com) (plan free). En
   **Authentication → Sign In / Providers**, desactiva **"Confirm email"** (si no, el usuario
   de prueba no puede loguearse).

3. Copia `.env.example` a `.env` y completa con los datos de tu proyecto (**Project Settings →
   API Keys → Publishable and secret API keys**):

   ```bash
   cp .env.example .env
   ```

   ```
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxx
   ```

4. En **Authentication → Users → Add user**, crea un usuario (marca "Auto Confirm User") y
   copia su UUID.

5. Abre **SQL Editor → New query**, pega el contenido de `supabase/schema.sql`, reemplaza
   `REEMPLAZAR-CON-UUID-DEL-USUARIO-DE-AUTH` por el UUID del paso anterior, y ejecútalo. Esto
   crea la tabla `profiles`, habilita RLS, la policy de lectura y siembra ~40 usuarios de
   prueba.

6. Levanta el proyecto:

   ```bash
   npm run dev
   ```

   Abre `http://localhost:5173`.

## Credenciales de prueba

Usa el email y password que definiste al crear el usuario en el paso 4. En esta instancia de
desarrollo se usó:

- Email: `admin@devpanel.test`
- Password: `Devpanel123!`

## Decisiones técnicas clave

- **Supabase en vez de backend propio**: ahorra montar un servidor Express/NestJS separado
  en una prueba de 2h; Supabase da auth + Postgres + API (vía PostgREST) con RLS como capa de
  seguridad real.
- **`profiles.id` sin FK forzado a `auth.users`**: se necesitaba sembrar ~40 perfiles falsos
  sin crear 40 cuentas reales en Auth. Solo el usuario de prueba real tiene su `profiles.id`
  igual a su `auth.users.id`. Ver `supabase/schema.sql`.
- **Búsqueda con debounce (300ms) contra el backend**: cada búsqueda dispara un
  `.or(ilike)` real a Supabase, no un filtro en memoria sobre datos ya cargados — verificado
  viendo la pestaña de red del navegador (una request por búsqueda, no por tecla).
- **`AuthProvider` con estado de `loading`**: evita un falso "no hay sesión" (y el redirect a
  `/login`) durante la fracción de segundo en la que `getSession()` resuelve la sesión
  guardada en `localStorage` al recargar la página.
- **Anon/publishable key en `.env.example` con su valor real**: es una key pública por
  diseño (segura para el navegador); la seguridad de verdad la da RLS + la policy de
  `profiles`, no ocultar esta key.

## Limitaciones conocidas

- No hay registro de usuarios (signup) desde la UI — los usuarios se crean manualmente en el
  dashboard de Supabase, como pide el enunciado ("no dejar usuarios fijos en un JSON").
- Sin tests automatizados (fuera de alcance para 2h, según el enunciado).
- El diseño es funcional con modo oscuro y badges de color, pero no es pixel-perfect ni usa
  una librería de componentes (shadcn, etc.).
- La tabla no tiene ordenamiento por columna (solo orden fijo por fecha de creación).
- `profiles.status` es informativo: impulsa la tarjeta "Usuarios activos" y el filtro de la
  tabla, pero no bloquea el login — el flujo de autenticación valida contra `auth.users` de
  Supabase, no contra este campo. Marcar un perfil como `inactive` no le impide iniciar sesión
  si tiene una cuenta de Auth real asociada.
