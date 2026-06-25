import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function bad(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
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

  const input = body as {
    target_type?: string;
    target_id?: string;
  };

  const target_type = input.target_type ?? "letter";
  const target_id = input.target_id ?? "";

  if (!target_id) {
    return bad(400, "缺少 target_id");
  }

  const allowed = ["letter", "comment", "link_group", "resource"];
  if (!allowed.includes(target_type)) {
    return bad(400, `target_type 必须是 ${allowed.join("/")} 之一`);
  }

  // 检查是否已点赞
  const { data: existing } = await supabase
    .from("likes")
    .select("id")
    .eq("user_id", user.id)
    .eq("target_type", target_type)
    .eq("target_id", target_id)
    .maybeSingle();

  if (existing) {
    // 取消点赞
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("id", existing.id);
    if (error) return bad(500, error.message);
    return NextResponse.json({ liked: false, count: null });
  }

  // 点赞
  const { error } = await supabase.from("likes").insert({
    user_id: user.id,
    target_type,
    target_id,
  });
  if (error) return bad(500, error.message);

  // 返回最新点赞数
  const { count } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("target_type", target_type)
    .eq("target_id", target_id);

  return NextResponse.json({ liked: true, count: count ?? 0 });
}
