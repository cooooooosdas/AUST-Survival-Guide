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
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {
            // route handler 不能写回 cookie，只做鉴权
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "未选择文件" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "仅支持 JPG / PNG / WebP / GIF" },
        { status: 415 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `文件 ${(file.size / 1024).toFixed(0)} KB，超过 2 MB 限制` },
        { status: 413 }
      );
    }

    // 用随机 UUID 做文件名，避免浏览器缓存命中旧图
    const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "bin";
    const ext = ["jpg", "jpeg", "png", "webp", "gif"].includes(rawExt)
      ? rawExt
      : "bin";
    const path = `${user.id}/${randomUUID()}.${ext}`;

    // 删掉旧头像（节省 bucket 空间）
    const oldUrl = formData.get("old_url")?.toString();
    if (oldUrl) {
      try {
        // URL 形如 .../storage/v1/object/public/avatars/{path}
        const match = oldUrl.match(/\/storage\/v1\/object\/public\/avatars\/(.+)$/);
        if (match?.[1]) {
          await supabase.storage.from("avatars").remove([match[1]]);
        }
      } catch {
        // 清理失败不阻塞上传
      }
    }

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: "0",
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `上传失败：${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`; // 缓存 bust

    return NextResponse.json({ url: publicUrl, path });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务器异常" },
      { status: 500 }
    );
  }
}
