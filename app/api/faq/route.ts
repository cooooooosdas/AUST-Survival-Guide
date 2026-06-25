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

// GET = list FAQ items
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const q = (searchParams.get("q") || "").trim();

  let query = supabase
    .from("faq_items")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(200);

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) return bad(500, error.message);

  let items = data ?? [];
  if (q) {
    const ql = q.toLowerCase();
    items = items.filter(
      (item) =>
        item.question.toLowerCase().includes(ql) ||
        item.answer.toLowerCase().includes(ql)
    );
  }

  return NextResponse.json({
    items: items.map((i) => ({ ...i, categoryLabel: CATEGORY_LABEL[i.category] ?? "综合" })),
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
    question: string;
    answer: string;
    category?: string;
    source_type?: string;
    source_id?: number;
  };

  if (!input.question || !input.answer) return bad(400, "问题和答案不能为空");

  const allowedCategories = ["general", "high-math", "course-select", "software", "ai-tools"];
  const category = allowedCategories.includes(input.category ?? "") ? input.category : "general";

  const { data, error } = await supabase
    .from("faq_items")
    .insert({
      question: input.question.trim(),
      answer: input.answer.trim(),
      category,
      source_type: input.source_type ?? "manual",
      source_id: input.source_id ?? null,
      is_published: true,
    })
    .select("*")
    .single();

  if (error) return bad(500, error.message);

  return NextResponse.json({ item: { ...data, categoryLabel: CATEGORY_LABEL[category as keyof typeof CATEGORY_LABEL] } });
}
