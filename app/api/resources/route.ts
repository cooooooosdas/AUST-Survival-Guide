import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

function bad(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

const CATEGORIES = [
  "high-math",
  "cs-courseware",
  "software",
  "review",
  "latex",
  "other",
];

const CATEGORY_LABEL: Record<string, string> = {
  "high-math": "高数笔记",
  "cs-courseware": "计算机课件",
  software: "软件安装包",
  review: "期末复习",
  latex: "LaTeX模板",
  other: "其他",
};

const ALLOWED_MIME = new Set([
  "application/pdf",
  "text/markdown",
  "text/plain",
  "application/zip",
  "application/x-zip-compressed",
  "application/x-7z-compressed",
  "application/x-rar-compressed",
  "application/octet-stream",
  "application/x-msi",
  "application/vnd.microsoft.portable-executable",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const MAX_BYTES = 100 * 1024 * 1024;

// ===== LIST =====
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;

  let q = supabase
    .from("resources")
    .select("id, title, description, category, file_name, file_size, file_type, download_count, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (category && CATEGORIES.includes(category)) {
    q = q.eq("category", category);
  }

  const { data, error } = await q;
  if (error) return bad(500, error.message);

  return NextResponse.json({
    resources: (data ?? []).map((r) => ({
      ...r,
      categoryLabel: CATEGORY_LABEL[r.category] ?? "其他",
    })),
  });
}

// ===== UPLOAD =====
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return bad(401, "未登录");

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return bad(400, "未选择文件");

  if (file.size > MAX_BYTES) {
    return bad(413, `文件 ${(file.size / 1024 / 1024).toFixed(1)} MB，超过 100 MB 限制`);
  }
  if (!ALLOWED_MIME.has(file.type) && file.type !== "") {
    return bad(415, "不支持的文件类型");
  }

  const title = (formData.get("title") as string | null)?.trim() || file.name;
  const description = (formData.get("description") as string | null)?.trim() || null;
  const category = (formData.get("category") as string | null)?.trim();
  if (!CATEGORIES.includes(category ?? "")) {
    return bad(400, "category 必须是 " + CATEGORIES.join("/"));
  }

  // 上传到 Storage
  const objectPath = `${user.id}/${randomUUID()}_${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("resources")
    .upload(objectPath, file, {
      upsert: true,
      contentType: file.type || "application/octet-stream",
      cacheControl: "0",
    });
  if (uploadError) return bad(500, uploadError.message);

  // 写 metadata
  const { error: insertError } = await supabase.from("resources").insert({
    title,
    description,
    category: category!,
    file_name: file.name,
    file_size: file.size,
    file_type: file.type || null,
    storage_path: objectPath,
    uploaded_by: user.id,
  });
  if (insertError) {
    // 清理已上传的文件
    await supabase.storage.from("resources").remove([objectPath]);
    return bad(500, insertError.message);
  }

  return NextResponse.json({ ok: true });
}
