import Link from "next/link";
import { redirect } from "next/navigation";
import FavoriteButton from "@/components/FavoriteButton";
import ClearHistoryForm from "./ClearHistoryForm";
import { LETTER_MAP } from "@/lib/letters";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "阅读中心" };

type ActivityRow = {
  target_type: string;
  target_id: string;
  created_at: string;
};

type ResourceRow = {
  id: number;
  title: string;
  description: string | null;
  category: string;
  file_name: string;
};

type LibraryItem = {
  key: string;
  targetType: "letter" | "resource";
  targetId: string;
  title: string;
  description: string;
  href: string;
  kind: string;
  meta: string;
  occurredAt: string;
};

const DATE_FORMATTER = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const RESOURCE_CATEGORY_LABEL: Record<string, string> = {
  "high-math": "高数笔记",
  "cs-courseware": "计算机课件",
  software: "软件安装包",
  review: "期末复习",
  latex: "LaTeX 模板",
  other: "其他资源",
};

function formatDate(value: string) {
  return DATE_FORMATTER.format(new Date(value));
}

function resolveItem(
  row: ActivityRow,
  resources: Map<string, ResourceRow>
): LibraryItem | null {
  if (row.target_type === "letter") {
    const letter = LETTER_MAP[row.target_id];
    if (!letter) return null;
    return {
      key: `letter:${letter.slug}`,
      targetType: "letter",
      targetId: letter.slug,
      title: letter.title,
      description: letter.excerpt,
      href: `/letters/${letter.slug}`,
      kind: "学长来信",
      meta: `约 ${letter.readingTime ?? 5} 分钟`,
      occurredAt: row.created_at,
    };
  }

  if (row.target_type === "resource") {
    const resource = resources.get(row.target_id);
    if (!resource) return null;
    return {
      key: `resource:${resource.id}`,
      targetType: "resource",
      targetId: String(resource.id),
      title: resource.title,
      description: resource.description || resource.file_name,
      href: `/resources/${resource.id}`,
      kind: "资料资源",
      meta: RESOURCE_CATEGORY_LABEL[resource.category] ?? "其他资源",
      occurredAt: row.created_at,
    };
  }

  return null;
}

export default async function LibraryPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect("/login?next=/library");
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/library");

  const [favoritesResult, viewsResult] = await Promise.all([
    supabase
      .from("favorites")
      .select("target_type, target_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("content_views")
      .select("target_type, target_id, created_at")
      .eq("viewer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(200),
  ]);
  const favorites = favoritesResult.data;
  const views = viewsResult.data;
  const favoritesFailed = Boolean(favoritesResult.error);
  const viewsFailed = Boolean(viewsResult.error);

  const activity = [
    ...((favorites ?? []) as ActivityRow[]),
    ...((views ?? []) as ActivityRow[]),
  ];
  const resourceIds = Array.from(
    new Set(
      activity
        .filter((row) => row.target_type === "resource")
        .map((row) => Number(row.target_id))
        .filter(Number.isFinite)
    )
  );

  const resourceMap = new Map<string, ResourceRow>();
  let resourcesFailed = false;
  if (resourceIds.length > 0) {
    const { data: resources, error: resourcesError } = await supabase
      .from("resources")
      .select("id, title, description, category, file_name")
      .in("id", resourceIds);
    resourcesFailed = Boolean(resourcesError);
    for (const resource of (resources ?? []) as ResourceRow[]) {
      resourceMap.set(String(resource.id), resource);
    }
  }

  const savedItems = ((favorites ?? []) as ActivityRow[])
    .map((row) => resolveItem(row, resourceMap))
    .filter((item): item is LibraryItem => item !== null);

  const recentItems: LibraryItem[] = [];
  const seen = new Set<string>();
  for (const row of (views ?? []) as ActivityRow[]) {
    const item = resolveItem(row, resourceMap);
    if (!item || seen.has(item.key)) continue;
    seen.add(item.key);
    recentItems.push(item);
    if (recentItems.length >= 12) break;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 md:py-16">
      <header className="border-b border-border pb-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Personal library
        </p>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-balance font-serif text-3xl font-semibold text-text md:text-4xl">
              阅读中心
            </h1>
            <p className="mt-3 max-w-2xl text-pretty text-sm leading-7 text-text-secondary">
              收好想稍后看的内容，也从最近浏览接着读。这里仅展示你自己的阅读记录。
            </p>
          </div>
          <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-border bg-bg-alt text-sm text-muted shadow-sm">
            <span className="px-4 py-3">
              <strong className="mr-1 font-serif text-xl text-text">{savedItems.length}</strong>稍后读
            </span>
            <span className="border-l border-border px-4 py-3">
              <strong className="mr-1 font-serif text-xl text-text">{recentItems.length}</strong>最近浏览
            </span>
          </div>
        </div>
      </header>

      <section className="py-10" aria-labelledby="saved-title">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">Saved</p>
            <h2 id="saved-title" className="mt-1 font-serif text-2xl font-semibold text-text">稍后读</h2>
          </div>
          <Link href="/letters" className="text-sm text-primary transition-colors hover:text-primary-hover">
            发现更多内容
          </Link>
        </div>

        {favoritesFailed || resourcesFailed ? (
          <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            稍后读暂时没有完整加载。你的收藏没有丢失，请刷新页面后重试。
          </div>
        ) : savedItems.length > 0 ? (
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {savedItems.map((item) => (
              <li key={item.key} className="grid gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <Link href={item.href} className="group min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span className="font-medium text-primary">{item.kind}</span>
                    <span>{item.meta}</span>
                    <time dateTime={item.occurredAt}>保存于 {formatDate(item.occurredAt)}</time>
                  </div>
                  <h3 className="mt-2 text-pretty font-serif text-lg font-semibold text-text transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-text-secondary">{item.description}</p>
                </Link>
                <FavoriteButton
                  targetType={item.targetType}
                  targetId={item.targetId}
                  initialFavorited
                  refreshOnChange
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 border-y border-dashed border-border py-10 text-center">
            <p className="text-sm font-medium text-text">稍后读还是空的</p>
            <p className="mt-2 text-sm text-muted">在来信或资料页点击“稍后读”，内容会出现在这里。</p>
          </div>
        )}
      </section>

      <section className="border-t border-border py-10" aria-labelledby="recent-title">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-secondary">History</p>
            <h2 id="recent-title" className="mt-1 font-serif text-2xl font-semibold text-text">最近浏览</h2>
          </div>
          {recentItems.length > 0 && <ClearHistoryForm />}
        </div>

        {viewsFailed || resourcesFailed ? (
          <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            最近浏览暂时没有完整加载。新的阅读记录仍会继续尝试保存，请稍后刷新。
          </div>
        ) : recentItems.length > 0 ? (
          <ol className="mt-6 grid gap-x-8 gap-y-0 md:grid-cols-2">
            {recentItems.map((item) => (
              <li key={item.key} className="min-w-0 border-t border-border py-5 first:border-t-0 md:first:border-t">
                <Link href={item.href} className="group block">
                  <div className="flex items-center justify-between gap-3 text-xs text-muted">
                    <span>{item.kind} · {item.meta}</span>
                    <time dateTime={item.occurredAt}>{formatDate(item.occurredAt)}</time>
                  </div>
                  <h3 className="mt-2 line-clamp-2 font-serif text-lg font-semibold text-text transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-6 border-y border-dashed border-border py-10 text-center">
            <p className="text-sm font-medium text-text">还没有可恢复的阅读记录</p>
            <p className="mt-2 text-sm text-muted">登录状态下阅读来信和资料后，这里会自动更新。</p>
          </div>
        )}
      </section>
    </div>
  );
}
