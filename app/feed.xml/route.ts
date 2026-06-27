import { LETTERS } from "@/lib/letters";
import { SITE, siteUrl } from "@/lib/site";

const base = siteUrl();
const feedUrl = `${base}/feed.xml`;

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatRfc822(date: string): string {
  const d = new Date(date);
  return d.toUTCString();
}

export const metadata = {
  title: `${SITE.name} · RSS 订阅`,
  description: `${SITE.name}的最新学长来信与 FAQ 更新`,
};

export const dynamic = "force-static";

export async function GET() {
  const letters = [...LETTERS].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0
  );

  const items = letters
    .map(
      (l) => `<item>
  <title>${esc(l.title)}</title>
  <link>${esc(`${base}/letters/${l.slug}`)}</link>
  <guid isPermaLink="true">${esc(`${base}/letters/${l.slug}`)}</guid>
  <pubDate>${formatRfc822(l.date)}</pubDate>
  <description>${esc(l.excerpt)}</description>
  <author>${esc(l.author)}@${base.replace(/https?:\/\//, "")}</author>
</item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.name)}</title>
    <link>${esc(base)}</link>
    <description>${esc(SITE.description)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${formatRfc822(new Date().toISOString())}</lastBuildDate>
    <atom:link href="${esc(feedUrl)}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
