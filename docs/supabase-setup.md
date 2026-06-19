# Supabase 接入步骤（你来做）

## 1. 注册账号

打开 https://supabase.com → **Start your project** → 选 **Continue with GitHub**（最快，省去验证邮箱步骤）。

## 2. 新建项目

进入 dashboard 后点 **New project**：

| 字段 | 填什么 |
|---|---|
| Organization | 默认那个就行 |
| Project name | `aust-survival-guide` |
| Database password | 让它自动生成、点旁边的 copy 存好（用不到但要留底） |
| Region | **`Northeast Asia (Tokyo)`** 或 **`Southeast Asia (Singapore)`**，离中国近 |
| Pricing plan | **Free** |

点 Create new project，等 30 秒－2 分钟初始化完成。

## 3. 拿密钥

项目首页 → 左下齿轮 ⚙ **Project Settings** → **API** 标签：

复制下面**两个值**：

- **Project URL**（形如 `https://xxxx.supabase.co`）
- **Project API keys → anon / public** 那一栏的 key（很长一串）

> ⚠️ `service_role` 那个 key **绝对不要**复制到前端代码里、不要 commit 到仓库。Phase 2 用不到它。

## 4. 写到 .env.local

在 `D:\AUST-plan\` 下新建文件 `.env.local`，把上面拿到的两个值填进去：

```
NEXT_PUBLIC_SUPABASE_URL=https://你的项目id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=填刚刚复制的那一长串
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`.env.local` 已经在 `.gitignore` 里，不会被推到 GitHub。

## 5. 跑数据库迁移

回到 Supabase Dashboard：

左边栏 **SQL Editor** → **New query** → 把 `supabase/migrations/0001_init.sql` 整个文件**复制粘贴**进去 → 点右下角 **Run**。

执行完应该看到 `Success. No rows returned`。

去 **Table Editor** 应该看到两张新表：`profiles` 和 `comments`，各自带 RLS 标志。

## 6. 配 GitHub OAuth（让"用 GitHub 登录"能用）

### 6.1 在 GitHub 建 OAuth App

打开 https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**：

| 字段 | 填什么 |
|---|---|
| Application name | `安理大生存指南（dev）` |
| Homepage URL | `http://localhost:3000` |
| Authorization callback URL | **从 Supabase 拿**，见下一步 |

callback URL 在 Supabase Dashboard → **Authentication** → **Providers** → **GitHub** 那一栏的 **Callback URL (for OAuth)**，长这样：

```
https://你的项目id.supabase.co/auth/v1/callback
```

复制粘到 GitHub OAuth App 的 callback URL 字段，**Register application**。

### 6.2 把 GitHub 给的 Client ID / Secret 填回 Supabase

GitHub OAuth App 详情页：

- 复制 **Client ID**
- 点 **Generate a new client secret**，复制生成的 secret

回到 Supabase Dashboard → **Authentication** → **Providers** → **GitHub** → **Enable GitHub provider** ON → 把 Client ID 和 Client Secret 填进去 → **Save**。

### 6.3 Supabase 里配置回跳地址

同样在 Supabase Dashboard → **Authentication** → **URL Configuration**：

- **Site URL**：`http://localhost:3000`
- **Redirect URLs**（点 Add URL）：
  - `http://localhost:3000/auth/callback`
  - 部署到 Vercel 之后再加 `https://你的域名/auth/callback`

Save。

## 7. 跑起来

```bash
npm run dev
```

打开 http://localhost:3000/signup 注册一个测试号 → 收邮箱里的验证邮件 → 点链接确认 → 回站点点 GitHub 登录试试。

注册成功后去 Supabase Dashboard → Table Editor → `profiles` 表，应该看到你的记录自动出现了（说明 trigger 跑通了）。

---

## 常见问题

- **"Email not confirmed" 报错** → 去看注册邮箱（含垃圾箱），或在 Supabase Dashboard → Authentication → Users 里手动点 Confirm
- **"redirect_uri_mismatch"（GitHub 报错）** → 检查 GitHub OAuth App 的 callback URL 是不是和 Supabase 给的那个完全一致
- **不想发验证邮件**（开发期） → Supabase Dashboard → Authentication → Settings → 关掉 "Confirm email"
