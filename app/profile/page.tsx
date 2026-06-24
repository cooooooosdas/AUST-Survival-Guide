import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileClient from "./ProfileClient";

export const metadata = { title: "个人设置" };

const PRESET_SEEDS = [
  "Felix", "Aneka", "Zack", "Luna", "Leo",
  "Mimi", "Rocky", "Shadow", "Snow", "Pudding",
];

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const displayName = profile?.display_name ?? user.user_metadata?.name ?? "";
  const avatarUrl = profile?.avatar_url ?? null;

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
    </div>
  );
}
