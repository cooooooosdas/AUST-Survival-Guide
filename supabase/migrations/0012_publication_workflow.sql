-- 博客化内容工作流：投稿审核、管理员身份与隐私友好的访问统计

-- ============ 1. 仅公开聚合访问统计 ============
create or replace view public.site_visit_stats as
select
  count(*)::bigint as total_views,
  count(distinct coalesce(
    viewer_id::text,
    nullif(viewer_ip, ''),
    id::text
  ))::bigint as unique_visitors
from public.content_views;

grant select on public.site_visit_stats to anon, authenticated;

drop policy if exists "anyone can read content views" on public.content_views;
drop policy if exists "users can read own content views" on public.content_views;
create policy "users can read own content views"
  on public.content_views for select
  using (auth.uid() = viewer_id);

drop policy if exists "users can delete own content views" on public.content_views;
create policy "users can delete own content views"
  on public.content_views for delete
  using (auth.uid() = viewer_id);

-- ============ 2. 管理员名单 ============
create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.site_admins enable row level security;

drop policy if exists "admins can read own membership" on public.site_admins;
create policy "admins can read own membership"
  on public.site_admins for select
  using (auth.uid() = user_id);

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.site_admins where user_id = auth.uid()
  );
$$;

revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to authenticated;

-- 首位管理员需要在 SQL Editor 中手动加入：
-- insert into public.site_admins (user_id)
-- select id from auth.users where email = '你的登录邮箱';

-- ============ 3. 内容投稿 ============
create table if not exists public.content_submissions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 4 and 100),
  excerpt text not null check (char_length(excerpt) between 20 and 240),
  category text not null check (category in (
    'campus', 'study', 'tools', 'experience', 'project', 'other'
  )),
  tags text[] not null default '{}',
  body text not null check (char_length(body) between 200 and 20000),
  status text not null default 'submitted' check (status in (
    'submitted', 'reviewing', 'accepted', 'rejected'
  )),
  reviewer_note text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_content_submissions_user
  on public.content_submissions (user_id, submitted_at desc);

create index if not exists idx_content_submissions_status
  on public.content_submissions (status, submitted_at desc);

alter table public.content_submissions enable row level security;

drop policy if exists "authors can read own submissions" on public.content_submissions;
create policy "authors can read own submissions"
  on public.content_submissions for select
  using (auth.uid() = user_id);

drop policy if exists "authors can submit content" on public.content_submissions;
create policy "authors can submit content"
  on public.content_submissions for insert
  with check (auth.uid() = user_id and status = 'submitted');

drop policy if exists "admins can read all submissions" on public.content_submissions;
create policy "admins can read all submissions"
  on public.content_submissions for select
  using (public.is_site_admin());

drop policy if exists "admins can review submissions" on public.content_submissions;
create policy "admins can review submissions"
  on public.content_submissions for update
  using (public.is_site_admin())
  with check (public.is_site_admin());

create or replace function public.touch_content_submission_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists content_submissions_touch_updated_at
  on public.content_submissions;
create trigger content_submissions_touch_updated_at
  before update on public.content_submissions
  for each row execute function public.touch_content_submission_updated_at();
