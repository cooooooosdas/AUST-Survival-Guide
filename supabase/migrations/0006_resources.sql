-- Phase 4: 资源下载系统
-- 在 Supabase Dashboard → SQL Editor 里整段粘贴执行

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
