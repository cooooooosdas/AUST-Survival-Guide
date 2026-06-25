import { LETTERS } from "@/lib/letters";
import { SITE, siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

const base = siteUrl();

export async function GET() {
  const letters = LETTERS.slice(0, 10);

  const items = letters
    .map(
      (l) => `  <item>
    <title><![CDATA[${l.title}]]></title>
    <link>${base}/letters/${l.slug}</link>
    <description><![CDATA[${l.excerpt}]]></description>
    <pubDate>${new Date(l.date).toUTCString()}</pubDate>
    <guid isPermaLink="true">${base}/letters/${l.slug}</guid>
  </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE.name} · RSS</title>
    <link>${base}</link>
    <description>${SITE.description}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
