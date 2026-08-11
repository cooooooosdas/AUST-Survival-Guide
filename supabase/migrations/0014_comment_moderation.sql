-- 留言审核闭环：默认待审核，公开只读已通过内容，管理员可审核与置顶。

drop policy if exists "comments are readable by anyone" on public.comments;
drop policy if exists "approved comments are public" on public.comments;
create policy "approved comments are public"
  on public.comments for select
  using (
    status = 'approved'
    or auth.uid() = user_id
    or public.is_site_admin()
  );

drop policy if exists "authenticated users can insert" on public.comments;
drop policy if exists "authenticated users can submit pending comments" on public.comments;
create policy "authenticated users can submit pending comments"
  on public.comments for insert
  with check (
    auth.uid() = user_id
    and status = 'pending'
    and pinned = false
    and pinned_at is null
  );

drop policy if exists "users can update own pending comment" on public.comments;
drop policy if exists "site admins can moderate comments" on public.comments;
create policy "site admins can moderate comments"
  on public.comments for update
  using (public.is_site_admin())
  with check (public.is_site_admin());
