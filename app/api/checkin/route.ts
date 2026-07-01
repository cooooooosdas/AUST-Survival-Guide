import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const clientDate = (body as { date?: string }).date;
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const checkDate = clientDate || today;

  if (checkDate !== today) {
    return NextResponse.json({ error: "只能打卡今天" }, { status: 400 });
  }

  // 查询当前可用的打卡任务（避免 task_id 硬编码导致 FK 约束失败）
  const { data: tasks, error: taskError } = await supabase
    .from("checkin_tasks")
    .select("id")
    .eq("is_active", true)
    .limit(1);

  if (taskError || !tasks || tasks.length === 0) {
    console.error("No active checkin task found:", taskError);
    return NextResponse.json({ error: "暂无可用打卡任务，请联系管理员" }, { status: 500 });
  }

  const taskId = tasks[0].id;

  const { error } = await supabase
    .from("checkin_records")
    .upsert(
      {
        task_id: taskId,
        user_id: user.id,
        date: checkDate,
      },
      { onConflict: "task_id,user_id,date" }
    );

  if (error) {
    console.error("Failed to check in:", error);
    return NextResponse.json({ error: "打卡失败" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, record: { task_id: taskId, date: checkDate } });
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

  const { data, error } = await supabase
    .from("checkin_records")
    .select("task_id, date, created_at")
    .eq("task_id", 1)
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch checkins:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
