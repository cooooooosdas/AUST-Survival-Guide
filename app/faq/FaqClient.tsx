"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type FaqItem = {
  id: number;
  question: string;
  answer: string;
  category: string;
  categoryLabel: string;
  source_type: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
};

type Category = { value: string; label: string };

type Props = {
  initialQ: string;
  initialCategory: string;
  categories: Category[];
};

const DEFAULT_ITEMS: FaqItem[] = [
  {
    id: 1,
    question: "校园网连接报错怎么办？",
    answer:
      "1. 确认已连接 AUST-WiFi 或 AUST-5G 2. 打开浏览器访问任意网站会自动跳转到认证页面 3. 输入学号和初始密码（默认是身份证后6位）登录 4. 如果还是连不上，重启路由器或联系网络中心 0554-660XXXX",
    category: "high-math",
    categoryLabel: "高数问题",
    source_type: "manual",
    sort_order: 0,
    is_published: true,
    created_at: "2026-06-20",
  },
  {
    id: 2,
    question: "VSCode 怎么配置 C/C++ 编译环境？",
    answer:
      "1. 安装 VSCode 2. 安装 C/C++ 扩展（Microsoft 出品）3. 安装 MinGW-w64（推荐用 WinLibs 一键包）4. 在 VSCode 设置里配置 c_cpp_properties.json 的 includePath 5. 创建 tasks.json 配置编译任务 6. 按 Ctrl+Shift+B 编译运行",
    category: "software",
    categoryLabel: "软件安装",
    source_type: "manual",
    sort_order: 0,
    is_published: true,
    created_at: "2026-06-20",
  },
  {
    id: 3,
    question: "高数极限题有什么解题技巧？",
    answer:
      "1. 先判断类型：∞/∞、0/0、∞-∞、1^∞ 2. 常用方法：洛必达法则、等价无穷小替换、泰勒展开、变量替换 3. 注意定义域和连续性 4. 多练习历年真题，尤其是选择题和填空题 5. 推荐看 B 站「猴博士」或「高数叔」的视频讲解",
    category: "high-math",
    categoryLabel: "高数问题",
    source_type: "manual",
    sort_order: 0,
    is_published: true,
    created_at: "2026-06-20",
  },
  {
    id: 4,
    question: "ChatGPT 回答的内容总出错怎么办？",
    answer:
      "1. 明确告诉它你的身份（如\"我是安理大计算机学院大一新生\"）2. 要求它提供出处和参考链接 3. 对于代码问题，让它先分析再给方案 4. 数学问题务必自己验算 5. 用它来辅助理解，不要完全依赖 6. 关键信息去官方文档核实",
    category: "ai-tools",
    categoryLabel: "AI 工具使用",
    source_type: "manual",
    sort_order: 0,
    is_published: true,
    created_at: "2026-06-20",
  },
  {
    id: 5,
    question: "怎么查看自己的绩点排名？",
    answer:
      "教务系统（jw.aust.edu.cn）只能看到自己的成绩，看不到排名。想看排名需要去「测评一览」——这是学工系统的功能，登录后可以看到自己在专业内的百分比排名。",
    category: "course-select",
    categoryLabel: "选课疑问",
    source_type: "manual",
    sort_order: 0,
    is_published: true,
    created_at: "2026-06-20",
  },
  {
    id: 6,
    question: "选课系统崩了怎么办？",
    answer:
      "1. 错峰选课：不要等到截止前一分钟才选 2. 用手机端选，比电脑快 3. 不要刷新重进，你的选择可能已经生效 4. 看到\"朝北\"的奇数不要选——系统偶尔有 bug 5. 选错了也不用慌，开学后学校会多退少补",
    category: "course-select",
    categoryLabel: "选课疑问",
    source_type: "manual",
    sort_order: 0,
    is_published: true,
    created_at: "2026-06-20",
  },
];

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const terms = escaped.split(/\s+/).filter(Boolean);
  if (terms.length === 0) return text;
  const pattern = new RegExp(`(${terms.join("|")})`, "gi");
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded bg-accent/30 px-0.5 text-primary">{part}</mark>
    ) : (
      part
    )
  );
}

export default function FaqClient({ initialQ, initialCategory, categories }: Props) {
  const [q, setQ] = useState(initialQ);
  const [category, setCategory] = useState(initialCategory);
  const [items, setItems] = useState<FaqItem[]>(DEFAULT_ITEMS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQ) {
      doSearch(initialQ, initialCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doSearch(query: string, cat: string) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (cat) params.set("category", cat);
      const res = await fetch(`/api/faq?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.items && json.items.length > 0) {
          setItems(json.items);
          return;
        }
      }
    } catch {
      // fallback to default
    }
    // fallback: filter default items
    let filtered = DEFAULT_ITEMS;
    if (cat) filtered = filtered.filter((i) => i.category === cat);
    if (query) {
      const ql = query.toLowerCase();
      filtered = filtered.filter(
        (i) => i.question.toLowerCase().includes(ql) || i.answer.toLowerCase().includes(ql)
      );
    }
    setItems(filtered);
    setLoading(false);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    doSearch(trimmed, category);
    const url = new URL(window.location.href);
    if (trimmed) url.searchParams.set("q", trimmed);
    else url.searchParams.delete("q");
    if (category) url.searchParams.set("category", category);
    else url.searchParams.delete("category");
    window.history.replaceState({}, "", url.toString());
  }

  function onCategoryChange(cat: string) {
    setCategory(cat);
    doSearch(q, cat);
    const url = new URL(window.location.href);
    if (cat) url.searchParams.set("category", cat);
    else url.searchParams.delete("category");
    window.history.replaceState({}, "", url.toString());
  }

  const grouped = useMemo(() => {
    const map = new Map<string, FaqItem[]>();
    for (const item of items) {
      const key = item.categoryLabel || "其他";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return map;
  }, [items]);

  return (
    <div>
      {/* 搜索 + 分类筛选 */}
      <form onSubmit={onSubmit} className="mt-6 flex flex-wrap gap-2">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索问题关键词…"
          aria-label="搜索问题"
          className="flex-1 min-w-[200px] rounded-lg border border-border bg-bg-alt px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "搜索中…" : "搜索"}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => onCategoryChange(c.value)}
            className={[
              "rounded-full border px-3 py-1 text-xs transition-colors",
              (!category && !c.value) || category === c.value
                ? "border-primary bg-primary-light text-primary"
                : "border-border text-muted hover:border-primary hover:text-primary",
            ].join(" ")}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* FAQ 列表 */}
      <div className="mt-8">
        {items.length === 0 ? (
          <div className="rounded-md border border-dashed border-border bg-bg-alt p-10 text-center text-sm text-muted">
            没有找到相关问题。去{" "}
            <Link href="/questions" className="text-primary underline-offset-4 hover:underline">
              匿名提问
            </Link>{" "}
            提交你的问题吧。
          </div>
        ) : (
          <div className="space-y-6">
            {Array.from(grouped.entries()).map(([label, groupItems]) => (
              <section key={label}>
                <h2 className="text-base font-medium text-primary mb-3">
                  <span className="border-l-2 border-accent pl-3">{label}</span>
                </h2>
                <div className="space-y-4">
                  {groupItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-border bg-bg-alt p-5 transition-colors hover:border-primary/20"
                    >
                      <h3 className="text-sm font-medium text-primary">
                        {highlightText(item.question, initialQ)}
                      </h3>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-text leading-relaxed">
                        {highlightText(item.answer, initialQ)}
                      </p>
                      {item.source_type !== "manual" && (
                        <p className="mt-2 text-[10px] text-muted/70">
                          来源：{item.source_type === "comment" ? "留言区" : "匿名提问"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
