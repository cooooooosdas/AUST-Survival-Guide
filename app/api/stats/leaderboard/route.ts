import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LETTER_MAP } from "@/lib/letters";

function bad(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  const supabase = await createClient();

  // Get top items per target_type
  const { data, error } = await supabase
    .from("content_stats")
    .select("*")
    .order("total_views", { ascending: false })
    .limit(50);

  if (error) return bad(500, error.message);

  // Collect resource ids we need to resolve
  const resourceIds = (data ?? [])
    .filter((row) => row.target_type === "resource" && row.target_id)
    .map((row) => row.target_id);

  // Batch-fetch resource titles in one query
  const resourceTitleMap: Record<string, string> = {};
  if (resourceIds.length > 0) {
    const { data: resources } = await supabase
      .from("resources")
      .select("id, title")
      .in("id", resourceIds);
    for (const r of resources ?? []) {
      // content_stats.target_id 是 text，Supabase 返回的 id 是 number，
      // 作为对象键时必须统一为字符串，否则 resourceTitleMap[row.target_id] 永远匹配不上
      resourceTitleMap[String(r.id)] = r.title;
    }
  }

  // Build enriched leaderboard grouped by target_type
  const leaderboard: Record<string, Array<{
    target_id: string;
    total_views: number;
    title: string;
    href: string;
  }>> = {};

  for (const row of data ?? []) {
    const key = row.target_type;
    if (!leaderboard[key]) leaderboard[key] = [];

    let title = row.target_id;
    let href = "#";

    if (key === "letter") {
      const letter = LETTER_MAP[row.target_id];
      if (letter) {
        title = letter.title;
        href = `/letters/${letter.slug}`;
      }
    } else if (key === "resource") {
      title = resourceTitleMap[row.target_id] ?? row.target_id;
      href = `/resources/${row.target_id}`;
    }

    leaderboard[key].push({
      target_id: row.target_id,
      total_views: row.total_views,
      title,
      href,
    });
  }

  return NextResponse.json({ leaderboard });
}
