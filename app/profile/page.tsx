import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileClient from "./ProfileClient";
import { LETTER_MAP } from "@/lib/letters";

export const metadata = { title: "个人设置" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: favorites }] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("favorites")
      .select("target_id, created_at")
      .eq("user_id", user.id)
      .eq("target_type", "letter")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const displayName = profile?.display_name ?? user.user_metadata?.name ?? "";
  const avatarUrl = profile?.avatar_url ?? null;

  const favLetters = (favorites ?? [])
    .map((f) => LETTER_MAP[f.target_id])
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl md:text-3xl font-semibold text-primary">个人设置</h1>
      <p className="mt-2 text-sm text-muted">设置你的头像和昵称，留言时就会显示出来。</p>

      <div className="mt-10">
        <ProfileClient
          initialAvatarUrl={avatarUrl}
          initialDisplayName={displayName}
          userEmail={user.email ?? ""}
        />
      </div>

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="text-xl font-semibold text-primary">我的收藏</h2>
        <p className="mt-1 text-sm text-muted">
          {favLetters.length === 0
            ? "还没收藏任何信件。去学长来信页点击 ☆ 收藏吧。"
            : `共收藏 ${favLetters.length} 封信`}
        </p>

        {favLetters.length > 0 && (
          <ul className="mt-6 space-y-3">
            {favLetters.map((l) => (
              <li key={l.slug}>
                <a
                  href={`/letters/${l.slug}`}
                  className="group flex items-start justify-between gap-4 rounded-xl border border-border bg-bg-alt p-4 transition-colors hover:border-primary/30 hover:bg-bg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary group-hover:underline">
                      {l.title}
                    </p>
                    <p className="mt-1 text-xs text-muted line-clamp-1">{l.excerpt}</p>
                  </div>
                  <time className="shrink-0 text-xs text-muted">
                    {l.date}
                  </time>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
