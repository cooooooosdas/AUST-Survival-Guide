"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Bookmark, UserRound, PenLine, History, LogOut } from "lucide-react";
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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  if (!user) {
    return (
      <div className="flex shrink-0 items-center gap-2 text-sm">
        <Link
          href="/login"
          className="motion-press whitespace-nowrap text-muted transition-colors hover:text-primary"
        >
          登录
        </Link>
        <Link
          href="/signup"
          className="motion-press whitespace-nowrap rounded-md bg-primary px-3 py-1.5 text-sm text-white transition-colors hover:bg-primary-hover"
        >
          注册
        </Link>
      </div>
    );
  }

  const name = user.displayName || user.email?.split("@")[0] || "同学";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="motion-press flex items-center gap-2 rounded-lg px-1.5 py-1 text-sm text-muted transition-colors hover:bg-bg-alt hover:text-primary"
      >
        <Avatar
          src={user.avatarUrl}
          name={user.displayName ?? undefined}
          email={user.email ?? undefined}
          size={28}
        />
        <span className="hidden sm:inline">{name}</span>
        <ChevronDown
          className="h-3.5 w-3.5 shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {open && (
        <div className="menu-pop absolute right-0 top-full z-50 mt-1.5 w-48 overflow-hidden rounded-xl border border-border bg-bg shadow-lg">
          <div className="py-1">
            <Link
              href="/library"
              className="motion-press flex items-center gap-2 px-3 py-2 text-sm text-text transition-colors hover:bg-primary/5 hover:text-primary"
              onClick={() => setOpen(false)}
            >
              <Bookmark className="h-4 w-4 text-muted" />
              阅读中心
            </Link>
            <Link
              href="/profile"
              className="motion-press flex items-center gap-2 px-3 py-2 text-sm text-text transition-colors hover:bg-primary/5 hover:text-primary"
              onClick={() => setOpen(false)}
            >
              <UserRound className="h-4 w-4 text-muted" />
              个人设置
            </Link>
            <Link
              href="/contribute"
              className="motion-press flex items-center gap-2 px-3 py-2 text-sm text-text transition-colors hover:bg-primary/5 hover:text-primary"
              onClick={() => setOpen(false)}
            >
              <PenLine className="h-4 w-4 text-muted" />
              投稿中心
            </Link>
            <Link
              href="/changelog"
              className="motion-press flex items-center gap-2 px-3 py-2 text-sm text-text transition-colors hover:bg-primary/5 hover:text-primary"
              onClick={() => setOpen(false)}
            >
              <History className="h-4 w-4 text-muted" />
              站点动态
            </Link>
            <div className="my-1 border-t border-border" />
            <form action={signOut}>
              <button
                type="submit"
                className="motion-press flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4" />
                退出登录
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}