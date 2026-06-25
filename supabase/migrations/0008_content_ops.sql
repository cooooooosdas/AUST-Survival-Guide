-- Phase 6: 内容管理 + 运营统计
-- 阅读量统计 + 分享统计 + 更新日志

-- ============ 1. content_views 表 ============
create table if not exists public.content_views (
  id bigint generated always as identity primary key,
  target_type text not null check (target_type in ('letter', 'resource', 'faq', 'question')),
  target_id text not null,
  viewer_ip text,
  viewer_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_content_views_target
  on public.content_views (target_type, target_id, created_at desc);

-- 每日统计视图（按天聚合）
create or replace view public.daily_content_stats as
select
  target_type,
  target_id,
  date_trunc('day', created_at)::date as day,
  count(*) as views,
  count(distinct viewer_ip) as unique_views
from public.content_views
group by target_type, target_id, date_trunc('day', created_at);

-- 总览统计视图
create or replace view public.content_stats as
select
  target_type,
  target_id,
  count(*) as total_views,
  count(distinct viewer_ip) as unique_views,
  max(created_at) as last_viewed_at
from public.content_views
group by target_type, target_id;

alter table public.content_views enable row level security;

-- 所有人可读（用于统计）
drop policy if exists "anyone can read content views" on public.content_views;
create policy "anyone can read content views"
  on public.content_views for select
  using (true);

-- 任何人可插入（匿名访问也能计数）
drop policy if exists "anyone can insert view" on public.content_views;
create policy "anyone can insert view"
  on public.content_views for insert
  with check (true);

-- ============ 2. shares 表 ============
create table if not exists public.shares (
  id bigint generated always as identity primary key,
  target_type text not null check (target_type in ('letter', 'resource', 'faq')),
  target_id text not null,
  channel text not null check (channel in ('wechat', 'wechat_moments', 'copy_link')),
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_shares_target
  on public.shares (target_type, target_id, created_at desc);

alter table public.shares enable row level security;

drop policy if exists "anyone can read shares" on public.shares;
create policy "anyone can read shares"
  on public.shares for select
  using (true);

drop policy if exists "anyone can insert share" on public.shares;
create policy "anyone can insert share"
  on public.shares for insert
  with check (true);

-- ============ 3. changelogs 表 ============
create table if not exists public.changelogs (
  id bigint generated always as identity primary key,
  title text not null,
  content text not null,
  category text default 'general' check (category in (
    'general', 'high-math', 'software', 'letter', 'feature'
  )),
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_changelogs_published
  on public.changelogs (is_published, created_at desc);

alter table public.changelogs enable row level security;

-- 所有人可读已发布的
drop policy if exists "anyone can read published changelogs" on public.changelogs;
create policy "anyone can read published changelogs"
  on public.changelogs for select
  using (is_published = true);

-- 验证
select tablename, policyname, cmd from pg_policies
where tablename in ('content_views', 'shares', 'changelogs')
order by tablename, cmd;
