"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SubmissionCategory } from "@/lib/types";

export type SubmissionActionState = {
  status: "idle" | "error" | "success";
  message: string;
  submissionId: number | null;
};

const CATEGORIES = new Set<SubmissionCategory>([
  "campus",
  "study",
  "tools",
  "experience",
  "project",
  "other",
]);

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContent(
  _previousState: SubmissionActionState,
  formData: FormData
): Promise<SubmissionActionState> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      status: "error",
      message: "投稿服务尚未配置，请先完成 Supabase 环境变量与数据库迁移。",
      submissionId: null,
    };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: "error", message: "登录后才能投稿。", submissionId: null };
  }

  const title = field(formData, "title");
  const excerpt = field(formData, "excerpt");
  const body = field(formData, "body");
  const rawCategory = field(formData, "category") as SubmissionCategory;
  const category = CATEGORIES.has(rawCategory) ? rawCategory : "other";
  const originalityConfirmed = formData.get("originality") === "confirmed";
  const tags = Array.from(
    new Set(
      field(formData, "tags")
        .split(/[,，]/)
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  ).slice(0, 5);

  if (title.length < 4 || title.length > 100) {
    return { status: "error", message: "标题需要 4–100 个字符。", submissionId: null };
  }
  if (excerpt.length < 20 || excerpt.length > 240) {
    return { status: "error", message: "摘要需要 20–240 个字符。", submissionId: null };
  }
  if (body.length < 200 || body.length > 20000) {
    return { status: "error", message: "正文需要 200–20000 个字符。", submissionId: null };
  }
  if (!originalityConfirmed) {
    return { status: "error", message: "请确认内容原创或已获得发布授权。", submissionId: null };
  }

  const { data, error } = await supabase
    .from("content_submissions")
    .insert({
      user_id: user.id,
      title,
      excerpt,
      category,
      tags,
      body,
      status: "submitted",
    })
    .select("id")
    .single();

  if (error) {
    const message = error.code === "42P01"
      ? "投稿数据库尚未初始化，请先执行最新 Supabase migration。"
      : "投稿未保存，请检查网络后重试。";
    return { status: "error", message, submissionId: null };
  }

  revalidatePath("/contribute");
  return {
    status: "success",
    message: "稿件已进入审核队列，你可以在右侧查看状态。",
    submissionId: data.id,
  };
}
