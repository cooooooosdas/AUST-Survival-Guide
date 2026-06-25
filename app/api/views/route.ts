import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function bad(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

// POST = record a view
export async function POST(request: NextRequest) {
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
  const target_id = (input.target_id ?? "").trim();

  if (!target_id) return bad(400, "缺少 target_id");

  const allowed = ["letter", "resource", "faq", "question"];
  if (!allowed.includes(target_type)) return bad(400, "无效 target_type");

  // 获取 viewer 信息
  let viewerIp: string | null = null;
  let viewerId: string | null = null;

  try {
    viewerIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  } catch {
    // ignore
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    viewerId = user?.id ?? null;

    await supabase.from("content_views").insert({
      target_type,
      target_id,
      viewer_ip: viewerIp,
      viewer_id: viewerId,
    });
  } catch {
    // 记录失败不影响页面
  }

  return NextResponse.json({ ok: true });
}
