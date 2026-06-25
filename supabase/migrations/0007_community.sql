-- Phase 5: 社区互动升级
-- 留言楼中楼 + 审核 + 标签 + 置顶 + 匿名提问 + FAQ

-- ============ 1. comments 表升级 ============

-- 楼中楼：parent_id 指向同一条留言下的父评论，null = 顶层评论
alter table public.comments
  add column if not exists parent_id bigint
    references public.comments(id) on delete cascade;

-- 审核状态：pending / approved / rejected；默认 approved 保持向后兼容
alter table public.comments
  add column if not exists status text not null default 'approved'
    check (status in ('pending', 'approved', 'rejected'));

-- 分类标签
alter table public.comments
  add column if not exists tags text[] default '{}';

-- 置顶
alter table public.comments
  add column if not exists pinned boolean not null default false;

alter table public.comments
  add column if not exists pinned_at timestamptz;

-- 索引
create index if not exists idx_comments_parent
  on public.comments (parent_id);

create index if not exists idx_comments_status
  on public.comments (status, created_at desc);

create index if not exists idx_comments_pinned
  on public.comments (pinned desc, created_at desc);

-- RLS：更新策略允许作者修改自己的 pending 评论，管理员通过 service_role 绕过
drop policy if exists "users can update own pending comment" on public.comments;
create policy "users can update own pending comment"
  on public.comments for update
  using (auth.uid() = user_id and status = 'pending');

-- 更新视图：包含新字段
drop view if exists public.comments_with_author;
create view public.comments_with_author as
select
  c.id,
  c.user_id,
  c.target_type,
  c.target_id,
  c.content,
  c.created_at,
  p.display_name,
  p.avatar_url,
  c.parent_id,
  c.status,
  c.tags,
  c.pinned,
  c.pinned_at
from public.comments c
left join public.profiles p on p.id = c.user_id;

alter view public.comments_with_author set (security_invoker = on);

-- ============ 2. questions 匿名提问表 ============
create table if not exists public.questions (
  id bigint generated always as identity primary key,
  content text not null check (char_length(content) between 1 and 2000),
  category text default 'general' check (category in (
    'general', 'high-math', 'course-select', 'software', 'ai-tools'
  )),
  status text not null default 'pending' check (status in (
    'pending', 'answered', 'public', 'rejected'
  )),
  reply text,
  replied_at timestamptz,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_questions_status
  on public.questions (status, created_at desc);

alter table public.questions enable row level security;

-- 所有人可读（匿名提问默认公开，但只有审核通过的才显示）
drop policy if exists "anyone can read public questions" on public.questions;
create policy "anyone can read public questions"
  on public.questions for select
  using (is_public = true or status = 'pending');

-- 匿名提交：任何人都能插入
drop policy if exists "anyone can submit question" on public.questions;
create policy "anyone can submit question"
  on public.questions for insert
  with check (true);

-- 管理员更新（通过 service_role key 的 API 绕过 RLS）

-- ============ 3. faq_items 表 ============
create table if not exists public.faq_items (
  id bigint generated always as identity primary key,
  question text not null,
  answer text not null,
  category text default 'general' check (category in (
    'general', 'high-math', 'course-select', 'software', 'ai-tools'
  )),
  source_type text not null default 'manual' check (source_type in (
    'manual', 'comment', 'question'
  )),
  source_id bigint,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_faq_items_category
  on public.faq_items (category, sort_order, created_at desc);

alter table public.faq_items enable row level security;

-- 所有人可读已发布的 FAQ
drop policy if exists "anyone can read published faq" on public.faq_items;
create policy "anyone can read published faq"
  on public.faq_items for select
  using (is_published = true);

-- 验证
select tablename, policyname, cmd from pg_policies
where tablename in ('comments', 'questions', 'faq_items')
order by tablename, cmd;
