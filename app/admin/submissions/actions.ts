"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("未登录");

  const { data: admin } = await supabase
    .from("site_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!admin) throw new Error("无审核权限");

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
