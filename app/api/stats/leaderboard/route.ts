import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  // Group by target_type
  const leaderboard: Record<string, typeof data> = {};
  for (const row of data ?? []) {
    if (!leaderboard[row.target_type]) {
      leaderboard[row.target_type] = [];
    }
    leaderboard[row.target_type].push(row);
  }

  return NextResponse.json({ leaderboard });
}
