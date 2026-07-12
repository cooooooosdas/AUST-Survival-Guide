/**
 * Content indexer — generates embeddings for all site content and writes them to data/embeddings.json.
 *
 * Usage:
 *   npx tsx scripts/build-embeddings.ts
 *
 * Required env:
 *   EMBEDDING_API_KEY  (or AI_API_KEY)
 *   EMBEDDING_API_URL  (default: https://api.openai.com/v1/embeddings)
 *   EMBEDDING_MODEL    (default: text-embedding-3-small)
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FULL_INDEX, type SearchItem } from "@/lib/search";
import { embedBatch } from "@/lib/rag/embedding";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "data");
const OUT_FILE = join(OUT_DIR, "embeddings.json");

function combineText(item: SearchItem): string {
  const parts = [
    `标题: ${item.title}`,
    item.text ? `描述: ${item.text}` : null,
    item.tags.length > 0 ? `标签: ${item.tags.join(", ")}` : null,
    item.section ? `分类: ${item.section}` : null,
    item.groupTitle ? `分组: ${item.groupTitle}` : null,
  ].filter(Boolean);
  return parts.join("\n");
}

async function main() {
  try {
    mkdirSync(OUT_DIR, { recursive: true });
  } catch {
    // exists
  }

  console.log(`Indexing ${FULL_INDEX.length} content items...`);

  // Load existing embeddings to avoid re-embedding unchanged items
  let existing: Record<string, { vector: number[] }> = {};
  try {
    const raw = readFileSync(OUT_FILE, "utf8");
    const arr = JSON.parse(raw) as Array<{ id: string; vector: number[] }>;
    for (const r of arr) {
      existing[r.id] = r;
    }
    console.log(`  Loaded ${Object.keys(existing).length} existing embeddings`);
  } catch {
    console.log("  No existing embeddings file, starting fresh");
  }

  const toEmbed: { id: string; text: string }[] = [];
  const idToItem = new Map<string, SearchItem>();
  for (const item of FULL_INDEX) {
    idToItem.set(item.id, item);
    const combined = combineText(item);
    // Skip if existing embedding looks valid (same length)
    if (existing[item.id]?.vector?.length > 0) {
      continue;
    }
    toEmbed.push({ id: item.id, text: combined });
  }

  if (toEmbed.length === 0) {
    console.log("  All items already embedded. Nothing to do.");
    return;
  }

  console.log(`  Embedding ${toEmbed.length} new items (${toEmbed.length} / ${FULL_INDEX.length})...`);

  const texts = toEmbed.map((t) => t.text);
  const vectors = await embedBatch(texts, 5);

  // Merge with existing
  const merged: Array<{ id: string; vector: number[] }> = [];
  for (const item of FULL_INDEX) {
    const existingVec = existing[item.id]?.vector;
    if (existingVec && existingVec.length > 0) {
      merged.push({ id: item.id, vector: existingVec });
    } else {
      const idx = toEmbed.findIndex((t) => t.id === item.id);
      merged.push({ id: item.id, vector: vectors[idx] });
    }
  }

  writeFileSync(OUT_FILE, JSON.stringify(merged, null, 2), "utf8");
  console.log(`  Saved ${merged.length} embeddings to ${OUT_FILE}`);
  console.log("Done.");
}

main().catch((err) => {
  console.error("Embedding indexer failed:", err);
  process.exit(1);
});
