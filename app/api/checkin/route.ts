import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 解析当前应使用的打卡任务 ID
// 优先查 checkin_tasks 表中的首个活跃任务；
// 若表为空/查询失败（如迁移未运行），则回退到 task_id=1，保证打卡可用。
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
    // 表不存在或查询异常，走回退逻辑
  }
  return 1;
}

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

  const taskId = await resolveTaskId(supabase);

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

  const taskId = await resolveTaskId(supabase);

  const { data, error } = await supabase
    .from("checkin_records")
    .select("task_id, date, created_at")
    .eq("task_id", taskId)
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch checkins:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
