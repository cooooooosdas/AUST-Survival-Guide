"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CommentTargetType } from "@/lib/types";

const VALID_TARGETS: CommentTargetType[] = ["global", "section", "letter"];
const COMMENT_TAGS = ["高数问题", "选课疑问", "软件安装", "AI工具使用"];

// ============ 基础 CRUD ============

export async function postComment(input: {
  content: string;
  target_type: CommentTargetType;
  target_id: string;
  parent_id?: number | null;
  tags?: string[];
}) {
  const content = input.content.trim();
  if (!content) return { ok: false, error: "留言不能为空" };
  if (content.length > 2000) return { ok: false, error: "留言太长（≤ 2000 字）" };
  if (!VALID_TARGETS.includes(input.target_type))
    return { ok: false, error: "无效目标类型" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "请先登录" };

  const tags = (input.tags ?? []).filter((t) => COMMENT_TAGS.includes(t));

  const { error } = await supabase.from("comments").insert({
    user_id: user.id,
    target_type: input.target_type,
    target_id: input.target_id,
    content,
    parent_id: input.parent_id ?? null,
    tags,
    status: "approved",
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/board");
  return { ok: true };
}

export async function replyToComment(input: {
  content: string;
  target_type: CommentTargetType;
  target_id: string;
  parent_id: number;
  tags?: string[];
}) {
  return postComment({
    content: input.content,
    target_type: input.target_type,
    target_id: input.target_id,
    parent_id: input.parent_id,
    tags: input.tags,
  });
}

export async function deleteComment(id: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "请先登录" };

  const { error } = await supabase.from("comments").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/board");
  return { ok: true };
}

// ============ 审核（管理员用 service_role key 调用） ============

export async function moderateComment(input: {
  id: number;
  status: "approved" | "rejected";
}) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("comments")
    .update({ status: input.status })
    .eq("id", input.id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/board");
  return { ok: true };
}

export async function pinComment(id: number, pinned: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("comments")
    .update({
      pinned,
      pinned_at: pinned ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/board");
  return { ok: true };
}

// ============ 标签列表 ============

export async function getCommentTags(): Promise<string[]> {
  return COMMENT_TAGS;
}
