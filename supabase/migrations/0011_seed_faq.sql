-- Run this in Supabase Dashboard → SQL Editor → New query → Paste → Run
-- Table definition (matches migration 0007)
create table if not exists public.faq_items (
  id bigint generated always as identity primary key,
  question text not null,
  answer text not null,
  category text default 'general' check (category in (
    'general', 'high-math', 'course-select', 'software', 'ai-tools'
  )),
  source_type text not null default 'manual' check (source_type in (
    'manual', 'comment', 'question'
  )),
  source_id bigint,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_faq_items_category
  on public.faq_items (category, sort_order, created_at desc);

alter table public.faq_items enable row level security;

drop policy if exists "anyone can read published faq" on public.faq_items;
create policy "anyone can read published faq"
  on public.faq_items for select
  using (is_published = true);

-- Seed legacy FAQ items (the 6 items previously hardcoded in FaqClient.tsx)
insert into public.faq_items (question, answer, category, source_type, sort_order, is_published)
values
  ('校园网连接报错怎么办？',
   '1. 确认已连接 AUST-WiFi 或 AUST-5G' || chr(10) ||
   '2. 打开浏览器访问任意网站会自动跳转到认证页面' || chr(10) ||
   '3. 输入学号和初始密码（默认是身份证后6位）登录' || chr(10) ||
   '4. 如果还是连不上，重启路由器或联系网络中心',
   'high-math', 'manual', 100, true),
  ('VSCode 怎么配置 C/C++ 编译环境？',
   '1. 安装 VSCode' || chr(10) ||
   '2. 安装 C/C++ 扩展（Microsoft 出品）' || chr(10) ||
   '3. 安装 MinGW-w64（推荐用 WinLibs 一键包）' || chr(10) ||
   '4. 在 VSCode 设置里配置 c_cpp_properties.json 的 includePath' || chr(10) ||
   '5. 创建 tasks.json 配置编译任务' || chr(10) ||
   '6. 按 Ctrl+Shift+B 编译运行',
   'software', 'manual', 100, true),
  ('高数极限题有什么解题技巧？',
   '1. 先判断类型：∞/∞、0/0、∞-∞、1^∞' || chr(10) ||
   '2. 常用方法：洛必达法则、等价无穷小替换、泰勒展开、变量替换' || chr(10) ||
   '3. 注意定义域和连续性' || chr(10) ||
   '4. 多练习历年真题，尤其是选择题和填空题' || chr(10) ||
   '5. 推荐看 B 站「猴博士」或「高数叔」的视频讲解',
   'high-math', 'manual', 90, true),
  ('ChatGPT 回答的内容总出错怎么办？',
   '1. 明确告诉它你的身份（如「我是安理大计算机学院大一新生」）' || chr(10) ||
   '2. 要求它提供出处和参考链接' || chr(10) ||
   '3. 对于代码问题，让它先分析再给方案' || chr(10) ||
   '4. 数学问题务必自己验算' || chr(10) ||
   '5. 用它来辅助理解，不要完全依赖' || chr(10) ||
   '6. 关键信息去官方文档核实',
   'ai-tools', 'manual', 80, true),
  ('怎么查看自己的绩点排名？',
   '教务系统（jw.aust.edu.cn）只能看到自己的成绩，看不到排名。想看排名需要去「测评一览」——这是学工系统的功能，登录后可以看到自己在专业内的百分比排名。',
   'course-select', 'manual', 70, true),
  ('选课系统崩了怎么办？',
   '1. 错峰选课：不要等到截止前一分钟才选' || chr(10) ||
   '2. 用手机端选，比电脑快' || chr(10) ||
   '3. 不要刷新重进，你的选择可能已经生效' || chr(10) ||
   '4. 看到「朝北」的奇数不要选——系统偶尔有 bug' || chr(10) ||
   '5. 选错了也不用慌，开学后学校会多退少补',
   'course-select', 'manual', 70, true);
