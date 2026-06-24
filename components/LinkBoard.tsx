import type { LinkGroup } from "@/lib/types";

/* ---------- 二次元 tag 配色表 ---------- */
const TAG_STYLE: Record<string, string> = {
  "免费": "bg-accent-light text-[#3A8B72]",
  "开源": "bg-secondary-light text-[#8B4560]",
  "推荐": "bg-primary-light text-primary",
  "必装": "bg-[#FFE4E4] text-[#9B2C2C]",
  "在线": "bg-[#E0F2FE] text-[#075985]",
  "本地": "bg-[#F3E8FF] text-[#4A1D96]",
  "AI":   "bg-primary-light text-primary",
  "教程": "bg-secondary-light/60 text-[#8B4560]",
};

function tagStyle(tag: string): string {
  return TAG_STYLE[tag] ?? "bg-[#F1F5F9] text-[#475569]";
}

/* ---------- 图标渲染 ---------- */
function renderSectionIcon(icon?: string) {
  if (!icon) return null;
  return (
    <div
      className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icon }}
    />
  );
}

function renderItemIcon(icon?: string) {
  if (!icon) return null;
  return (
    <div
      className="hidden sm:flex h-7 w-7 shrink-0 items-center justify-center"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icon }}
    />
  );
}

/* ---------- 主组件 ---------- */
export default function LinkBoard({
  title,
  intro,
  groups,
}: {
  title: string;
  intro?: string;
  groups: LinkGroup[];
}) {
  return (
    <div>
      {/* 页头 */}
      <header
        className="mb-10 border-b border-border pb-6"
        style={{ animation: "fade-up 0.6s var(--ease-out-soft) forwards" }}
      >
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">{title}</h1>
        {intro && (
          <p className="mt-3 max-w-2xl text-sm md:text-base text-muted leading-relaxed">
            {intro}
          </p>
        )}
      </header>

      <div className="space-y-12">
        {groups.map((g, gi) => (
          <section
            key={g.id}
            style={{
              animation: `fade-up 0.6s var(--ease-out-soft) ${120 + gi * 80}ms both`,
            }}
          >
            {/* 分组标题 + 分类图标 */}
            <div className="flex items-center gap-3 mb-4">
              {renderSectionIcon(g.icon)}
              <h2 className="text-base font-medium text-primary">
                <span className="border-l-2 border-accent pl-3">{g.title}</span>
              </h2>
            </div>

            {/* 卡片网格 —— 二次元毛玻璃 */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {g.items.map((item) => {
                const primary = item.tag ?? item.tags?.[0] ?? "";
                const extra = (item.tags ?? []).filter((t) => t !== primary);
                return (
                  <li key={item.title}>
                    <a
                      href={item.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${item.title}（在新标签页打开）`}
                      className={[
                        /* 毛玻璃卡片 */
                        "group flex items-start gap-3 rounded-xl p-3",
                        "bg-surface backdrop-blur-md backdrop-saturate-150",
                        "border border-border",
                        "shadow-sm transition-all duration-300",
                        "hover:-translate-y-0.5",
                        "hover:border-primary/30",
                        "hover:shadow-md hover:shadow-primary/10",
                        "active:translate-y-0 active:scale-[0.99]",
                        !item.url ? "opacity-60 pointer-events-none" : "",
                      ].join(" ")}
                    >
                      {renderItemIcon(g.icon)}
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-text group-hover:text-primary truncate">
                            {item.title}
                          </span>
                          {primary && (
                            <span
                              className={`shrink-0 rounded-md px-1.5 py-0.5 text-[11px] leading-4 font-medium ${tagStyle(primary)}`}
                            >
                              {primary}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-muted leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        {extra.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {extra.map((t) => (
                              <span
                                key={t}
                                className={`rounded-md px-1.5 py-0.5 text-[10px] leading-4 ${tagStyle(t)}`}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
