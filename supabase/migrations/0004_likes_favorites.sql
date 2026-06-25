-- Phase 4: 点赞 + 收藏系统
-- 在 Supabase Dashboard → SQL Editor 里整段粘贴执行

-- ============ 1. likes 表 ============
create table if not exists public.likes (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null default 'letter' check (target_type in ('letter', 'comment')),
  target_id text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);

create index if not exists idx_likes_target
  on public.likes (target_type, target_id, created_at desc);

alter table public.likes enable row level security;

-- 所有人可读（前端统计用）
drop policy if exists "anyone can read likes" on public.likes;
create policy "anyone can read likes"
  on public.likes for select
  using (true);

-- 登录用户可 toggle
drop policy if exists "authenticated can toggle like" on public.likes;
create policy "authenticated can toggle like"
  on public.likes for insert
  with check (auth.uid() = user_id);

drop policy if exists "authenticated can delete own like" on public.likes;
create policy "authenticated can delete own like"
  on public.likes for delete
  using (auth.uid() = user_id);

-- ============ 2. favorites 表 ============
create table if not exists public.favorites (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null default 'letter' check (target_type in ('letter', 'link_group', 'resource')),
  target_id text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);

create index if not exists idx_favorites_user
  on public.favorites (user_id, created_at desc);

alter table public.favorites enable row level security;

-- 自己读自己的
drop policy if exists "users can read own favorites" on public.favorites;
create policy "users can read own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

-- 登录用户可 toggle
drop policy if exists "authenticated can toggle favorite" on public.favorites;
create policy "authenticated can toggle favorite"
  on public.favorites for insert
  with check (auth.uid() = user_id);

drop policy if exists "authenticated can delete own favorite" on public.favorites;
create policy "authenticated can delete own favorite"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- 验证
select tablename, policyname, cmd from pg_policies
where tablename in ('likes', 'favorites')
order by tablename, cmd;
