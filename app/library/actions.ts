"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ClearHistoryState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function clearReadingHistory(
  _previousState: ClearHistoryState,
  _formData: FormData
): Promise<ClearHistoryState> {
  void _previousState;
  void _formData;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { status: "error", message: "阅读记录服务尚未配置" };
  }
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { status: "error", message: "登录已过期，请重新登录" };

    const { error } = await supabase
      .from("content_views")
      .delete()
      .eq("viewer_id", user.id);
    if (error) {
      return { status: "error", message: "阅读历史未能清除，请稍后重试" };
    }

    revalidatePath("/library");
    return { status: "success", message: "最近浏览已清空" };
  } catch {
    return { status: "error", message: "阅读记录服务暂时不可用" };
  }
}
