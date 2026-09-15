"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { login, signup, loginWithGitHub } from "@/app/auth/actions";

function Fields({ mode }: { mode: "login" | "signup" }) {
  const { pending } = useFormStatus();
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const isSignup = mode === "signup";
  return (
    <fieldset disabled={pending} className="auth-fields">
      {isSignup && (
        <div>
          <label htmlFor="auth-name">
            怎么称呼你 <span>（可选）</span>
          </label>
          <input
            id="auth-name"
            name="display_name"
            autoComplete="nickname"
            maxLength={32}
            placeholder="给自己取个昵称"
          />
        </div>
      )}
      <div>
        <label htmlFor="auth-email">邮箱</label>
        <input
          id="auth-email"
          name="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="auth-password">密码</label>
        <div className="password-input">
          <input
            id="auth-password"
            name="password"
            type={visible ? "text" : "password"}
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
            minLength={isSignup ? 6 : undefined}
            aria-describedby="password-help"
            placeholder={isSignup ? "设置至少 6 位密码" : "输入你的密码"}
            onKeyUp={(event) => setCapsLock(event.getModifierState("CapsLock"))}
            onKeyDown={(event) =>
              setCapsLock(event.getModifierState("CapsLock"))
            }
            onBlur={() => setCapsLock(false)}
          />
          <button
            type="button"
            aria-label={visible ? "隐藏密码" : "显示密码"}
            aria-pressed={visible}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <p id="password-help" className="field-help" aria-live="polite">
          {capsLock
            ? "大写锁定已开启，请注意密码大小写。"
            : isSignup
              ? "至少 6 位，建议混合使用字母、数字与符号。"
              : "使用注册时的邮箱和密码登录。"}
        </p>
      </div>
      <button
        className="ui-button ui-button-primary"
        type="submit"
        aria-disabled={pending}
        aria-label={pending ? "正在提交，请稍候" : isSignup ? "创建账号" : "登录"}
      >
        {pending ? (
          <LoaderCircle size={18} className="animate-spin" aria-hidden />
        ) : null}
        <span role="status">
          {pending
            ? isSignup
              ? "正在创建账号…"
              : "正在登录…"
            : isSignup
              ? "创建账号"
              : "登录"}
        </span>
        {!pending && <ArrowRight size={18} aria-hidden />}
      </button>
    </fieldset>
  );
}

function GitHubButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="ui-button ui-button-secondary w-full"
      disabled={pending}
      aria-label={pending ? "正在前往 GitHub" : "使用 GitHub 继续"}
    >
      {pending ? (
        <LoaderCircle className="animate-spin" size={18} aria-hidden />
      ) : (
        <span className="font-mono text-xs" aria-hidden>
          GH
        </span>
      )}
      <span role="status">
        {pending ? "正在前往 GitHub…" : "使用 GitHub 继续"}
      </span>
    </button>
  );
}

export default function AuthForm({
  mode,
  returnTo = "/",
}: {
  mode: "login" | "signup";
  returnTo?: string;
}) {
  return (
    <>
      <form action={mode === "login" ? login : signup} className="mt-7">
        <input type="hidden" name="next" value={returnTo} />
        <Fields mode={mode} />
      </form>
      <div className="auth-divider">
        <span />
        或使用已有账号
        <span />
      </div>
      <form action={loginWithGitHub}>
        <input type="hidden" name="next" value={returnTo} />
        <GitHubButton />
      </form>
      <p className="auth-browse-note">
        暂时不想登录？
        <Link href="/#start-guide">
          先逛逛公开内容
          <ArrowRight size={14} aria-hidden />
        </Link>
      </p>
    </>
  );
}
