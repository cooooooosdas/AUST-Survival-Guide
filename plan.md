# 安徽理工大学生存指南 · 项目规划

> 个人博客 / 资源导航网站。骨架是工具导航（参考上海交通大学生存指南），外面包一层《致即将到来的你》风格的学长来信温度感。

---

## 1. 项目定位

| 项 | 内容 |
|---|---|
| 站点名（暂定） | 安徽理工大学生存指南 |
| 站长 | coolin |
| 目标受众 | 主：2026 级安理大新生（计算机学院优先）；次：在校学生查资源时的一站式入口 |
| 性质 | 个人项目，长期维护 |
| 风格关键词 | 简约 · 实用 · 有温度 · 不过度装饰 |

## 2. V1 已锁定决策（2026-06-18）

| 决策项 | 选择 | 理由 |
|---|---|---|
| 内容主轴 | **工具/资源导航为主** | 目标受众查资源的需求大于读长文 |
| 用户系统 | **完整登录注册留言**（用第三方 Auth 服务） | 既要功能完整，又不自己造账户系统的轮子 |
| 写作节奏 | **月更 1-2 篇长文** | 低频，不需要重型 CMS |
| 设计向 | 编辑设计风、克制、不堆装饰 | 与 PPT/演讲稿一脉相承 |
| 技术栈 | **Next.js + Tailwind + shadcn/ui + Supabase + Vercel** | 主流路线、AI 工具支持最好、中文教程最多 |
| 配色 | **学院蓝主 + 杏色辅 + 白底**（见第 9 节） | 信息站标准；靠杏色和编辑式留白拉开撞脸距离 |
| 导航样式 | **混合式**（顶部一级 + 侧边二级） | 门户感 + 文档感都要；进入板块后侧边目录方便深翻 |
| 首页风格 | **信件开场 + 入口卡片** | 上半屏《致即将到来的你》拉温度，下半屏 9 个板块入口保留实用性 |

## 3. 板块规划（V1）

| # | 板块 | 类型 | 核心内容 |
|---|---|---|---|
| 1 | 首页 / 序言 | 着陆 | 学长式开场白、各板块入口 |
| 2 | 关于我 | 静态 | 个人简介、B 站、QQ、GitHub 等联系方式 |
| 3 | 工具箱 | 链接库 | 学习生活常用网址跳转（按用途分类） |
| 4 | 学校微服务 | 链接库 | 教务处、业务直通车等校内官方入口 |
| 5 | 学习资源 | 链接库 + 文档 | B 站优质视频教程 + 教学文档 |
| 6 | 软件资源 | 链接库 | 计算机学生常用软件下载 / 介绍 |
| 7 | AI 专区 | 链接库 + 短文 | AI 使用方法 + 常用 AI 网站 |
| 8 | 学长来信 | 长文 | 月更 1-2 篇个人经验长文 |
| 9 | 留言区 | 动态 | 全站统一或按板块/文章分散 |

> 后续扩展板块在 V2 之后再设计，V1 不做过度抽象。

## 4. 基础功能清单（V1）

- [x] 用户登录 / 注册（第三方 Auth）— Phase 2 已完成代码，等用户配 Supabase
- [x] 留言系统（登录后可发表）— Phase 2 已完成
- [x] 访问量统计 — `<Analytics />` 已挂载，等部署到 Vercel 自动生效
- [ ] 当前时间 / 上次更新时间显示
- [x] 图标系统（先用开源图标库，预留替换为自定义图的组件接口）
- [ ] GitHub 源码托管 + 自动部署
- [ ] 版本控制规范（git tag / branch 用于迭代和回退）

## 5. 技术决策状态

- [x] 内容形态
- [x] 用户系统方向（第三方 Auth）
- [x] 写作节奏
- [x] 技术栈（Next.js + Tailwind + shadcn/ui + Supabase + Vercel）
- [x] 部署平台（Vercel，技术栈一并定）
- [x] 配色方案（学院蓝 + 杏色 + 白底）
- [x] 导航样式（混合式：顶部一级 + 侧边二级）
- [x] 首页风格（信件开场 + 入口卡片）
- [x] 路由 / 数据模型 / URL 规划
- [ ] 域名

## 6. 实施分期

**Phase 0 · 选型**（当前）
锁定技术栈、配色、Auth 服务商、部署平台。

**Phase 1 · 脚手架 + 静态版**
项目脚手架、配色与图标系统、五大导航板块的链接库、首页与关于我。**目标：纯静态版本可上线给人看。**

**Phase 2 · 动态功能**
接入第三方 Auth、设计数据库、留言系统、访问量统计。

**Phase 3 · 长文区 + 优化**
学长来信板块、SEO、性能优化、域名接入。

## 7. 决策记录（Decision Log）

保留每次重大选择的理由，方便后期回顾和回退。

| 日期 | 决策 | 选择 | 理由 |
|---|---|---|---|
| 2026-06-18 | 内容主轴 | 工具导航为主 | 受众查资源的需求 > 读长文 |
| 2026-06-18 | 用户系统 | 全要 + 第三方 Auth | 功能完整 + 不造轮子 |
| 2026-06-18 | 写作节奏 | 月更 1-2 篇 | 不选重型 CMS |
| 2026-06-18 | Auth 实现 | Clerk / Supabase Auth 这类 SaaS | 首次做全栈不碰 bcrypt/session |
| 2026-06-18 | 技术栈 | Next.js + Tailwind + shadcn/ui + Supabase + Vercel | A 选项；中文资源最多，AI 工具准确度最高 |
| 2026-06-18 | Auth 服务商 | Supabase Auth（不是 Clerk） | 单一供应商：Auth 和 DB 在同一个 dashboard、同一套 SDK，比 Clerk+Supabase 双服务简单 |
| 2026-06-18 | 配色 | 学院蓝 + 杏色 + 白底 | C 选项；冷静专业、信息站标准；用杏色辅色和大量留白对抗撞脸 |
| 2026-06-19 | 导航样式 | 混合式（顶部一级 + 板块内侧边二级） | 工具站要门户感，长文/资源页要文档感，混合式两边都要 |
| 2026-06-19 | 首页风格 | 信件开场 + 入口卡片 | 上半屏拉温度（呼应"致即将到来的你"），下半屏保留实用性，不靠装饰堆砌 |
| 2026-06-19 | URL 命名 | 英文 slug（/tools /letters /ai...） | 短、通用、谷歌友好、不会被 URL 编码搞成乱码 |
| 2026-06-19 | Phase 1 完成 | 脚手架 + 5 大链接板块 + 首页 + 关于我 | 静态版本 build 通过 |
| 2026-06-19 | Phase 2 完成 | Supabase Auth + 留言 + Analytics | 代码已就绪，等用户配 .env 联调 |
| 2026-06-19 | Phase 3 完成 | MDX 长文区，2 篇示范信 | 列表页 + [slug] 详情页 + 每信独立留言区 |
| 2026-06-19 | middleware → proxy | 跟随 Next 16 文件约定改名 | 消除 deprecation warning |

---

## 9. 配色规范

| 角色 | 色号 | 用途 |
|---|---|---|
| 主色 Primary | `#1E3A5F` 深海军蓝 | 主按钮、链接、品牌色、标题 |
| 辅色 Accent | `#E5C998` 杏色 | hover 高亮、强调线、卡片角标、温度点缀 |
| 底色 Background | `#FFFFFF` 白 | 主背景 |
| 浅底 Background-Alt | `#F8F9FB` 极浅蓝灰 | 卡片浅底、分区背景 |
| 文字 Text | `#1A1A1A` 近黑 | 正文 |
| 次要文字 Muted | `#6B7280` 中灰 | 描述、说明、时间戳 |
| 线色 Border | `#E5E7EB` 浅灰 | 卡片边框、分隔线 |

> 落到 Tailwind config：把这 7 个色加到 theme.extend.colors，用 `text-primary` `bg-accent` 这种语义化类名调用，方便后期换色。

---

## 8. 技术栈详情

| 层 | 选型 | 用途 |
|---|---|---|
| 前端框架 | **Next.js 14（App Router）** | 页面 + 路由 + 服务端渲染 + API Routes |
| 编程语言 | TypeScript | JS 加类型，少出错；Next.js 默认推荐 |
| 样式 | **Tailwind CSS** | 原子化样式，写得快 |
| UI 组件 | **shadcn/ui** | 复制即用的组件库，代码归自己改 |
| 图标 | Lucide / Heroicons（开源） | 先用替代图标，预留替换为自定义图的组件接口 |
| 数据库 | **Supabase Postgres** | 留言、用户附加信息存这里 |
| 用户系统 | **Supabase Auth** | 邮箱密码 + GitHub/Google 等三方登录 |
| 部署 | **Vercel** | push 到 GitHub 自动构建上线 |
| 源码托管 | GitHub | 公开仓库，方便其他人 fork/参考 |
| 长文 | MDX（Markdown + JSX） | 在仓库里建 `.mdx` 文件即文章 |
| 留言 | 自建（前端 + Supabase 表） | 因为已经有 Auth 和 DB，不用 Giscus |
| 访问统计 | Vercel Analytics 或 Umami（自托管） | Phase 2 决定 |

---

## 10. 信息架构（路由 + 文件结构）

### 10.1 路由地图（草案）

| 路径 | 板块 | 页面类型 |
|---|---|---|
| `/` | 首页 | 信件开场 + 9 个入口卡片 |
| `/about` | 关于我 | 静态 |
| `/tools` | 工具箱 | 链接库（按用途分组） |
| `/microservices` | 学校微服务 | 链接库（教务处/业务直通车等） |
| `/learn` | 学习资源 | 链接库 + 教学文档 |
| `/software` | 软件资源 | 链接库 |
| `/ai` | AI 专区 | 链接库 + 短文 |
| `/letters` | 学长来信（列表） | MDX 文章列表 |
| `/letters/[slug]` | 学长来信（详情） | MDX 单篇 |
| `/board` | 留言区 | 全站统一留言（Phase 2） |
| `/login` `/signup` | 登录/注册 | Supabase Auth UI（Phase 2） |

### 10.2 文件结构（Next.js App Router）

```
app/
  layout.tsx              # 顶部导航 + 页脚（全站共用）
  page.tsx                # 首页（信件开场 + 入口卡片）
  about/page.tsx
  (sections)/             # 路由组：所有"链接库板块"共用侧边栏布局
    layout.tsx            # 侧边二级导航
    tools/page.tsx
    microservices/page.tsx
    learn/page.tsx
    software/page.tsx
    ai/page.tsx
  letters/
    page.tsx              # 列表
    [slug]/page.tsx       # MDX 详情
  board/page.tsx          # Phase 2
  login/page.tsx          # Phase 2
components/
  ui/                     # shadcn 复制下来的基础组件
  Header.tsx
  Footer.tsx
  SectionSidebar.tsx
  LetterHero.tsx          # 首页信件开场
  EntryCard.tsx           # 首页入口卡片
  LinkItem.tsx            # 链接库的单条
  LinkGroup.tsx           # 链接库分组容器
content/
  links/                  # 链接数据（TS 静态数据）
    tools.ts
    microservices.ts
    learn.ts
    software.ts
    ai.ts
  letters/                # MDX 长文
    2026-06-welcome.mdx
lib/
  supabase.ts             # Phase 2：Supabase client
  types.ts                # 共享类型（LinkItem / LinkGroup / Letter ...）
public/
  icons/                  # 自定义图标占位目录
```

### 10.3 数据模型

**Phase 1（静态）** — 链接库写在 TS 文件里，类型安全且无后端：

```ts
type LinkItem = {
  title: string;
  url: string;
  description?: string;
  icon?: string;        // 图标 key，预留可替换
  tag?: string;         // 可选标签（"官方"/"推荐"/"需校园网"）
};

type LinkGroup = {
  id: string;
  title: string;        // 分组标题，如"学习"/"生活"
  items: LinkItem[];
};
```

**Phase 2（动态）** — Supabase 表：

| 表 | 字段 | 备注 |
|---|---|---|
| `profiles` | id (FK→auth.users), display_name, avatar_url, created_at | 用户公开资料 |
| `comments` | id, user_id, target_type, target_id, content, created_at | target_type ∈ {"global", "section", "letter"}；target_id 用板块 slug 或文章 slug |
| `visits` | day (date), count | 简单访问量；或直接用 Vercel Analytics |

---

> 本文件随项目推进持续更新；每次大决策追加到第 7 节，并把对应清单从 `[ ]` 勾成 `[x]`。
