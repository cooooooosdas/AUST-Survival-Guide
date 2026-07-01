import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function formatLocalDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// 与 checkin route 共享的 resolveTaskId 逻辑
async function resolveTaskId(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<number> {
  try {
    const { data: tasks, error } = await supabase
      .from("checkin_tasks")
      .select("id")
      .eq("is_active", true)
      .limit(1);

    if (!error && tasks && tasks.length > 0) {
      return tasks[0].id;
    }
  } catch {
    // 回退
  }
  return 1;
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const taskId = await resolveTaskId(supabase);

  const { data: records, error } = await supabase
    .from("checkin_records")
    .select("task_id, date")
    .eq("task_id", taskId)
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  if (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }

  const uniqueDates = [...new Set((records ?? []).map((r) => r.date))].sort();

  let current = 0;
  let max = 0;
  let streak = 0;
  let prev: string | null = null;

  for (const d of uniqueDates) {
    if (prev) {
      const diff = (new Date(d).getTime() - new Date(prev).getTime()) / 86400000;
      if (diff === 1) {
        streak++;
      } else {
        streak = 1;
      }
    } else {
      streak = 1;
    }
    max = Math.max(max, streak);
    prev = d;
  }

  const today = formatLocalDate(new Date());
  const yesterday = formatLocalDate(new Date(Date.now() - 86400000));
  const lastDate = uniqueDates[uniqueDates.length - 1];
  if (lastDate === today || lastDate === yesterday) {
    current = streak;
  }

  return NextResponse.json({
    totalDays: uniqueDates.length,
    currentStreak: current,
    maxStreak: max,
  });
}
