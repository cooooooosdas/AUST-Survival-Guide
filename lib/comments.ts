import type { Comment } from "@/lib/types";

// 0007 migration 给 comments 表加了 parent_id / status / tags / pinned /
// pinned_at，并重建了 comments_with_author 视图。如果生产库还停在 0001
// schema，view 不会返回这些字段；调用方需要 normalize 之后再用。
export function normalizeComment(raw: Partial<Comment>): Comment {
  return {
    id: raw.id!,
    user_id: raw.user_id!,
    target_type: raw.target_type!,
    target_id: raw.target_id!,
    content: raw.content!,
    created_at: raw.created_at!,
    display_name: raw.display_name ?? null,
    avatar_url: raw.avatar_url ?? null,
    parent_id: raw.parent_id ?? null,
    status: raw.status ?? "approved",
    tags: raw.tags ?? [],
    pinned: raw.pinned ?? false,
    pinned_at: raw.pinned_at ?? null,
  };
}

export function normalizeComments(raws: Partial<Comment>[] | null | undefined): Comment[] {
  return (raws ?? []).map(normalizeComment);
}
