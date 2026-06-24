import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_BYTES = 2 * 1024 * 1024;

function bad(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    // 先鉴权
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return bad(401, "未登录，请先登录后再上传头像");
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return bad(400, "未选择文件");
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return bad(415, "仅支持 JPG / PNG / WebP / GIF 格式");
    }
    if (file.size > MAX_BYTES) {
      return bad(413, `文件 ${(file.size / 1024).toFixed(0)} KB，超过 2 MB 限制`);
    }

    const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "bin";
    const ext = ["jpg", "jpeg", "png", "webp", "gif"].includes(rawExt)
      ? rawExt
      : "bin";
    const objectPath = `${user.id}/${randomUUID()}.${ext}`;

    // 清理旧头像
    const oldUrl = formData.get("old_url")?.toString();
    if (oldUrl) {
      try {
        const match = oldUrl.match(/\/storage\/v1\/object\/public\/avatars\/(.+)$/);
        if (match?.[1]) {
          await supabase.storage.from("avatars").remove([match[1]]);
        }
      } catch {
        // 清理失败不阻塞
      }
    }

    // 上传
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(objectPath, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: "0",
      });

    if (uploadError) {
      const msg = uploadError.message.toLowerCase();
      // 给用户可操作的提示
      if (msg.includes("bucket") || msg.includes("not found") || msg.includes("404")) {
        return bad(
          500,
          "Storage bucket 不存在：请在 Supabase Dashboard → SQL Editor 执行 supabase/migrations/0002_storage_avatars.sql"
        );
      }
      if (msg.includes("row-level security") || msg.includes("permission") || msg.includes("policy")) {
        return bad(500, "存储权限不足：请检查 RLS 策略是否已创建");
      }
      return bad(500, `上传失败：${uploadError.message}`);
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(objectPath);
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

    return NextResponse.json({ url: publicUrl });
  } catch (e) {
    return bad(500, e instanceof Error ? e.message : "服务器异常");
  }
}
