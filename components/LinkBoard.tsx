import type { LinkGroup } from "@/lib/types";

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
            <h2 className="mb-4 text-base font-medium text-primary">
              <span className="border-l-2 border-accent pl-3">{g.title}</span>
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {g.items.map((item) => (
                <li key={item.title}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.title}（在新标签页打开）`}
                    className="group flex flex-col gap-1 rounded-md border border-border bg-bg-alt p-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-accent hover:bg-bg hover:shadow-[0_8px_24px_-14px_rgba(30,58,95,0.2)] active:translate-y-0 active:scale-[0.99]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-text group-hover:text-primary">
                        {item.title}
                      </span>
                      {item.tag && (
                        <span className="rounded-sm bg-accent/30 px-2 py-0.5 text-xs text-primary">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
