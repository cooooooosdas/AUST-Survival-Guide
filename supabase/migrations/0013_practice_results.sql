-- Phase 13: 刷题结果跨设备记录
-- 用户在 /practice 做题的结果，存到 Supabase，未登录用户退化为 localStorage

create table if not exists public.practice_results (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  platform text not null check (platform in ('luogu', 'leetcode')),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  result text not null check (result in ('solved', 'attempted', 'skipped')),
  created_at timestamptz not null default now()
);

create index if not exists idx_practice_results_user_date
  on public.practice_results (user_id, created_at desc);

create index if not exists idx_practice_results_user_result
  on public.practice_results (user_id, result, created_at desc);

alter table public.practice_results enable row level security;

-- 自己读自己的
drop policy if exists "users can read own practice results" on public.practice_results;
create policy "users can read own practice results"
  on public.practice_results for select
  using (auth.uid() = user_id);

-- 自己写自己的
drop policy if exists "users can insert own practice results" on public.practice_results;
create policy "users can insert own practice results"
  on public.practice_results for insert
  with check (auth.uid() = user_id);

-- 公开统计视图：每日每用户的练习次数
create or replace view public.daily_practice_stats as
select
  user_id,
  date_trunc('day', created_at)::date as day,
  count(*) as total_attempts,
  count(*) filter (where result = 'solved') as solved_count,
  count(*) filter (where result = 'skipped') as skipped_count
from public.practice_results
group by user_id, date_trunc('day', created_at);