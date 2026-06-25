-- Phase 4: 工具箱链接失效反馈表
-- 在 Supabase Dashboard → SQL Editor 里整段粘贴执行

-- ============ 1. link_reports 表 ============
create table if not exists public.link_reports (
  id bigint generated always as identity primary key,
  url text not null,
  title text not null,
  section text,
  reporter_id uuid references auth.users(id) on delete set null,
  note text check (char_length(note) between 1 and 500),
  status text not null default 'open' check (status in ('open', 'resolved', 'ignored')),
  created_at timestamptz not null default now()
);

create index if not exists idx_link_reports_status
  on public.link_reports (status, created_at desc);

create index if not exists idx_link_reports_url
  on public.link_reports (url);

alter table public.link_reports enable row level security;

-- 任何人（含匿名）都能提交失效反馈
drop policy if exists "anyone can submit link report" on public.link_reports;
create policy "anyone can submit link report"
  on public.link_reports for insert
  with check (true);

-- 读取：暂时让所有人可读（方便后续做"已反馈"标识）
drop policy if exists "anyone can read link reports" on public.link_reports;
create policy "anyone can read link reports"
  on public.link_reports for select
  using (true);

-- 验证
select policyname, cmd, qual, with_check
from pg_policies
where tablename = 'link_reports';
