import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function bad(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

// POST = record a share
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
    channel?: string;
  };

  const target_type = input.target_type ?? "letter";
  const target_id = (input.target_id ?? "").trim();
  const channel = input.channel ?? "copy_link";

  if (!target_id) return bad(400, "缺少 target_id");

  const allowedChannels = ["wechat", "wechat_moments", "copy_link"];
  if (!allowedChannels.includes(channel)) return bad(400, "无效 channel");

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("shares").insert({
      target_type,
      target_id,
      channel,
      user_id: user?.id ?? null,
    });
  } catch {
    // 记录失败不影响
  }

  return NextResponse.json({ ok: true });
}

// GET = get share counts for a target
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const target_type = searchParams.get("target_type") || "letter";
  const target_id = searchParams.get("target_id") || "";

  if (!target_id) return bad(400, "缺少 target_id");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shares")
    .select("channel")
    .eq("target_type", target_type)
    .eq("target_id", target_id);

  if (error) return bad(500, error.message);

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.channel] = (counts[row.channel] ?? 0) + 1;
  }

  return NextResponse.json({
    total: (data ?? []).length,
    byChannel: counts,
  });
}
