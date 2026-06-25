import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function bad(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return bad(503, "Supabase 未配置");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return bad(400, "请求体不是合法 JSON");
  }

  const input = body as {
    url?: string;
    title?: string;
    section?: string;
    note?: string;
  };

  const url = (input.url ?? "").trim();
  const title = (input.title ?? "").trim();
  const note = (input.note ?? "").trim();

  if (!url || !title) {
    return bad(400, "缺少 url 或 title");
  }
  if (url.length > 500) {
    return bad(400, "url 太长");
  }
  if (note.length > 500) {
    return bad(400, "note 最多 500 字");
  }

  const supabase = await createClient();

  let reporterId: string | null = null;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) reporterId = user.id;
  } catch {
    // 匿名反馈也允许
  }

  const { error } = await supabase.from("link_reports").insert({
    url,
    title,
    section: input.section ?? null,
    reporter_id: reporterId,
    note: note || null,
  });

  if (error) {
    return bad(500, error.message);
  }

  return NextResponse.json({ ok: true });
}
