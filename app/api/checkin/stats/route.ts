import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function formatLocalDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// 获取当前默认的打卡任务 ID（查询首个活跃任务，避免硬编码）
async function getDefaultTaskId(supabase: Awaited<ReturnType<typeof createClient>>): Promise<number | null> {
  const { data: tasks, error } = await supabase
    .from("checkin_tasks")
    .select("id")
    .eq("is_active", true)
    .limit(1);

  if (error || !tasks || tasks.length === 0) {
    console.error("No active checkin task found:", error);
    return null;
  }
  return tasks[0].id;
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json([]);
  }

  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") || 60);

  // 使用默认打卡任务的记录（与 POST 保持一致）
  const defaultTaskId = await getDefaultTaskId(supabase);
  if (defaultTaskId === null) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("checkin_records")
    .select("task_id, date, created_at")
    .eq("task_id", defaultTaskId)
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch checkins:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
