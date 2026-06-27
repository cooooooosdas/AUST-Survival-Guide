import Link from "next/link";

export const metadata = { title: "隐私政策" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl md:text-3xl font-serif font-semibold text-text">隐私政策</h1>
      <p className="mt-2 text-xs text-muted">
        生效日期：2026-06-27 · 最后更新：2026-06-27
      </p>

      <div className="mt-10 space-y-8 leading-relaxed text-text">
        <section>
          <h2 className="text-lg font-serif font-medium text-text">总则</h2>
          <p className="mt-3 text-sm">
            本站（下称「本站」或「AUST 新生生存指南」，域名 aust.asia）由 coolin 独立运营。
            本政策说明本站收集哪些数据、为何收集、如何保护。继续使用本站即视为同意本政策。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-serif font-medium text-text">本站收集的数据</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>
              <strong className="text-text">浏览器本地存储（localStorage）</strong>：本站使用 localStorage
              记录你的主题偏好（亮色 / 暗色模式）以及访客计数器（仅记录访问次数，不包含任何个人身份信息）。
              你可随时在浏览器设置中清除。
            </li>
            <li>
              <strong className="text-text">Supabase Auth 会话</strong>：当你登录后，Supabase
              会在浏览器中存储一个会话令牌，用于识别你的身份。令牌不包含密码，过期后自动失效。
            </li>
            <li>
              <strong className="text-text">用户提交内容</strong>：留言、匿名提问、评论、上传的头像等由你主动提交的内容
              会存储在 Supabase 数据库中，关联你的用户 ID（若已登录）或匿名会话。
            </li>
            <li>
              <strong className="text-text">访问日志</strong>：Vercel（本站托管方）会自动记录请求的 IP
              地址、User-Agent、访问时间等，用于安全审计和流量统计。本站在服务端不会主动收集这些数据，
              但托管商保留这些日志。
            </li>
            <li>
              <strong className="text-text">Vercel Analytics</strong>：本站使用 Vercel Analytics
              收集聚合化的页面访问数据（页面路径、来源、设备类型等），不含个人身份信息。
              数据由 Vercel 处理，详见{" "}
              <a
                href="https://vercel.com/docs/analytics"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                Vercel Analytics 隐私说明
              </a>
              。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-serif font-medium text-text">第三方服务</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>
              <strong className="text-text">Supabase</strong>：用于用户认证、数据库、文件存储。
              详见{" "}
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                Supabase 隐私政策
              </a>
              。
            </li>
            <li>
              <strong className="text-text">Vercel</strong>：本站托管与 Analytics 服务商。
              详见{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                Vercel 隐私政策
              </a>
              。
            </li>
            <li>
              <strong className="text-text">GitHub</strong>：用于 OAuth 登录。GitHub
              会向本站提供你的公开用户名和邮箱地址。详见{" "}
              <a
                href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                GitHub 隐私声明
              </a>
              。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-serif font-medium text-text">Cookie 使用</h2>
          <p className="mt-3 text-sm">
            本站不使用任何追踪型 Cookie。Supabase Auth 使用 HTTP-only Cookie 维持登录会话，
            这些 Cookie 无法被 JavaScript 读取，不会用于追踪。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-serif font-medium text-text">你的权利</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            <li>
              <strong className="text-text">清除数据</strong>：你可以在账户设置中删除自己发布的留言、提问、头像等。
            </li>
            <li>
              <strong className="text-text">注销账号</strong>：通过「个人主页」可注销账号，相关数据将被永久删除。
            </li>
            <li>
              <strong className="text-text">清除本地数据</strong>：在浏览器开发者工具 → Application → Local Storage
              中删除本站相关条目即可清除主题偏好和计数器数据。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-serif font-medium text-text">未成年人保护</h2>
          <p className="mt-3 text-sm">
            本站面向高校学生群体，内容适合 16 岁以上用户阅读。若你未满 16 周岁，
            请在监护人陪同下使用本站。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-serif font-medium text-text">政策变更</h2>
          <p className="mt-3 text-sm">
            本站可能在必要时更新本政策。更新会在本站发布新版本时生效，
            并在页面顶部标注最后更新日期。建议你定期查阅。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-serif font-medium text-text">联系我们</h2>
          <p className="mt-3 text-sm">
            对本政策有任何疑问，请通过{" "}
            <Link href="/about" className="text-primary underline-offset-4 hover:underline">
              关于我
            </Link>{" "}
            页面中的联系方式联系站长。
          </p>
        </section>
      </div>
    </div>
  );
}
