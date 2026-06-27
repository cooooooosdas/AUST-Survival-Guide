import Link from "next/link";

export const metadata = { title: "关于我" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl md:text-3xl font-serif font-semibold text-text">关于我</h1>

      {/* 非官方声明 */}
      <div className="mt-6 rounded-xl border border-amber-200 bg-accent-light px-5 py-4 text-sm leading-relaxed text-text">
        <p className="font-medium text-accent">&#x26A0;&#xFE0F; 非官方声明</p>
        <p className="mt-2">
          本站为站长<strong className="text-text">个人项目</strong>，与安徽理工大学（AUST）及任何学院、部门
          （包括但不限于计算机学院、教务处、网络中心）<strong className="text-text">无任何隶属或合作关系</strong>。
          所有内容——包括学长来信、FAQ、工具箱链接、留言评论——均由站长个人或普通访客
          以个人身份创建，<strong className="text-text">不代表学校官方立场</strong>。
        </p>
        <p className="mt-2">
          教务系统、选课、成绩、奖学金等政策以学校官方通知为准，本站内容仅供参考，
          不作为任何决策依据。
        </p>
        <Link
          href="/disclaimer"
          className="mt-3 inline-block text-primary underline-offset-4 hover:underline"
        >
          查看完整免责声明 →
        </Link>
      </div>

      <div className="mt-8 space-y-5 leading-[1.8] text-text-secondary">
        <p>
          coolin，安徽理工大学计算机科学与工程学院。
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
        <h2 className="text-base font-medium text-text">联系方式</h2>
        <ul className="mt-4 space-y-2.5 text-sm text-text">
          <li className="flex items-center gap-2">
            <span className="text-muted w-12 shrink-0">B 站：</span>
            <a
              href="https://space.bilibili.com/350016742"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              space.bilibili.com/350016742
            </a>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-muted w-12 shrink-0">QQ：</span>
            <span className="text-text">3328908142</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-muted w-12 shrink-0">GitHub：</span>
            <a
              href="https://github.com/cooooooosdas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              github.com/cooooooosdas
            </a>
          </li>
        </ul>
      </div>

      {/* 更多 */}
      <div className="mt-10 border-t border-border pt-8">
        <h2 className="text-xl font-serif font-semibold text-text mb-4">更多</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/projects"
            className="group card card-hover p-5 flex items-center gap-4"
          >
            <span className="text-2xl shrink-0">💻</span>
            <div>
              <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">项目展示</p>
              <p className="text-xs text-muted mt-0.5">网站作品、AI 应用及课程大作业</p>
            </div>
          </Link>
          <Link
            href="/friends"
            className="group card card-hover p-5 flex items-center gap-4"
          >
            <span className="text-2xl shrink-0">🔗</span>
            <div>
              <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">友链交换</p>
              <p className="text-xs text-muted mt-0.5">与学长博客、技术站点交换友情链接</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
