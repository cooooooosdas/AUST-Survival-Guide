import type { LinkGroup } from "@/lib/types";
import LinkCard from "@/components/LinkCard";

/* ---------- 图标渲染（分组标题） ---------- */
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

/* ---------- 主组件 ---------- */
export default function LinkBoard({
  title,
  intro,
  groups,
  sectionSlug,
}: {
  title: string;
  intro?: string;
  groups: LinkGroup[];
  sectionSlug?: string;
}) {
  const itemCount = groups.reduce((total, group) => total + group.items.length, 0);

  return (
    <div>
      <header
        className="mb-9 border-b border-border pb-6"
        style={{ animation: "fade-up 0.6s var(--ease-out-soft) forwards" }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-text">{title}</h1>
            {intro && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                {intro}
              </p>
            )}
          </div>
          <p className="shrink-0 text-xs text-muted">
            <span className="font-serif text-2xl font-semibold text-text">{itemCount}</span>
            <span className="ml-1.5">个已整理入口</span>
          </p>
        </div>

        <nav aria-label={`${title}分类`} className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {groups.map((group) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              className="shrink-0 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              {group.title}
            </a>
          ))}
        </nav>
      </header>

      <div className="space-y-10">
        {groups.map((g, gi) => (
          <section
            key={g.id}
            id={g.id}
            className="scroll-mt-24"
            style={{
              animation: `fade-up 0.6s var(--ease-out-soft) ${120 + Math.min(gi, 4) * 70}ms both`,
            }}
          >
            <div className="mb-5 flex items-center gap-3">
              {renderSectionIcon(g.icon)}
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              <h2 className="font-serif text-lg font-medium text-text">
                {g.title}
              </h2>
              <span className="text-xs text-muted">{g.items.length}</span>
              <span className="h-px flex-1 bg-border" aria-hidden="true" />
            </div>

            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {g.items.map((item) => (
                <li key={item.title}>
                  <LinkCard
                    item={item}
                    sectionSlug={sectionSlug}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
