import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function bad(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

const CATEGORY_LABEL: Record<string, string> = {
  general: "综合",
  "high-math": "高数问题",
  "course-select": "选课疑问",
  software: "软件安装",
  "ai-tools": "AI工具使用",
};

// GET = list questions
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const category = searchParams.get("category") || undefined;

  let q = supabase
    .from("questions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (status) q = q.eq("status", status);
  if (category) q = q.eq("category", category);

  const { data, error } = await q;
  if (error) return bad(500, error.message);

  return NextResponse.json({
    questions: (data ?? []).map((q) => ({ ...q, categoryLabel: CATEGORY_LABEL[q.category as keyof typeof CATEGORY_LABEL] ?? "综合" })),
  });
}

// POST = submit question (anonymous)
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return bad(400, "请求体不是合法 JSON");
  }

  const input = body as {
    content?: string;
    category?: string;
  };

  const content = (input.content ?? "").trim();
  if (!content) return bad(400, "问题不能为空");
  if (content.length > 2000) return bad(400, "问题太长（≤ 2000 字）");

  const allowedCategories = ["general", "high-math", "course-select", "software", "ai-tools"];
  const category = allowedCategories.includes(input.category ?? "") ? input.category : "general";

  const supabase = await createClient();
  const { error } = await supabase.from("questions").insert({
    content,
    category,
    status: "pending",
    is_public: false,
  });

  if (error) return bad(500, error.message);

  return NextResponse.json({ ok: true, categoryLabel: CATEGORY_LABEL[category as keyof typeof CATEGORY_LABEL] });
}
