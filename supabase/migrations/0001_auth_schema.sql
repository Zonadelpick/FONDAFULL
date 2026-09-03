-- Fondafull — Esquema base para autenticación real (Fase 1)
-- Ejecuta este script completo en Supabase → SQL Editor → New query → Run.

create extension if not exists pgcrypto;

-- ---------- RESTAURANTS ----------
create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text,
  logo text,
  created_at timestamptz not null default now()
);

alter table public.restaurants enable row level security;

-- ---------- PROFILES (1 por usuario de auth.users) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  nombre_responsable text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Un usuario solo puede ver/editar su propio perfil.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- Un usuario solo puede ver/editar el restaurante ligado a su propio perfil.
drop policy if exists "restaurants_select_own" on public.restaurants;
create policy "restaurants_select_own" on public.restaurants
  for select using (
    id in (select restaurant_id from public.profiles where id = auth.uid())
  );

drop policy if exists "restaurants_update_own" on public.restaurants;
create policy "restaurants_update_own" on public.restaurants
  for update using (
    id in (select restaurant_id from public.profiles where id = auth.uid())
  );

-- ---------- Aprovisionamiento automático al crear cuenta ----------
-- Cuando alguien se registra (supabase.auth.signUp con options.data = { nombre_restaurante, nombre_responsable, telefono }),
-- este trigger crea automáticamente su restaurante y su perfil (sin caracteres especiales problemáticos).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  nuevo_restaurant_id uuid;
begin
  insert into public.restaurants (nombre, telefono)
  values (
    coalesce(new.raw_user_meta_data ->> 'nombre_restaurante', 'Mi restaurante'),
    new.raw_user_meta_data ->> 'telefono'
  )
  returning id into nuevo_restaurant_id;

  insert into public.profiles (id, restaurant_id, nombre_responsable)
  values (
    new.id,
    nuevo_restaurant_id,
    coalesce(new.raw_user_meta_data ->> 'nombre_responsable', split_part(new.email, '@', 1))
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Bloqueo por intentos fallidos de inicio de sesión ----------
create table if not exists public.login_attempts (
  email text primary key,
  failed_count int not null default 0,
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

-- Nadie accede a esta tabla directamente; solo a través de las funciones de abajo.
alter table public.login_attempts enable row level security;

create or replace function public.check_login_lockout(p_email text)
returns table (is_locked boolean, locked_until timestamptz)
language sql
security definer
set search_path = public
as $$
  select
    coalesce(la.locked_until, 'epoch'::timestamptz) > now() as is_locked,
    la.locked_until
  from public.login_attempts la
  where la.email = lower(p_email)
  union all
  select false, null::timestamptz
  where not exists (select 1 from public.login_attempts where email = lower(p_email))
  limit 1;
$$;

create or replace function public.record_failed_login(p_email text)
returns table (failed_count int, locked_until timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
  v_locked_until timestamptz;
begin
  insert into public.login_attempts (email, failed_count, updated_at)
  values (lower(p_email), 1, now())
  on conflict (email) do update
    set failed_count = login_attempts.failed_count + 1,
        updated_at = now()
  returning login_attempts.failed_count into v_count;

  if v_count >= 5 then
    v_locked_until := now() + interval '15 minutes';
    update public.login_attempts set locked_until = v_locked_until where email = lower(p_email);
  else
    v_locked_until := null;
  end if;

  return query select v_count, v_locked_until;
end;
$$;

create or replace function public.reset_login_attempts(p_email text)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.login_attempts where email = lower(p_email);
$$;

-- Permite llamar estas funciones desde el cliente (antes de estar autenticado), pero no
-- acceder a la tabla login_attempts directamente (no se le otorgan permisos de tabla).
revoke all on public.login_attempts from anon, authenticated;
grant execute on function public.check_login_lockout(text) to anon, authenticated;
grant execute on function public.record_failed_login(text) to anon, authenticated;
grant execute on function public.reset_login_attempts(text) to anon, authenticated;
