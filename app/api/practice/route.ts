import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function bad(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

const PLATFORMS = ["luogu", "leetcode"] as const;
const DIFFICULTIES = ["easy", "medium", "hard"] as const;
const RESULTS = ["solved", "attempted", "skipped"] as const;

type Body = {
  question_id: string;
  platform: (typeof PLATFORMS)[number];
  difficulty: (typeof DIFFICULTIES)[number];
  result: (typeof RESULTS)[number];
};

// POST = record a practice result (user must be logged in)
export async function POST(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return bad(503, "后端未配置");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return bad(401, "未登录");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return bad(400, "请求体不是合法 JSON");
  }

  const input = body as Body;
  if (!input.question_id) return bad(400, "缺少 question_id");
  if (!PLATFORMS.includes(input.platform))
    return bad(400, "platform 必须是 luogu/leetcode");
  if (!DIFFICULTIES.includes(input.difficulty))
    return bad(400, "difficulty 必须是 easy/medium/hard");
  if (!RESULTS.includes(input.result))
    return bad(400, "result 必须是 solved/attempted/skipped");

  const { error } = await supabase.from("practice_results").insert({
    user_id: user.id,
    question_id: input.question_id,
    platform: input.platform,
    difficulty: input.difficulty,
    result: input.result,
  });

  if (error) return bad(500, error.message);

  return NextResponse.json({ ok: true });
}

// GET = retrieve last 7 days stats (per user)
export async function GET(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ stats: [], recent: [], loggedIn: false });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ stats: [], recent: [], loggedIn: false });
  }

  const since = new Date();
  since.setDate(since.getDate() - 6); // 最近 7 天含今天
  since.setHours(0, 0, 0, 0);

  const { data: stats } = await supabase
    .from("daily_practice_stats")
    .select("day, total_attempts, solved_count, skipped_count")
    .eq("user_id", user.id)
    .gte("day", since.toISOString().slice(0, 10))
    .order("day", { ascending: true });

  // 服务端补齐 7 天——缺天补 0。client 只负责 display。
  const weekly: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const found = (stats ?? []).find(
      (s: { day: string }) => s.day === key
    );
    weekly.push(found?.total_attempts ?? 0);
  }

  const { data: recent } = await supabase
    .from("practice_results")
    .select("id, question_id, platform, difficulty, result, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json({
    weekly,
    recent: recent ?? [],
    loggedIn: true,
  });
}