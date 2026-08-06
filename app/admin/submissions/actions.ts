"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAction } from "@/lib/admin-guard";
import type { SubmissionStatus } from "@/lib/types";

const REVIEW_STATUSES = new Set<SubmissionStatus>([
  "submitted",
  "reviewing",
  "accepted",
  "rejected",
]);

export async function reviewSubmission(id: number, formData: FormData) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase 尚未配置");
  }
  await requireAdminAction();
  const supabase = await createClient();

  const rawStatus = formData.get("status");
  const status = typeof rawStatus === "string" ? rawStatus as SubmissionStatus : "reviewing";
  const rawNote = formData.get("reviewer_note");
  const reviewerNote = typeof rawNote === "string" ? rawNote.trim().slice(0, 1000) : "";
  if (!REVIEW_STATUSES.has(status)) throw new Error("无效审核状态");

  const { error } = await supabase
    .from("content_submissions")
    .update({ status, reviewer_note: reviewerNote || null })
    .eq("id", id);
  if (error) throw new Error("审核结果未保存");

  revalidatePath("/admin/submissions");
  revalidatePath("/contribute");
}
