-- Phase 3: 用户头像存储（Supabase Storage）
-- 在 Supabase Dashboard → SQL Editor 里整段粘贴执行
-- 如果某条报错，复制报错信息发给我

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
