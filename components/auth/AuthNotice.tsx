const messages: Record<string, string> = {
  "Invalid login credentials": "邮箱或密码不正确，请检查后重试。",
  "Email not confirmed": "邮箱尚未确认，请先打开注册邮件中的确认链接。",
  "User already registered": "这个邮箱已经注册过了，请前往登录。",
  "Email rate limit exceeded":
    "邮件发送过于频繁，请稍后再试，并检查收件箱和垃圾邮件。",
  "Signup requires a valid password": "请输入有效的密码后重试。",
};

export default function AuthNotice({ error }: { error?: string }) {
  if (!error) return null;
  // searchParams 已解码；重复解码会使包含百分号的错误信息导致页面崩溃。
  const message =
    messages[error] ??
    (/provider|oauth|supabase|client id|secret/i.test(error)
      ? "GitHub 登录暂时不可用，请使用邮箱登录，或稍后重试。"
      : "暂时无法完成操作，请检查填写内容后重试。如果仍然失败，请到留言区反馈。");
  return (
    <div role="alert" className="auth-notice auth-notice-error">
      {message}
    </div>
  );
}
