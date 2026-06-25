import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  // 获取用户所有打卡记录
  const { data: records, error } = await supabase
    .from("checkin_records")
    .select("task_id, date")
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  if (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }

  // 计算每个任务的连续打卡天数
  const taskStreaks = new Map<number, { current: number; max: number; total: number; dates: string[] }>();

  const byTask = new Map<number, string[]>();
  for (const r of records ?? []) {
    const arr = byTask.get(r.task_id) || [];
    arr.push(r.date);
    byTask.set(r.task_id, arr);
  }

  for (const [taskId, dates] of byTask) {
    const uniqueDates = [...new Set(dates)].sort();
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

    // 检查今天是否打卡，计算当前连续天数
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const lastDate = uniqueDates[uniqueDates.length - 1];
    if (lastDate === today || lastDate === yesterday) {
      current = streak;
    }

    taskStreaks.set(taskId, {
      current,
      max,
      total: uniqueDates.length,
      dates: uniqueDates,
    });
  }

  // 总打卡天数
  const totalCheckins = records?.length ?? 0;
  const uniqueDays = new Set(records?.map((r) => r.date)).size;

  return NextResponse.json({
    taskStreaks: Object.fromEntries(taskStreaks),
    totalCheckins,
    uniqueDays,
  });
}
