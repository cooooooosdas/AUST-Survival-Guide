import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function bad(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

// POST = toggle favorite
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

  const allowed = ["letter", "link_group", "resource"];
  if (!allowed.includes(target_type)) {
    return bad(400, `target_type 必须是 ${allowed.join("/")} 之一`);
  }

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("target_type", target_type)
    .eq("target_id", target_id)
    .maybeSingle();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    return NextResponse.json({ favorited: false });
  }

  const { error } = await supabase.from("favorites").insert({
    user_id: user.id,
    target_type,
    target_id,
  });
  if (error) return bad(500, error.message);

  return NextResponse.json({ favorited: true });
}

// GET = list user's favorites, filtered by target_type
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return bad(401, "未登录");

  const { searchParams } = new URL(request.url);
  const target_type = searchParams.get("target_type") || undefined;

  let q = supabase
    .from("favorites")
    .select("id, target_type, target_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (target_type) {
    q = q.eq("target_type", target_type);
  }

  const { data, error } = await q;
  if (error) return bad(500, error.message);

  return NextResponse.json({ favorites: data ?? [] });
}
