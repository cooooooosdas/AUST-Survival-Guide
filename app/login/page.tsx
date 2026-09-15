import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import AuthForm from "@/components/auth/AuthForm";
import AuthNotice from "@/components/auth/AuthNotice";

export const metadata = { title: "登录" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  const returnTo =
    next?.startsWith("/") && !next.startsWith("//") && !next.includes("\\")
      ? next
      : "/";
  return (
    <AuthShell>
      <span className="eyebrow">欢迎回来</span>
      <h1>继续你的安理生活</h1>
      <p className="auth-description">登录后，收藏好内容，留下你的经验。</p>
      <div className="auth-switch">
        <span>还没有账号？</span>
        <Link href="/signup">
          创建账号 <span aria-hidden>↗</span>
        </Link>
      </div>
      <AuthNotice error={error} />
      <AuthForm mode="login" returnTo={returnTo} />
    </AuthShell>
  );
}
