-- Phase 3: 用户头像存储（Supabase Storage）
-- 在 Supabase Dashboard → SQL Editor 里执行

-- ============ 1. 创建 bucket（public：头像直接可通过 URL 访问） ============
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2 * 1024 * 1024,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- ============ 2. 所有人可读 ============
drop policy if exists "avatar_public_read" on storage.objects;
create policy "avatar_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- ============ 3. 登录用户只能往自己 id 的目录写入 ============
-- storage.foldername(path) 返回路径分段数组，[1] = 第一个目录 = user_id
drop policy if exists "avatar_insert_own" on storage.objects;
create policy "avatar_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatar_update_own" on storage.objects;
create policy "avatar_update_own"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatar_delete_own" on storage.objects;
create policy "avatar_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
