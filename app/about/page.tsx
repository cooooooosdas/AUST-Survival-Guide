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
    </div>
  );
}
