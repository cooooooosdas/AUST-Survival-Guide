import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { LETTERS } from "@/lib/letters";
import { SECTIONS } from "@/lib/sections";
import { PROJECTS } from "@/lib/projects";

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
    {
      url: `${base}/board`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${base}/faq`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/tags`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${base}/projects`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/friends`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/privacy`,
      lastModified: today,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${base}/disclaimer`,
      lastModified: today,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  const letterEntries: MetadataRoute.Sitemap = LETTERS.map((l) => ({
    url: `${base}/letters/${l.slug}`,
    lastModified: new Date(l.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: today,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...letterEntries, ...projectEntries];
}
