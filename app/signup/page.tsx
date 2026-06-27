import Link from "next/link";
import { signup, loginWithGitHub } from "@/app/auth/actions";
import ClearQueryParam from "@/components/ClearQueryParam";

export const metadata = { title: "注册" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { error, ok } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-serif font-semibold text-text">注册</h1>
      <p className="mt-2 text-sm text-muted">已经有账号？<Link href="/login" className="text-primary underline-offset-4 hover:underline">去登录</Link></p>

      {ok && <ClearQueryParam param="ok" />}

      {ok && (
        <div role="status" className="mt-6 rounded-md border border-accent bg-accent/20 px-4 py-3 text-sm text-primary">
          注册邮件已发送，去邮箱查收点确认链接即可。
        </div>
      )}

      {error && (
        <div role="alert" className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      <form action={signup} className="mt-8 space-y-4">
        <div>
          <label htmlFor="signup-name" className="block text-sm text-muted mb-1">昵称（可选）</label>
          <input
            id="signup-name"
            name="display_name"
            type="text"
            maxLength={32}
            className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="signup-email" className="block text-sm text-muted mb-1">邮箱</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="signup-password" className="block text-sm text-muted mb-1">密码（至少 6 位）</label>
          <input
            id="signup-password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-hover active:scale-[0.98]"
        >
          注册
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        <span>或</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={loginWithGitHub}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-text transition-all duration-200 hover:border-primary hover:text-primary active:scale-[0.98]"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
          </svg>
          用 GitHub 注册
        </button>
      </form>
    </div>
  );
}
