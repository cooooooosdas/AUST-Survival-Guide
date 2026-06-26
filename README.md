# 安理大生存指南 · AUST Survival Guide

> 写给安徽理工大学新生的学长来信 × 资源导航 × 社区互动，长期维护。

**在线访问 → [aust.asia](https://aust.asia)**

</br>

![Next.js](https://img.shields.io/badge/Next.js-16.2.9-000000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.2.4-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e?logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-Edge-000000?logo=vercel)

</br>

![静态生成](https://img.shields.io/badge/SSG-静态导出-green)
![MDX](https://img.shields.io/badge/MDX-来信源文件-blue)
![Glassmorphism](https://img.shields.io/badge/玻璃拟态-Design-purple)
![暗色模式](https://img.shields.io/badge/暗色模式-支持-black)

---

## ✨ 功能一览

| 模块 | 说明 |
|------|------|
| 📝 **学长来信** | MDX 长文，带 Aside、Takeaways、脚注、阅读进度条、目录 |
| 📂 **工具导航** | 按板块分类的外部链接卡片（AI / 软件 / 学习 / 微服务 / 工具），支持复制与失效反馈 |
| 📚 **资源下载** | Supabase Storage 托管，分类筛选，下载计数 |
| 💬 **社区互动** | 留言楼中楼、回复、置顶、审核、标签、匿名提问、FAQ |
| 🔥 **热门推荐** | 按全站阅读量排行的 Leaderboard（来信 / 资源） |
| 🔍 **全文搜索** | 本地索引优先，命中不足时 AI fallback，支持 OpenAI + Anthropic 格式 |
| 🤖 **AI 助手** | 浮动聊天窗，本地搜索 → 兜底回复 → AI 流式输出 |
| 📊 **运营统计** | 内容阅读量、分享次数、访问量、热门搜索词 |
| 🎨 **视觉系统** | 天空蓝紫 / 樱花粉 / 薄荷绿三主题色，毛玻璃卡片，滚动动画，暗色模式 |
| ⭐ **收藏 / 点赞 / 分享** | 针对来信与资源的互动 |

</br>

![GitHub stars](https://img.shields.io/github/stars/cooooooosdas/AUST-Survival-Guide?style=social)
![GitHub forks](https://img.shields.io/github/forks/cooooooosdas/AUST-Survival-Guide?style=social)

---

## 🚀 快速开始

### 前置要求

- Node.js ≥ 20
- npm ≥ 10
- Supabase 账号（用于评论、资源、用户认证、统计）
- （可选）OpenAI / Anthropic API Key，用于 AI 助手

### 克隆 & 安装

```bash
git clone https://github.com/cooooooosdas/AUST-Survival-Guide.git
cd AUST-Survival-Guide
npm install
```

### 环境变量

在项目根目录创建 `.env.local`：

```env
# Supabase（必填）
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>  # 仅在服务端 API 路由中使用

# 站点地址（可选，用于友链 API 等绝对路径拼接）
NEXT_PUBLIC_SITE_URL=https://aust.asia

# AI 助手（二选一，留空则走本地搜索 + 兜底）
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini

# 或 Anthropic
ANTHROPIC_API_KEY=sk-ant-...
```

### Supabase 数据库初始化

在 [Supabase Dashboard → SQL Editor](https://supabase.com/dashboard/project/_/sql/new) 中依次执行 `supabase/migrations/` 目录下的 SQL 文件：

```
0001_init.sql        — 用户资料 / 留言基础表 / 视图
0002_storage_avatars.sql
0003_link_reports.sql
0004_likes_favorites.sql
0005_search_logs.sql
0006_resources.sql  — 资源表 + Storage bucket
0007_community.sql  — 留言升级（楼中楼、审核、标签）+ 匿名提问 + FAQ
0008_content_ops.sql — 阅读量 / 分享 / 更新日志
0009_friend_links.sql
0010_checkins.sql
```

配置 Storage bucket 允许的 MIME 类型在 `0006_resources.sql` 中以注释形式列出。

### 本地运行

```bash
npm run dev
# → http://localhost:3000
```

### 构建 & 生产启动

```bash
npm run build
npm run start
```

---

## 📁 目录结构

```
├── app/
│   ├── (sections)/         # 路由组：共享侧边栏布局（board / resources / faq / tools / ai）
│   ├── letters/            # 学长来信列表 / 单封信件页
│   ├── api/                # 服务端 API 路由（chat / search / stats / friend-links / ...）
│   ├── layout.tsx          # 根布局：ThemeProvider / Header / Footer / AIChat
│   └── page.tsx            # 首页
├── components/
│   ├── Header.tsx          # 顶部导航（桌面 + 移动端抽屉）
│   ├── Footer.tsx          # 页脚
│   ├── Leaderboard.tsx     # 热门推荐
│   ├── SidebarInfoPanel.tsx # 侧栏信息卡（时钟、访问量、一言）
│   ├── SectionSidebar.tsx  # 板块侧边栏导航
│   ├── AIChat.tsx          # AI 助手浮动窗
│   ├── CommentBoard.tsx    # 留言板（树形评论 + 审核 + 置顶）
│   ├── LetterToc.tsx       # 来信目录（TOC，IntersectionObserver 追踪）
│   ├── LinkCard.tsx        # 链接卡片（复制 / 反馈失效）
│   └── ...
├── content/
│   ├── letters/            # MDX 来信源文件（含自定义 Aside / Takeaways 组件）
│   ├── links/              # 链接数据文件（AI / 软件 / 工具 / 学习 / 微服务）
│   └── quotes.ts           # 侧栏一言库
├── lib/
│   ├── site.ts             # 站点元信息
│   ├── letters.ts          # 来信元数据 + readingTime 估算
│   ├── sections.ts         # 板块配置
│   ├── supabase/           # 服务端 / 客户端 Supabase 客户端
│   ├── comments.ts         # 留言规范化
│   ├── types.ts            # 共享类型
│   └── utils.ts            # 通用工具（cn 拼接等）
├── supabase/migrations/    # 数据库迁移 SQL
├── next.config.ts          # MDX / CSP 头配置
└── mdx-components.tsx      # MDX 自定义组件映射
```

---

## 🛠 技术栈

| 领域 | 选型 |
|------|------|
| 框架 | Next.js 16 App Router（静态导出 + 服务端组件） |
| 语言 | TypeScript 5 |
| 样式 | Tailwind CSS v4（`@theme` CSS 设计令牌 + 暗色模式变量覆盖） |
| 内容 | MDX（`@next/mdx` + `rehype-slug` + `remark-gfm`） |
| 数据库 | Supabase Postgres（Auth + RLS + Storage + 服务端视图） |
| 分析 | Vercel Analytics |
| 部署 | Vercel（推荐，零配置） |
| AI | 本地搜索优先 → 兜底文案 → 流式 AI（兼容 OpenAI + Anthropic Messages） |

---

## 🎨 设计系统

- **主题色**：天空蓝紫 `#7B8CDE` / 樱花粉 `#FF9EB5` / 薄荷绿 `#7DD4B8`
- **组件语言**：毛玻璃（`.glass` / `.glass-card` / `.glass-strong`）、滚动入场动画、`prefers-reduced-motion` 降级、`prefers-contrast` 高对比适配
- **响应式**：移动优先，`lg:` 以上显示侧栏目录

---

## 📝 如何写一封来信

1. 在 `content/letters/` 下新建 `your-slug.mdx`：

```mdx
export const metadata = {
  title: "信件标题",
  date: "2026-06-27",
  author: "coolin",
  tags: ["新生", "实用"],
  readingTime: 10,   // 可选，未填则自动估算
};
```

2. 在 `lib/letters.ts` 的 `LETTERS` 数组顶部追加一项（`load` 指向新 mdx 文件）
3. 可用 `<Aside tone="info|warn|tip" title="标题">` 与 `<Takeaways title="血的教训">` 组件

> `readingTimeMinutes` 按 400 字/分钟（中文）+ 200 词/分钟（英文）估算。

---

## 🤝 贡献

欢迎提 PR。几个约定：

- 来信请基于真实经历，带时间节点与出处
- 资源文件统一走 Supabase Storage，不要直接提交二进制到 Git
- 链接数据放在 `content/links/` 对应文件，按板块组织
- 数据库变更请写迁移文件放到 `supabase/migrations/`
- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📄 许可证

[MIT](./LICENSE) — 自由使用、修改、二次分发，但请保留原作者署名。

---

## ⭐ 如果这个项目对你有用

给个 [Star](https://github.com/cooooooosdas/AUST-Survival-Guide) 就是最好的支持。

**给新生的最后一句话**：

> 报道那两天会很乱，但你来对地方了。收藏这一页，按时间顺序每天对一遍，少走弯路。

有问题？[留言区](/board) 见。
