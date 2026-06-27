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

// GET = list all FAQ items (admin)
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return bad(401, "未登录");

  const { data, error } = await supabase
    .from("faq_items")
    .select("*")
    .order("sort_order", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) return bad(500, error.message);

  return NextResponse.json({
    items: (data ?? []).map((i) => ({
      ...i,
      categoryLabel: CATEGORY_LABEL[i.category as keyof typeof CATEGORY_LABEL] ?? "综合",
    })),
  });
}

// POST = create FAQ item (admin)
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
    question?: string;
    answer?: string;
    category?: string;
    sort_order?: number;
    is_published?: boolean;
  };

  if (!input.question || !input.answer) return bad(400, "问题和答案不能为空");

  const allowed = ["general", "high-math", "course-select", "software", "ai-tools"];
  const category = allowed.includes(input.category ?? "") ? input.category : "general";

  const { data, error } = await supabase
    .from("faq_items")
    .insert({
      question: input.question.trim(),
      answer: input.answer.trim(),
      category,
      sort_order: input.sort_order ?? 0,
      is_published: input.is_published ?? true,
    })
    .select("*")
    .single();

  if (error) return bad(500, error.message);

  return NextResponse.json({
    item: { ...data, categoryLabel: CATEGORY_LABEL[category as keyof typeof CATEGORY_LABEL] },
  });
}

// PATCH = update FAQ item (admin)
export async function PATCH(request: NextRequest) {
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
    id: number;
    question?: string;
    answer?: string;
    category?: string;
    sort_order?: number;
    is_published?: boolean;
  };

  if (!input.id) return bad(400, "缺少 id");

  const allowed = ["general", "high-math", "course-select", "software", "ai-tools"];
  const category = input.category && allowed.includes(input.category) ? input.category : undefined;

  const update: Record<string, unknown> = {};
  if (input.question !== undefined) update.question = input.question.trim();
  if (input.answer !== undefined) update.answer = input.answer.trim();
  if (category) update.category = category;
  if (input.sort_order !== undefined) update.sort_order = input.sort_order;
  if (input.is_published !== undefined) update.is_published = input.is_published;

  const { data, error } = await supabase
    .from("faq_items")
    .update(update)
    .eq("id", input.id)
    .select("*")
    .single();

  if (error) return bad(500, error.message);

  return NextResponse.json({
    item: { ...data, categoryLabel: CATEGORY_LABEL[data.category as keyof typeof CATEGORY_LABEL] ?? "综合" },
  });
}

// DELETE = delete FAQ item (admin)
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return bad(401, "未登录");

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!id) return bad(400, "缺少 id");

  const { error } = await supabase.from("faq_items").delete().eq("id", id);
  if (error) return bad(500, error.message);

  return NextResponse.json({ ok: true });
}
