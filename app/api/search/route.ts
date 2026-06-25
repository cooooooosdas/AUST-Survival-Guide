import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { search, TYPE_LABEL, TYPE_CLASS } from "@/lib/search";

function bad(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

// POST = perform search (also logs the query)
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return bad(400, "请求体不是合法 JSON");
  }

  const input = body as { q?: string };
  const q = (input.q ?? "").trim();
  if (!q) return bad(400, "搜索词不能为空");

  const results = search(q);

  // 异步记录搜索日志（不阻塞响应）
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient();
      const normalized = q.toLowerCase().replace(/\s+/g, " ").trim();
      const { data: existing } = await supabase
        .from("search_logs")
        .select("id, count")
        .eq("normalized", normalized)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("search_logs")
          .update({ count: (existing.count ?? 0) + 1, last_searched_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await supabase.from("search_logs").insert({ query: q, normalized });
      }
    } catch {
      // 记录失败不影响搜索
    }
  }

  return NextResponse.json({
    q,
    results: results.map((r) => ({
      ...r,
      typeLabel: TYPE_LABEL[r.type],
      typeClass: TYPE_CLASS[r.type],
    })),
  });
}

// GET = hot searches
export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ hot: [] });
  }
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("search_logs")
      .select("query, count")
      .order("count", { ascending: false })
      .limit(10);
    return NextResponse.json({ hot: data ?? [] });
  } catch {
    return NextResponse.json({ hot: [] });
  }
}
