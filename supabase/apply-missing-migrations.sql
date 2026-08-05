-- ============================================================
-- 一次性补跑缺失迁移（0002-0012）
-- 用法：Supabase Dashboard -> SQL Editor -> New query -> 整段粘贴 -> Run
-- 全部幂等，重复执行不会报错。执行完看最后输出是否列出所有表。
-- ============================================================


-- ============================================================
-- 0002_storage_avatars.sql
-- ============================================================

-- ============ 1. 创建 bucket ============
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2 * 1024 * 1024,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- 验证 bucket 是否创建成功（执行完下面这行应该能看到一行数据）
select id, name, public, file_size_limit from storage.buckets where id = 'avatars';

-- ============ 2. 所有人可读 ============
drop policy if exists "avatar_public_read" on storage.objects;
create policy "avatar_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- ============ 3. 登录用户只能往自己 id 的目录写入 ============
-- 用 split_part 取路径第一个段（= user_id），避免依赖 storage.foldername 函数
drop policy if exists "avatar_insert_own" on storage.objects;
create policy "avatar_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = split_part(name, '/', 1)
  );

drop policy if exists "avatar_update_own" on storage.objects;
create policy "avatar_update_own"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = split_part(name, '/', 1)
  );

drop policy if exists "avatar_delete_own" on storage.objects;
create policy "avatar_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = split_part(name, '/', 1)
  );

-- 验证策略是否创建成功（执行完下面这行应该能看到 4 行，名字分别是 avatar_public_read / avatar_insert_own / avatar_update_own / avatar_delete_own）
select policyname, permissive, cmd, qual, with_check
from pg_policies
where tablename = 'objects'
  and schemaname = 'storage'
  and policyname like 'avatar_%';

-- ============================================================
-- 0003_link_reports.sql
-- ============================================================
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

-- ============================================================
-- 0004_likes_favorites.sql
-- ============================================================
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

-- ============================================================
-- 0005_search_logs.sql
-- ============================================================
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

-- ============================================================
-- 0006_resources.sql
-- ============================================================
-- ============ 1. resources 表 ============
create table if not exists public.resources (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  category text not null default 'other' check (category in (
    'high-math', 'cs-courseware', 'software', 'review', 'latex', 'other'
  )),
  file_name text not null,
  file_size bigint,
  file_type text,
  storage_path text not null,
  download_count int not null default 0,
  uploaded_by uuid references auth.users(id) on delete set null,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_resources_category
  on public.resources (category, created_at desc);

create index if not exists idx_resources_uploader
  on public.resources (uploaded_by);

alter table public.resources enable row level security;

-- 所有人可读资源列表
drop policy if exists "anyone can read resources" on public.resources;
create policy "anyone can read resources"
  on public.resources for select
  using (true);

-- 登录用户可上传
drop policy if exists "authenticated can insert resource" on public.resources;
create policy "authenticated can insert resource"
  on public.resources for insert
  with check (auth.uid() = uploaded_by);

-- 上传者或管理员可更新
drop policy if exists "users can update own resource" on public.resources;
create policy "users can update own resource"
  on public.resources for update
  using (auth.uid() = uploaded_by);

-- 上传者或管理员可删除
drop policy if exists "users can delete own resource" on public.resources;
create policy "users can delete own resource"
  on public.resources for delete
  using (auth.uid() = uploaded_by);

-- ============ 2. Storage bucket ============
-- resources bucket 只需要创建一次，重复执行不会报错
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resources',
  'resources',
  true,
  100 * 1024 * 1024,  -- 100MB
  ARRAY[
    'application/pdf',
    'text/markdown',
    'application/zip',
    'application/x-zip-compressed',
    'application/x-7z-compressed',
    'application/x-rar-compressed',
    'application/vnd.microsoft.portable-executable',
    'application/x-msi',
    'application/x-msdownload',
    'application/octet-stream',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;

-- 所有人可读
drop policy if exists "resources_public_read" on storage.objects;
create policy "resources_public_read"
  on storage.objects for select
  using (bucket_id = 'resources');

-- 登录用户可上传到自己的目录
drop policy if exists "resources_insert_own" on storage.objects;
create policy "resources_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'resources'
    and auth.uid()::text = split_part(name, '/', 1)
  );

drop policy if exists "resources_update_own" on storage.objects;
create policy "resources_update_own"
  on storage.objects for update
  using (
    bucket_id = 'resources'
    and auth.uid()::text = split_part(name, '/', 1)
  );

drop policy if exists "resources_delete_own" on storage.objects;
create policy "resources_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'resources'
    and auth.uid()::text = split_part(name, '/', 1)
  );

-- 验证
select policyname, cmd from pg_policies
where tablename = 'objects'
  and schemaname = 'storage'
  and policyname like 'resources_%';

-- ============================================================
-- 0007_community.sql
-- ============================================================
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

-- ============================================================
-- 0008_content_ops.sql
-- ============================================================
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

-- ============================================================
-- 0009_friend_links.sql
-- ============================================================
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

-- ============================================================
-- 0010_checkins.sql
-- ============================================================
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

-- ============================================================
-- 0011_seed_faq.sql
-- ============================================================
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

drop policy if exists "anyone can read published faq" on public.faq_items;
create policy "anyone can read published faq"
  on public.faq_items for select
  using (is_published = true);

-- Seed legacy FAQ items (the 6 items previously hardcoded in FaqClient.tsx)
insert into public.faq_items (question, answer, category, source_type, sort_order, is_published)
values
  ('校园网连接报错怎么办？',
   '1. 确认已连接 AUST-WiFi 或 AUST-5G' || chr(10) ||
   '2. 打开浏览器访问任意网站会自动跳转到认证页面' || chr(10) ||
   '3. 输入学号和初始密码（默认是身份证后6位）登录' || chr(10) ||
   '4. 如果还是连不上，重启路由器或联系网络中心',
   'high-math', 'manual', 100, true),
  ('VSCode 怎么配置 C/C++ 编译环境？',
   '1. 安装 VSCode' || chr(10) ||
   '2. 安装 C/C++ 扩展（Microsoft 出品）' || chr(10) ||
   '3. 安装 MinGW-w64（推荐用 WinLibs 一键包）' || chr(10) ||
   '4. 在 VSCode 设置里配置 c_cpp_properties.json 的 includePath' || chr(10) ||
   '5. 创建 tasks.json 配置编译任务' || chr(10) ||
   '6. 按 Ctrl+Shift+B 编译运行',
   'software', 'manual', 100, true),
  ('高数极限题有什么解题技巧？',
   '1. 先判断类型：∞/∞、0/0、∞-∞、1^∞' || chr(10) ||
   '2. 常用方法：洛必达法则、等价无穷小替换、泰勒展开、变量替换' || chr(10) ||
   '3. 注意定义域和连续性' || chr(10) ||
   '4. 多练习历年真题，尤其是选择题和填空题' || chr(10) ||
   '5. 推荐看 B 站「猴博士」或「高数叔」的视频讲解',
   'high-math', 'manual', 90, true),
  ('ChatGPT 回答的内容总出错怎么办？',
   '1. 明确告诉它你的身份（如「我是安理大计算机学院大一新生」）' || chr(10) ||
   '2. 要求它提供出处和参考链接' || chr(10) ||
   '3. 对于代码问题，让它先分析再给方案' || chr(10) ||
   '4. 数学问题务必自己验算' || chr(10) ||
   '5. 用它来辅助理解，不要完全依赖' || chr(10) ||
   '6. 关键信息去官方文档核实',
   'ai-tools', 'manual', 80, true),
  ('怎么查看自己的绩点排名？',
   '教务系统（jw.aust.edu.cn）只能看到自己的成绩，看不到排名。想看排名需要去「测评一览」——这是学工系统的功能，登录后可以看到自己在专业内的百分比排名。',
   'course-select', 'manual', 70, true),
  ('选课系统崩了怎么办？',
   '1. 错峰选课：不要等到截止前一分钟才选' || chr(10) ||
   '2. 用手机端选，比电脑快' || chr(10) ||
   '3. 不要刷新重进，你的选择可能已经生效' || chr(10) ||
   '4. 看到「朝北」的奇数不要选——系统偶尔有 bug' || chr(10) ||
   '5. 选错了也不用慌，开学后学校会多退少补',
   'course-select', 'manual', 70, true);

-- ============================================================
-- 0012_publication_workflow.sql
-- ============================================================
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

-- ============================================================
-- 执行完验证：应该能看到下面这些表/视图
-- ============================================================
select tablename as table_or_view
from pg_tables
where schemaname = 'public'
union all
select viewname
from pg_views
where schemaname = 'public'
order by 1;

-- ============================================================
-- 手动步骤（必须做）：把自己设为管理员，否则 /admin 页面用不了
-- 把下面邮箱换成你登录 aust.asia 的邮箱，单独执行这一行：
-- insert into public.site_admins (user_id)
-- select id from auth.users where email = '你的登录邮箱';
-- ============================================================
