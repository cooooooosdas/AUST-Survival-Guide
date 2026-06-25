import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function bad(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

// GET = list changelogs
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? 20);

  const { data, error } = await supabase
    .from("changelogs")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return bad(500, error.message);

  return NextResponse.json({ changelogs: data ?? [] });
}

// POST = create changelog (admin)
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
    title?: string;
    content?: string;
    category?: string;
  };

  if (!input.title || !input.content) return bad(400, "标题和内容不能为空");

  const allowedCategories = ["general", "high-math", "software", "letter", "feature"];
  const category = allowedCategories.includes(input.category ?? "") ? input.category : "general";

  const { data, error } = await supabase
    .from("changelogs")
    .insert({
      title: input.title.trim(),
      content: input.content.trim(),
      category,
      is_published: true,
    })
    .select("*")
    .single();

  if (error) return bad(500, error.message);

  return NextResponse.json({ changelog: data });
}
