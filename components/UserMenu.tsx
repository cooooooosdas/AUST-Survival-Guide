"use client";

import Link from "next/link";
import { signOut } from "@/app/auth/actions";

type Props = {
  user: {
    email: string | null;
    displayName: string | null;
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
    <form action={signOut} className="flex items-center gap-3 text-sm">
      <span className="hidden text-muted sm:inline" title={user.email ?? ""}>
        {name}
      </span>
      <button
        type="submit"
        className="rounded-md border border-border bg-bg px-3 py-1.5 text-text transition-colors hover:border-primary hover:text-primary"
      >
        退出
      </button>
    </form>
  );
}
