# 部署上线清单

> 这一页是手把手的"明天醒来按这个顺序点"清单。所有需要你**亲自登录账号**的步骤都列在这里了。
>
> 全程预计 30~60 分钟（不算等待 DNS 生效）。

## 总览

```
1. 注册 Supabase           → 拿到 URL + anon key
2. 跑数据库迁移              → 建表、配权限
3. 配 GitHub OAuth          → 让"用 GitHub 登录"能用
4. 推代码到 GitHub           → 远程仓库
5. 接到 Vercel              → 自动构建 + 上线
6. 在 Vercel 填环境变量     → Supabase URL/key + 站点 URL
7. （可选）绑定自定义域名
8. 烟测一遍                  → 注册 / 登录 / 发留言 / 读信
```

---

## Step 1 · 注册 Supabase

1. 打开 https://supabase.com，**Sign in with GitHub**
2. 创建一个新项目（New project）：
   - Name：`aust-survival-guide`（随便）
   - Database password：**记住这个密码**（虽然我们不直接连 DB，但它是 root 密码）
   - Region：**Northeast Asia (Tokyo)** 或 **Southeast Asia (Singapore)** — 选离国内近的
   - Pricing plan：**Free** 够用
3. 等 1~2 分钟初始化
4. 进项目后，**左下齿轮 → API**：
   - 复制 **Project URL**（形如 `https://xxxx.supabase.co`）
   - 复制 **anon / public key**（不是 service_role！绝对不要泄露 service_role）
5. 在项目根目录建 `.env.local`（参考 `.env.example`）：

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...（很长一串）
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   > `.env.local` 已在 `.gitignore` 里，不会被提交。

## Step 2 · 跑数据库迁移

1. Supabase dashboard → **SQL Editor → New query**
2. 把 `supabase/migrations/0001_init.sql` 全文粘进去
3. **Run**（右下角）
4. 验证：左侧 **Table Editor** 应该能看到 `profiles` 和 `comments` 两张表

## Step 3 · 配 GitHub OAuth

GitHub 那边：

1. 打开 https://github.com/settings/developers → **New OAuth App**
2. 填：
   - Application name：`AUST Survival Guide`
   - Homepage URL：`http://localhost:3000`（之后再改成正式域名）
   - **Authorization callback URL**：`https://你的项目id.supabase.co/auth/v1/callback`（**注意这里是 supabase 给的，不是你站点**）
3. 注册后生成 **Client ID** + **Client secret**（secret 只显示一次，立刻复制）

回到 Supabase：

4. **Authentication → Providers → GitHub** → 启用，填 Client ID + Secret，保存
5. **Authentication → URL Configuration**：
   - Site URL：`http://localhost:3000`（部署后改）
   - Redirect URLs：加 `http://localhost:3000/auth/callback`

## Step 4 · 本地联调一下（先确认能通）

```bash
npm run dev
```

打开 http://localhost:3000 ，试：
- 邮箱注册 → 收确认邮件 → 点链接 → 自动登录
- "用 GitHub 登录" → 跳到 GitHub 授权 → 回跳已登录
- 发一条留言 → 刷新还在
- 删自己的留言 → 立刻消失

> 如果任何一步报错：先看浏览器 Console + dev server 终端输出，再贴给我。

## Step 5 · 推代码到 GitHub

```bash
# 已经初始化过 git，本地有 main 分支
git status                     # 看有哪些新文件
git add .
git commit -m "feat: phase 1-3 全栈雏形完成"

# 在 GitHub 网页新建仓库（不要勾 README/license/gitignore，因为本地已经有）
# 拿到 git@github.com:你的用户名/aust-survival-guide.git 后：

git remote add origin git@github.com:你的用户名/aust-survival-guide.git
git push -u origin main
```

## Step 6 · 接 Vercel

1. 打开 https://vercel.com，**Sign up with GitHub**（一定用 GitHub 登录，方便授权 repo）
2. **Add New → Project** → 选刚推上去的仓库 → **Import**
3. **Framework Preset** 自动识别为 Next.js，**别动**
4. 展开 **Environment Variables**，填三条：

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | 同 `.env.local` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 同 `.env.local` |
   | `NEXT_PUBLIC_SITE_URL` | **暂时**留空，或填 `https://aust-survival-guide.vercel.app`（会被自动分配的子域） |

5. **Deploy** → 等 1~3 分钟构建完
6. 拿到 `https://xxxx.vercel.app`，打开看一眼能不能访问

## Step 7 · 把生产 URL 同步回 GitHub OAuth + Supabase

部署后，记得**回头改三个地方**，不然 OAuth 会跳错：

1. **Vercel → Settings → Environment Variables**：把 `NEXT_PUBLIC_SITE_URL` 设为生产域名（`https://aust-survival-guide.vercel.app`），改完点 **Redeploy**
2. **GitHub OAuth App** → Edit：
   - Homepage URL → 生产域名
   - Authorization callback URL → 不变（仍然是 supabase 那个）
3. **Supabase → Auth → URL Configuration**：
   - Site URL → 生产域名
   - Redirect URLs → 增加 `https://你的域名/auth/callback`（**保留** localhost 那条，方便继续本地开发）

## Step 8 ·（可选）自定义域名

如果你已经有域名（比如腾讯云/阿里云/Namecheap 买的）：

1. **Vercel → Settings → Domains** → Add → 输入你的域名（或子域如 `aust.你域名.com`）
2. Vercel 会告诉你怎么配 DNS。常见两种：
   - 顶级域：A 记录 `76.76.21.21`
   - 子域：CNAME 指向 `cname.vercel-dns.com`
3. 在你的域名注册商后台加上记录，等 5 分钟到几小时 DNS 生效
4. 域名生效后**重复 Step 7** 把所有 URL 改成新域名

> 如果你还没买域名：先用 `xxxx.vercel.app` 跑两个月没问题，等内容稳定了再买。

## Step 9 · Vercel Analytics

代码里 `<Analytics />` 已经挂了，**部署到 Vercel 后自动生效**——不用配。

24 小时后 Vercel dashboard → 你的项目 → Analytics 那一栏会出现访问数据。

---

## 出错怎么办

| 症状 | 怎么查 |
|---|---|
| GitHub 登录跳回错误页 | callback URL 是不是 supabase 那个 `/auth/v1/callback`，不是站点 URL |
| 邮箱注册收不到邮件 | Supabase 免费版有节流，先看垃圾箱；或改用 GitHub 登录 |
| Vercel 构建失败 | 看 build log 里的 TypeScript / lint 错误；本地能 `npm run build` 跑通就 99% 没问题 |
| 留言发不出去 / 报 RLS error | 数据库迁移没跑完整；重新跑一遍 SQL |
| 中文乱码 | 检查 Vercel 环境变量有没有奇怪的不可见字符 |

---

## 不要做的事

- **不要把 service_role key 放进 `.env.local` 或前端代码**——它绕过所有 RLS，谁都能删库
- **不要把 `.env.local` 提交到 git**（已经 gitignore 了，但提醒一下）
- **不要在 Vercel 用 service_role key**——除非你专门在 server-only 路由里用，且 100% 确定不会泄露
- **不要 force push main**——尤其在已经接 Vercel 自动部署后

---

> 全部走完后，回来告诉我哪步卡住了。如果都顺利，下一步是**优化阶段**（你说明天做的），那时候我们会涉及 SEO、性能、动画细节、内容补全。
