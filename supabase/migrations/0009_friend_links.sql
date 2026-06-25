-- Phase 9: 友链交换系统
-- 友链申请、审核、展示

create table if not exists public.friend_links (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 100),
  url text not null check (char_length(url) between 1 and 500),
  description text check (char_length(description) <= 300),
  avatar_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submitted_by uuid references auth.users(id) on delete set null,
  submitted_at timestamptz not null default now(),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  review_note text
);

create index if not exists idx_friend_links_status
  on public.friend_links (status, submitted_at desc);

alter table public.friend_links enable row level security;

-- 所有人可读已通过的友链
drop policy if exists "anyone can read approved friend links" on public.friend_links;
create policy "anyone can read approved friend links"
  on public.friend_links for select
  using (status = 'approved');

-- 登录用户可提交
drop policy if exists "auth users can submit friend link" on public.friend_links;
create policy "auth users can submit friend link"
  on public.friend_links for insert
  with check (auth.uid() = submitted_by);

-- 验证
select tablename, policyname, cmd from pg_policies
where tablename = 'friend_links'
order by cmd;
