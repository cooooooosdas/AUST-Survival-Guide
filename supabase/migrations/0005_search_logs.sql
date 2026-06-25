-- Phase 4: 搜索日志表（用于热门搜索词推荐）
-- 在 Supabase Dashboard → SQL Editor 里整段粘贴执行

create table if not exists public.search_logs (
  id bigint generated always as identity primary key,
  query text not null,
  normalized text not null,
  count int not null default 1,
  last_searched_at timestamptz not null default now()
);

create unique index if not exists idx_search_logs_normalized
  on public.search_logs (normalized);

alter table public.search_logs enable row level security;

drop policy if exists "anyone can read search logs" on public.search_logs;
create policy "anyone can read search logs"
  on public.search_logs for select
  using (true);

drop policy if exists "anyone can insert search log" on public.search_logs;
create policy "anyone can insert search log"
  on public.search_logs for insert
  with check (true);
