import CommentBoard from "@/components/CommentBoard";
import { createClient } from "@/lib/supabase/server";
import type { Comment } from "@/lib/types";

export const metadata = { title: "留言区" };

async function loadBoardData() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { comments: [] as Comment[], userId: null as string | null, ready: false };
  }
  try {
    const supabase = await createClient();
    const [{ data: comments, error: commentsError }, { data: { user } }] = await Promise.all([
      supabase
        .from("comments_with_author")
        .select("*")
        .eq("target_type", "global")
        .eq("target_id", "main")
        .order("created_at", { ascending: false })
        .limit(200),
      supabase.auth.getUser(),
    ]);
    if (commentsError) {
      return { comments: [] as Comment[], userId: null as string | null, ready: false };
    }
    return {
      comments: (comments ?? []) as Comment[],
      userId: user?.id ?? null,
      ready: true,
    };
  } catch {
    return { comments: [] as Comment[], userId: null as string | null, ready: false };
  }
}

export default async function BoardPage() {
  const { comments, userId, ready } = await loadBoardData();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl md:text-3xl font-semibold text-primary">留言区</h1>
      <p className="mt-3 text-sm text-muted">
        想说什么都可以——吐槽、提问、分享经验。请保持基本礼貌，过激内容会被删掉。
      </p>

      <div className="mt-10">
        {ready ? (
          <CommentBoard
            initial={comments}
            targetType="global"
            targetId="main"
            currentUserId={userId}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-bg-alt p-10 text-center">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-sm font-medium text-text">留言区正在准备中</p>
            <p className="mt-2 text-xs text-muted">
              等 Supabase 配置好后，这里就会开放留言功能。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
