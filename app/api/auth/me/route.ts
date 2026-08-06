import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/auth/me
 * 客户端查询当前用户 + 是否管理员
 * - 单一数据源：isAdmin 只用 site_admins 表（不再用 NEXT_PUBLIC_ADMIN_USER_ID env）
 * - CommentBoard / Header 等客户端组件用这个端点拿 isAdmin
 */
export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ user: null, isAdmin: false });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ user: null, isAdmin: false });
  }

  const { data: adminRow } = await supabase
    .from("site_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({
    user: { id: user.id, email: user.email ?? null },
    isAdmin: !!adminRow,
  });
}