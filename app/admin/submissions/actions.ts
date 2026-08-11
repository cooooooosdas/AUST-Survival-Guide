"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAction } from "@/lib/admin-guard";
import type { SubmissionStatus } from "@/lib/types";

export type ReviewActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const REVIEW_STATUSES = new Set<SubmissionStatus>([
  "submitted",
  "reviewing",
  "accepted",
  "rejected",
]);

export async function reviewSubmission(
  id: number,
  _previousState: ReviewActionState,
  formData: FormData
): Promise<ReviewActionState> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { status: "error", message: "Supabase 尚未配置。" };
  }
  try {
    await requireAdminAction();
  } catch {
    return { status: "error", message: "登录已失效或无权审核。" };
  }
  const supabase = await createClient();

  const rawStatus = formData.get("status");
  const status = typeof rawStatus === "string" ? rawStatus as SubmissionStatus : "reviewing";
  const rawNote = formData.get("reviewer_note");
  const reviewerNote = typeof rawNote === "string" ? rawNote.trim().slice(0, 1000) : "";
  if (!REVIEW_STATUSES.has(status)) {
    return { status: "error", message: "审核状态无效，请刷新后重试。" };
  }

  const { error } = await supabase
    .from("content_submissions")
    .update({ status, reviewer_note: reviewerNote || null })
    .eq("id", id);
  if (error) return { status: "error", message: "审核结果未保存，请重试。" };

  revalidatePath("/admin/submissions");
  revalidatePath("/contribute");
  return { status: "success", message: "审核状态与编辑意见已保存。" };
}
