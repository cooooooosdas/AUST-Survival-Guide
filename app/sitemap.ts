import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { LETTERS } from "@/lib/letters";
import { SECTIONS } from "@/lib/sections";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const today = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...SECTIONS.map((s) => ({
      url: `${base}${s.href}`,
      lastModified: today,
      changeFrequency: "weekly" as const,
      priority: s.group === "main" ? 0.8 : 0.6,
    })),
  ];

  const letterEntries: MetadataRoute.Sitemap = LETTERS.map((l) => ({
    url: `${base}/letters/${l.slug}`,
    lastModified: new Date(l.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...letterEntries];
}
