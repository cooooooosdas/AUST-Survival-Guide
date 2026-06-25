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
  return (
    <div>
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
            <div className="flex items-center gap-3 mb-4">
              {renderSectionIcon(g.icon)}
              <h2 className="text-base font-medium text-primary">
                <span className="border-l-2 border-accent pl-3">{g.title}</span>
              </h2>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {g.items.map((item) => (
                <li key={item.title}>
                  <LinkCard
                    item={item}
                    sectionSlug={sectionSlug}
                    groupIcon={g.icon}
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
