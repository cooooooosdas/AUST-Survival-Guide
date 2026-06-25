import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function bad(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

// PATCH = update a question (answer, publish, change status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return bad(400, "请求体不是合法 JSON");
  }

  const input = body as {
    reply?: string;
    status?: string;
    is_public?: boolean;
  };

  const updates: Record<string, unknown> = {};
  if (input.reply !== undefined) {
    updates.reply = input.reply.trim() || null;
    updates.replied_at = updates.reply ? new Date().toISOString() : null;
  }
  if (input.status) updates.status = input.status;
  if (input.is_public !== undefined) updates.is_public = input.is_public;

  const supabase = await createClient();
  const { error } = await supabase
    .from("questions")
    .update(updates)
    .eq("id", Number(id));

  if (error) return bad(500, error.message);

  return NextResponse.json({ ok: true });
}

// DELETE = remove a question
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", Number(id));

  if (error) return bad(500, error.message);
  return NextResponse.json({ ok: true });
}
