-- Phase 2 数据库初始化
-- 在 Supabase Dashboard → SQL Editor → New query 里粘贴整段执行

-- ============ 1. profiles 表（用户公开资料） ============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles are readable by anyone" on public.profiles;
create policy "profiles are readable by anyone"
  on public.profiles for select
  using (true);

drop policy if exists "users can update own profile" on public.profiles;
create policy "users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "users can insert own profile" on public.profiles;
create policy "users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 注册即自动建 profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'user_name',
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============ 2. comments 表（留言） ============
create table if not exists public.comments (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('global', 'section', 'letter')),
  target_id text not null default 'global',
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists idx_comments_target
  on public.comments (target_type, target_id, created_at desc);

alter table public.comments enable row level security;

drop policy if exists "comments are readable by anyone" on public.comments;
create policy "comments are readable by anyone"
  on public.comments for select
  using (true);

drop policy if exists "authenticated users can insert" on public.comments;
create policy "authenticated users can insert"
  on public.comments for insert
  with check (auth.uid() = user_id);

drop policy if exists "users can delete own comments" on public.comments;
create policy "users can delete own comments"
  on public.comments for delete
  using (auth.uid() = user_id);


-- ============ 3. 视图：留言带作者信息一起出 ============
create or replace view public.comments_with_author as
select
  c.id,
  c.user_id,
  c.target_type,
  c.target_id,
  c.content,
  c.created_at,
  p.display_name,
  p.avatar_url
from public.comments c
left join public.profiles p on p.id = c.user_id;

-- 视图按调用者权限走（继承底表 RLS）
alter view public.comments_with_author set (security_invoker = on);
