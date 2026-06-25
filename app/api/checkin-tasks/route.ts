import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("checkin_tasks")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch checkin tasks:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
