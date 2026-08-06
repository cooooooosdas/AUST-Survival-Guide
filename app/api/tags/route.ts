import { NextRequest, NextResponse } from "next/server";
import { LETTERS, getLetter } from "@/lib/letters";
import { MAIN_SECTIONS } from "@/lib/sections";
import { groups as toolsGroups } from "@/content/links/tools";
import { groups as microservicesGroups } from "@/content/links/microservices";
import { groups as learnGroups } from "@/content/links/learn";
import { groups as softwareGroups } from "@/content/links/software";
import { groups as aiGroups } from "@/content/links/ai";
import { groups as thirtyGroups } from "@/content/links/30aitool";
import { createClient } from "@/lib/supabase/server";

function bad(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

// Build tag index from static content
function buildStaticTagIndex() {
  const tags: Record<
    string,
    { count: number; items: { title: string; href: string; type: string }[] }
  > = {};

  function add(tag: string, title: string, href: string, type: string) {
    if (!tag) return;
    const t = tag.toLowerCase().trim();
    if (!t) return;
    if (!tags[t]) tags[t] = { count: 0, items: [] };
    tags[t].count++;
    if (!tags[t].items.find((i) => i.href === href)) {
      tags[t].items.push({ title, href, type });
    }
  }

  // Letters
  for (const l of LETTERS) {
    for (const tag of l.tags ?? []) {
      add(tag, l.title, `/letters/${l.slug}`, "学长来信");
    }
  }

  // Links
  const allGroups = [
    ...toolsGroups,
    ...microservicesGroups,
    ...learnGroups,
    ...softwareGroups,
    ...aiGroups,
    ...thirtyGroups,
  ];
  for (const group of allGroups) {
    for (const item of group.items) {
      for (const tag of item.tags ?? []) {
        add(tag, item.title, item.url || "#", "链接");
      }
      if (item.tag) add(item.tag, item.title, item.url || "#", "链接");
    }
  }

  return tags;
}

// 合并数据库 content_submissions 的标签
async function mergeDbTags(
  base: ReturnType<typeof buildStaticTagIndex>
) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return base;
  try {
    const supabase = await createClient();
    const { data: rows } = await supabase
      .from("content_submissions")
      .select("title, tags, status, slug")
      .eq("status", "accepted")
      .limit(200);

    for (const r of rows ?? []) {
      const href = r.slug ? `/projects/${r.slug}` : "/contribute";
      for (const t of r.tags ?? []) {
        const k = t.toLowerCase().trim();
        if (!k) continue;
        if (!base[k]) base[k] = { count: 0, items: [] };
        base[k].count++;
        if (!base[k].items.find((i) => i.href === href)) {
          base[k].items.push({ title: r.title, href, type: "投稿" });
        }
      }
    }
  } catch {
    /* ignore */
  }
  return base;
}

// GET = list all tags or tag detail
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag")?.toLowerCase().trim();

  const index = await mergeDbTags(buildStaticTagIndex());

  if (tag) {
    const entry = index[tag];
    if (!entry) return NextResponse.json({ tag, items: [] });
    return NextResponse.json({ tag, ...entry });
  }

  const sorted = Object.entries(index)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([name, data]) => ({ name, ...data }));

  return NextResponse.json({ tags: sorted });
}
