import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { data: records, error } = await supabase
    .from("checkin_records")
    .select("task_id, date")
    .eq("user_id", user.id)
    .eq("task_id", 1)
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

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
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
