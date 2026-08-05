import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * 统一 admin 鉴权
 *
 * - API route 用 requireAdminApi()：未登录 401，非管理员 403
 * - Server Component 用 requireAdminPage()：未登录跳登录页，非管理员跳首页
 */

export type AdminUser = { id: string; email: string | null };

async function checkAdmin(): Promise<
  | { ok: true; user: AdminUser }
  | { ok: false; reason: "unauthenticated" | "unauthorized" }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, reason: "unauthenticated" };

  const { data: adminRow } = await supabase
    .from("site_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) return { ok: false, reason: "unauthorized" };

  return { ok: true, user: { id: user.id, email: user.email ?? null } };
}

/** API route 用：返回 null 表示通过，返回 NextResponse 表示拒绝 */
export async function requireAdminApi(): Promise<NextResponse | null> {
  const result = await checkAdmin();
  if (result.ok) return null;
  if (result.reason === "unauthenticated") {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  return NextResponse.json({ error: "无权操作" }, { status: 403 });
}

/** Server Component 用：返回 user 表示通过，否则调用 redirect() */
export async function requireAdminPage(): Promise<AdminUser> {
  const result = await checkAdmin();
  if (result.ok) return result.user;

  if (result.reason === "unauthenticated") {
    redirect("/login?next=/admin");
  }
  // 非管理员：跳首页（安全考虑不暴露 admin 路径）
  redirect("/");
}