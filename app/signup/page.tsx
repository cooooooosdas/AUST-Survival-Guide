import Link from "next/link";
import { MailCheck, ArrowRight } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import AuthForm from "@/components/auth/AuthForm";
import AuthNotice from "@/components/auth/AuthNotice";

export const metadata = { title: "注册" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { error, ok } = await searchParams;
  return (
    <AuthShell>
      {ok === "1" && !error ? (
        <div className="auth-success">
          <MailCheck size={40} className="text-primary" aria-hidden />
          <span className="eyebrow">还有一步</span>
          <h1>去邮箱确认一下吧</h1>
          <p role="status">
            注册请求已提交。请查收确认邮件，点击其中的链接激活账号。
          </p>
          <ol>
            <li>打开注册时使用的邮箱。</li>
            <li>找到注册邮件，点击确认链接。</li>
            <li>确认后回到这里登录。</li>
          </ol>
          <p className="field-help">
            没有收到？先检查垃圾邮件，稍等几分钟。如果你已注册过，可以直接登录。
          </p>
          <Link href="/login" className="ui-button ui-button-primary">
            前往登录
            <ArrowRight size={18} aria-hidden />
          </Link>
          <Link href="/signup" className="auth-text-link">
            邮箱填错了？重新注册
          </Link>
        </div>
      ) : (
        <>
          <span className="eyebrow">很高兴认识你</span>
          <h1>在这里，开始连接</h1>
          <p className="auth-description">
            一个账号，收藏、学习，也分享你的大学生活。
          </p>
          <div className="auth-switch">
            <span>已经有账号？</span>
            <Link href="/login">
              前往登录 <span aria-hidden>↗</span>
            </Link>
          </div>
          <AuthNotice error={error} />
          <AuthForm mode="signup" />
        </>
      )}
    </AuthShell>
  );
}
