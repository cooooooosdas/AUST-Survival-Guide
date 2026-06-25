import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function bad(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

// POST = moderate (approve/reject) or pin/unpin
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
    action?: "moderate" | "pin";
    id?: number;
    status?: string;
    pinned?: boolean;
  };

  if (input.action === "moderate" && input.id && input.status) {
    const { error } = await supabase
      .from("comments")
      .update({ status: input.status })
      .eq("id", input.id);
    if (error) return bad(500, error.message);
    return NextResponse.json({ ok: true });
  }

  if (input.action === "pin" && input.id !== undefined && input.pinned !== undefined) {
    const { error } = await supabase
      .from("comments")
      .update({
        pinned: input.pinned,
        pinned_at: input.pinned ? new Date().toISOString() : null,
      })
      .eq("id", input.id);
    if (error) return bad(500, error.message);
    return NextResponse.json({ ok: true });
  }

  return bad(400, "无效操作");
}
