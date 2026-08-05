"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-light text-accent">
          <AlertCircle className="h-5 w-5" strokeWidth={2} />
        </span>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent">
            something went wrong
          </p>
          <h1 className="mt-0.5 font-serif text-2xl font-semibold text-text">
            加载出错了
          </h1>
        </div>
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">
        页面渲染时发生了意外。这通常是临时问题，刷新一下通常就好。
      </p>

      {error?.digest && (
        <p className="mt-3 rounded-md border border-dashed border-border bg-bg-alt px-3 py-2 font-mono text-xs text-muted">
          错误追踪：{error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="motion-press inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
          再试一次
        </button>
        <Link
          href="/"
          className="motion-press inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-4 py-2 text-sm text-text-secondary transition-colors hover:border-primary hover:text-primary"
        >
          <Home className="h-3.5 w-3.5" strokeWidth={2} />
          回首页
        </Link>
      </div>

      <p className="mt-10 border-t border-border pt-4 font-mono text-[11px] text-muted">
        如果持续出错，请到{" "}
        <Link href="/board" className="text-primary underline-offset-4 hover:underline">
          留言区
        </Link>{" "}
        反馈一下，方便排查。
      </p>
    </div>
  );
}