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
  const checkDate = (body as { date?: string }).date || new Date().toISOString().split("T")[0];

  // 用固定的 task_id=1 作为「每日学习打卡」的通用任务
  const { error } = await supabase
    .from("checkin_records")
    .upsert(
      {
        task_id: 1,
        user_id: user.id,
        date: checkDate,
      },
      { onConflict: "task_id,user_id,date" }
    );

  if (error) {
    console.error("Failed to check in:", error);
    return NextResponse.json({ error: "打卡失败" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, record: { task_id: 1, date: checkDate } });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") || 60);

  let query = supabase
    .from("checkin_records")
    .select("task_id, date, created_at")
    .eq("task_id", 1)
    .order("date", { ascending: false })
    .limit(limit);

  if (user) {
    query = query.eq("user_id", user.id);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch checkins:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
