import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Admin review endpoint - uses service role via server client
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const body = await req.json();
  const { status, review_note } = body;

  if (!["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "无效的状态" }, { status: 400 });
  }

  const { error } = await supabase
    .from("friend_links")
    .update({
      status,
      review_note: review_note?.trim() || null,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Failed to review friend link:", error);
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { error } = await supabase
    .from("friend_links")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete friend link:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
