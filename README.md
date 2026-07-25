# 安理大生存指南 · AUST Survival Guide

> 给安徽理工大学新生准备的学长经验、资源导航和社区讨论，持续更新ing。

**在线访问 → [aust.asia](https://aust.asia)**

<br>

![Next.js](https://img.shields.io/badge/Next.js-16.2.9-000000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.2.4-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e?logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-Edge-000000?logo=vercel)

<br>

![静态生成](https://img.shields.io/badge/SSG-静态导出-green)
![MDX](https://img.shields.io/badge/MDX-来信源文件-blue)
![Glassmorphism](https://img.shields.io/badge/玻璃拟态-Design-purple)
![暗色模式](https://img.shields.io/badge/暗色模式-支持-black)

---

## 网站有什么

| 板块 | 说明 |
|------|------|
| 📝 **学长来信** | 几篇亲笔长文，从报到流程到大学四年避坑，再到怎么用 AI 辅助学习 |
| 📂 **工具导航** | AI 工具、软件、学习网站、学校微服务入口，分类整理，点击直达 |
| 📚 **资源下载** | 笔记、课件、安装包，Supabase 托管，支持分类筛选和下载统计 |
| 💬 **留言板** | 树形回复、置顶、审核、标签，有问题直接问学长学姐 |
| 🔍 **搜索** | 站内全文检索，支持语义搜索，找内容不用翻页 |
| 🤖 **AI 问答** | 基于网站内容做智能问答，有问题随时问 |
| 📊 **学习打卡** | 每日任务 + 刷题练习，坚持下来不容易 |
| ⭐ **互动** | 点赞、收藏、分享，觉得有用的内容标记一下 |

---

## 自己搭一个

### 前置条件

- Node.js ≥ 20
- npm ≥ 10
- Supabase 账号（评论、资源、用户登录用）
- 可选：大模型 API Key，让 AI 问答更聪明

### 克隆安装

```bash
git clone https://github.com/cooooooosdas/AUST-Survival-Guide.git
cd AUST-Survival-Guide
npm install
```

### 环境变量

项目根目录建一个 `.env.local`：

```env
# Supabase（必填）
NEXT_PUBLIC_SUPABASE_URL=https://你的项目.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>  # 只在服务端用

# 站点地址
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# AI 问答（可选）
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini

# 或者用 Anthropic
ANTHROPIC_API_KEY=sk-ant-...
```

### 数据库初始化

在 [Supabase Dashboard → SQL Editor](https://supabase.com/dashboard/project/_/sql/new) 里依次执行 `supabase/migrations/` 目录下的 SQL 文件：

```
0001_init.sql         — 用户资料、留言基础表
0002_storage_avatars.sql
0003_link_reports.sql
0004_likes_favorites.sql
0005_search_logs.sql
0006_resources.sql    — 资源表 + 文件存储
0007_community.sql    — 留言升级（楼中楼、审核）+ 匿名提问 + FAQ
0008_content_ops.sql  — 阅读量、分享、更新日志
0009_friend_links.sql
0010_checkins.sql     — 每日打卡
```

### 本地运行

```bash
npm run dev
# 打开 http://localhost:3000
```

### 构建上线

```bash
npm run build
npm run start
```

---

## 目录结构

```
├── app/
│   ├── (sections)/           # 共享侧边栏的页面组（工具、资源、FAQ 等）
│   ├── letters/              # 学长来信列表和详情页
│   ├── api/                  # 后端接口（AI 对话、搜索、评论、打卡等）
│   ├── layout.tsx            # 全局布局
│   └── page.tsx              # 首页
├── components/
│   ├── Header.tsx            # 顶部导航
│   ├── Footer.tsx            # 页脚
│   ├── AIChat.tsx            # AI 助手浮窗
│   ├── CommentBoard.tsx      # 留言板
│   ├── Leaderboard.tsx       # 热门排行
│   ├── LetterToc.tsx         # 来信目录
│   ├── LinkCard.tsx          # 链接卡片
│   └── ...
├── content/
│   ├── letters/              # 来信 MDX 源文件
│   ├── links/                # 链接数据（AI / 软件 / 学习 / 微服务 / 工具）
│   └── quotes.ts             # 侧栏一言
├── lib/
│   ├── site.ts               # 站点信息
│   ├── letters.ts            # 来信列表和阅读时间估算
│   ├── sections.ts           # 板块配置
│   ├── supabase/             # Supabase 客户端
│   ├── comments.ts           # 评论数据处理
│   └── types.ts              # 类型定义
├── supabase/migrations/      # 数据库迁移 SQL
├── next.config.ts            # 项目配置 + 安全头
└── mdx-components.tsx        # 来信自定义组件
```

---

## 用到的技术

| 方面 | 用的什么 |
|------|---------|
| 框架 | Next.js 16，静态生成 + 服务端组件 |
| 语言 | TypeScript |
| 样式 | Tailwind CSS v4，CSS 变量做主题色和暗色模式 |
| 内容 | MDX，支持自定义组件和脚注 |
| 数据库 | Supabase PostgreSQL，带用户认证和文件存储 |
| 部署 | Vercel，代码 push 自动上线 |
| AI | 本地语义搜索优先，不够再用大模型补 |

---

## 设计

- 毛玻璃卡片 + 滚动动画
- 暗色模式，自动跟随系统
- 字体：Inter（正文）+ Noto Serif SC（中文标题）+ Geist Mono（代码）
- 手机、平板、电脑都适配

---

## 写一封来信

1. 在 `content/letters/` 下新建一个 `.mdx` 文件：

```mdx
export const metadata = {
  title: "信件标题",
  date: "2026-06-27",
  author: "coolin",
  tags: ["新生", "实用"],
  readingTime: 10,  // 不写会自动估算
};
```

2. 在 `lib/letters.ts` 的 `LETTERS` 数组里加一条
3. 写正文，可以用 `<Aside>` 提示框和 `<Takeaways>` 要点总结

---

## 参与贡献

欢迎提 PR。几个约定：

- 来信请写真实经历，带具体时间节点
- 资源文件走 Supabase Storage，不要直接提交二进制文件到 Git
- 链接数据放在 `content/links/` 对应的文件里
- 数据库改动用迁移文件，放到 `supabase/migrations/`
- 提交信息用 Conventional Commits 格式

---

## 开源协议

[MIT](./LICENSE) — 随便用、随便改，保留原作者署名就行。

---

## 觉得有用？

给个 [Star](https://github.com/cooooooosdas/AUST-Survival-Guide) 就是最好的支持。

给新生的最后一句话：

> 如果可能的话，请经常给自己以一种假设： 当我步入暮年，失去时间，回首往事我最后悔没做什么？

有问题去 [留言区](/board)。
