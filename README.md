# AUST-Survival-Guide

安徽理工大学新生生存指南 · 学长来信 · 资源导航 · 二次元简约风格

## 技术栈

- Next.js 16 (App Router)
- Tailwind CSS v4 (@theme CSS 设计令牌)
- MDX (letters 写信 + 自定义 Aside / Takeaways 组件)
- Supabase (评论 + 用户认证)
- 二次元简约视觉系统（天空蓝紫 / 樱花粉 / 薄荷绿配色 + 毛玻璃卡片 + 滑动选中色块 + 星点粒子）

## 目录

- `app/` — Next.js App Router 页面 / API 路由
- `components/` — 全局共享组件（Header / Footer / LinkBoard / SectionSidebar / StarField 等）
- `content/letters/` — 学长来信 MDX 源文件
- `content/links/` — 链接数据文件（AI / 学习 / 软件 / 工具 / 微服务）
- `lib/` — 数据 / 站点配置 / 搜索索引
- `proxy.ts` — 中间件（Supabase session refresh）

## 本地运行

```bash
npm install
npm run dev
# http://localhost:3000
```

## 许可证

MIT
