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

  const body = await req.json();
  const { task_id, date } = body;

  if (!task_id) {
    return NextResponse.json({ error: "缺少任务 ID" }, { status: 400 });
  }

  const checkDate = date || new Date().toISOString().split("T")[0];

  const { error } = await supabase
    .from("checkin_records")
    .upsert(
      {
        task_id: Number(task_id),
        user_id: user.id,
        date: checkDate,
      },
      { onConflict: "task_id,user_id,date" }
    );

  if (error) {
    console.error("Failed to check in:", error);
    return NextResponse.json({ error: "打卡失败" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, date: checkDate });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = new URL(req.url);
  const taskId = url.searchParams.get("task_id");
  const limit = Number(url.searchParams.get("limit") || 30);

  let query = supabase
    .from("checkin_records")
    .select("task_id, date, created_at")
    .order("date", { ascending: false })
    .limit(limit);

  if (user) {
    query = query.eq("user_id", user.id);
  }

  if (taskId) {
    query = query.eq("task_id", Number(taskId));
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch checkins:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
