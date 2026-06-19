"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CommentTargetType } from "@/lib/types";

const VALID_TARGETS: CommentTargetType[] = ["global", "section", "letter"];

export async function postComment(input: {
  content: string;
  target_type: CommentTargetType;
  target_id: string;
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

  const { error } = await supabase.from("comments").insert({
    user_id: user.id,
    target_type: input.target_type,
    target_id: input.target_id,
    content,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/board");
  return { ok: true };
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
