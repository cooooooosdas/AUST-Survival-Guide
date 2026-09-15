"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function AuthError({ reset }: { reset: () => void }) {
  return (
    <section className="auth-page py-16" aria-labelledby="auth-error-title">
      <h1 id="auth-error-title" className="font-serif text-2xl font-semibold">
        连接暂时中断了
      </h1>
      <p className="mt-4 text-sm text-text-secondary" role="alert">
        账号服务暂时未能响应。请检查网络后重试，你也可以先浏览公开内容。
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="ui-button ui-button-primary"
        >
          <RefreshCw size={18} aria-hidden />
          重新加载
        </button>
        <Link href="/" className="ui-button ui-button-secondary">
          返回首页
        </Link>
      </div>
    </section>
  );
}
