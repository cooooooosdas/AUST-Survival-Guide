-- Phase 10: 任务打卡系统
-- 学习任务打卡、连续打卡统计

create table if not exists public.checkin_tasks (
  id bigint generated always as identity primary key,
  name text not null unique,
  description text,
  icon text not null default '📝',
  color text not null default 'primary' check (color in ('primary', 'accent', 'secondary')),
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.checkin_records (
  id bigint generated always as identity primary key,
  task_id bigint not null references public.checkin_tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  created_at timestamptz not null default now(),
  unique(task_id, user_id, date)
);

create index if not exists idx_checkin_records_user_date
  on public.checkin_records (user_id, date desc);

create index if not exists idx_checkin_records_task
  on public.checkin_records (task_id, date desc);

alter table public.checkin_tasks enable row level security;
alter table public.checkin_records enable row level security;

-- 任务定义：所有人可读
drop policy if exists "anyone can read checkin tasks" on public.checkin_tasks;
create policy "anyone can read checkin tasks"
  on public.checkin_tasks for select
  using (is_active = true);

-- 打卡记录：所有人可读（用于展示排行榜等）
drop policy if exists "anyone can read checkin records" on public.checkin_records;
create policy "anyone can read checkin records"
  on public.checkin_records for select
  using (true);

-- 登录用户可打卡
drop policy if exists "auth users can checkin" on public.checkin_records;
create policy "auth users can checkin"
  on public.checkin_records for insert
  with check (auth.uid() = user_id);

-- 验证
select tablename, policyname, cmd from pg_policies
where tablename in ('checkin_tasks', 'checkin_records')
order by tablename, cmd;

-- 初始任务数据
insert into public.checkin_tasks (name, description, icon, color, sort_order) values
  ('高数刷题', '每天完成高等数学习题练习', '📐', 'accent', 1),
  ('编程练习', '每天写代码，保持手感', '💻', 'primary', 2),
  ('英语阅读', '阅读英文技术文档或新闻', '📖', 'secondary', 3),
  ('运动健身', '每天运动半小时', '🏃', 'accent', 4)
on conflict (name) do nothing;
