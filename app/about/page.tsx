import Link from "next/link";

export const metadata = { title: "关于我" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl md:text-3xl font-semibold text-primary">关于我</h1>
      <div className="mt-8 space-y-5 leading-loose text-text">
        <p>
          胡希，安徽理工大学计算机科学与工程学院 · 软件工程 25-4 班 · 班长。
        </p>
        <p>
          做这个站的初衷很简单：去年九月我自己来安理大的时候，对学校、对专业都没什么把握。
          那种&ldquo;不知道该问谁&rdquo;的感觉记忆很鲜活。所以我把过去这一年攒下的东西
          ——常用工具、踩过的坑、值得看的课、能用上的资源——整理出来，
          希望对 2026 级以及以后的同学有用。
        </p>
        <p>
          长期维护，不定期更新。欢迎 PR、issue、留言。
        </p>
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <h2 className="text-base font-medium text-primary">联系方式</h2>
        <ul className="mt-4 space-y-2 text-sm text-text">
          <li>
            <span className="text-muted">B 站：</span>
            <span>（待补充）</span>
          </li>
          <li>
            <span className="text-muted">QQ：</span>
            <span>（待补充）</span>
          </li>
          <li>
            <span className="text-muted">GitHub：</span>
            <span>（待补充）</span>
          </li>
        </ul>
      </div>

      {/* 更多 */}
      <div className="mt-10 border-t border-border pt-8">
        <h2 className="text-base font-medium text-primary mb-4">更多</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/friends"
            className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
          >
            <span className="text-2xl">🔗</span>
            <div>
              <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">友链交换</p>
              <p className="text-xs text-muted mt-0.5">与学长博客、技术站点交换友情链接</p>
            </div>
          </Link>
          <Link
            href="/checkin"
            className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
          >
            <span className="text-2xl">📝</span>
            <div>
              <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">学习打卡</p>
              <p className="text-xs text-muted mt-0.5">每日任务打卡，养成持续学习习惯</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
