import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CATEGORY_LABEL: Record<string, string> = {
  "high-math": "高数笔记",
  "cs-courseware": "计算机课件",
  software: "软件安装包",
  review: "期末复习",
  latex: "LaTeX模板",
  other: "其他",
};

function bad(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // 查找资源
  const { data: resource, error } = await supabase
    .from("resources")
    .select("*")
    .eq("id", Number(id))
    .maybeSingle();

  if (error || !resource) {
    return bad(404, "资源不存在");
  }

  // 获取下载 URL
  const urlResult = await supabase.storage
    .from("resources")
    .createSignedUrl(resource.storage_path, 300); // 5分钟有效

  const signedUrl = urlResult.data?.signedUrl ?? null;
  if (!signedUrl) {
    return bad(500, "无法生成下载链接");
  }

  // 增加下载计数
  await supabase
    .from("resources")
    .update({ download_count: (resource.download_count ?? 0) + 1 })
    .eq("id", Number(id));

  // 跳转到 signed URL（让浏览器直接下载）
  return NextResponse.redirect(signedUrl, 302);
}
