"use client";

import { useEffect } from "react";
import Link from "next/link";

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
      <p className="text-sm uppercase tracking-[0.2em] text-accent">error</p>
      <h1 className="mt-3 text-3xl font-semibold text-primary">出错了</h1>
      <p className="mt-4 text-sm text-muted">
        页面加载时发生意外。这通常是临时问题。
      </p>
      {error?.digest && (
        <p className="mt-2 font-mono text-xs text-muted">
          digest: {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          再试一次
        </button>
        <Link
          href="/"
          className="rounded-md border border-border bg-bg px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
        >
          回首页
        </Link>
      </div>
    </div>
  );
}
