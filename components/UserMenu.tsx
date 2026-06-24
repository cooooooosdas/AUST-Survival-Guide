"use client";

import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import Avatar from "@/components/Avatar";

type Props = {
  user: {
    email: string | null;
    displayName: string | null;
    avatarUrl: string | null;
  } | null;
};

export default function UserMenu({ user }: Props) {
  if (!user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <Link
          href="/login"
          className="text-muted transition-colors hover:text-primary"
        >
          登录
        </Link>
        <Link
          href="/signup"
          className="rounded-md bg-primary px-3 py-1.5 text-white transition-colors hover:bg-primary-hover"
        >
          注册
        </Link>
      </div>
    );
  }

  const name = user.displayName || user.email?.split("@")[0] || "同学";

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/profile"
        className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary"
        title="个人设置"
      >
        <Avatar
          src={user.avatarUrl}
          name={user.displayName ?? undefined}
          email={user.email ?? undefined}
          size={28}
        />
        <span className="hidden sm:inline">{name}</span>
      </Link>
      <form action={signOut}>
        <button
          type="submit"
          className="rounded-md border border-border bg-bg px-3 py-1.5 text-xs text-text transition-colors hover:border-primary hover:text-primary"
        >
          退出
        </button>
      </form>
    </div>
  );
}
