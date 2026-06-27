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
