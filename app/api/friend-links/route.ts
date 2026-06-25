import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("friend_links")
    .select("id, name, url, description, avatar_url, submitted_at")
    .eq("status", "approved")
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch friend links:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const body = await req.json();
  const { name, url, description } = body;

  if (!name || !url) {
    return NextResponse.json({ error: "名称和链接为必填项" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("friend_links")
    .insert({
      name: name.trim(),
      url: url.trim(),
      description: description?.trim() || null,
      submitted_by: user.id,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to submit friend link:", error);
    return NextResponse.json({ error: "提交失败" }, { status: 500 });
  }

  return NextResponse.json({ id: data.id, message: "提交成功，等待审核" }, { status: 201 });
}
