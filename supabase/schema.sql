-- DevPanel: schema de public.profiles, RLS y seed de datos de prueba.
-- Correr una vez en el SQL Editor del proyecto de Supabase.

-- 1. Tabla. id NO tiene FK forzado a auth.users: se necesita poder sembrar
--    ~40 perfiles falsos sin crear 40 cuentas reales en Auth. El unico
--    perfil que de verdad coincide con un auth.users.id es el del usuario
--    de prueba (ver paso 4). Decision documentada en AI-LOG.md.
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  role text not null default 'viewer',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

-- 2. RLS: sin esto, el anon/publishable key (publico por diseno) podria
--    leer toda la tabla sin login.
alter table public.profiles enable row level security;

-- 3. Policy: cualquier usuario autenticado puede leer todas las filas
--    (panel admin interno, no hace falta aislar por usuario en este examen).
create policy "authenticated users can read profiles"
on public.profiles
for select
to authenticated
using (true);

-- 4. Perfil del usuario de prueba real (login del examen).
--    Reemplazar 'REEMPLAZAR-CON-UUID-DEL-USUARIO-DE-AUTH' por el UUID que
--    aparece en Authentication > Users despues de crear el usuario de prueba.
insert into public.profiles (id, name, email, role, status)
values (
  'REEMPLAZAR-CON-UUID-DEL-USUARIO-DE-AUTH',
  'Admin DevPanel',
  'admin@devpanel.test',
  'admin',
  'active'
);

-- 5. Seed: 40 perfiles falsos, roles/status variados, emails unicos.
insert into public.profiles (name, email, role, status)
select
  fn.first_name || ' ' || fn.last_name as name,
  lower(fn.first_name || '.' || fn.last_name) || gs.i || '@devpanel.test' as email,
  (array['admin', 'editor', 'viewer'])[1 + ((row_number() over ()) % 3)] as role,
  (array['active', 'inactive'])[1 + ((row_number() over ()) % 2)] as status
from (
  select
    unnest(array[
      'Ana', 'Luis', 'Maria', 'Carlos', 'Sofia', 'Diego', 'Valentina', 'Andres', 'Camila', 'Jorge',
      'Laura', 'Miguel', 'Paula', 'Sergio', 'Daniela', 'Ricardo', 'Elena', 'Pablo', 'Isabel', 'Fernando'
    ]) as first_name,
    unnest(array[
      'Garcia', 'Rodriguez', 'Martinez', 'Lopez', 'Perez', 'Gonzalez', 'Sanchez', 'Ramirez', 'Torres', 'Flores',
      'Rivera', 'Gomez', 'Diaz', 'Cruz', 'Morales', 'Reyes', 'Ortiz', 'Gutierrez', 'Chavez', 'Ramos'
    ]) as last_name
) fn
cross join generate_series(1, 2) as gs(i);
