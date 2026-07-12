/**
 * RAG (Retrieval Augmented Generation) pipeline for the AI chat.
 *
 * Flow:
 *   1. Load embeddings from bundled JS module (Vercel) or data/embeddings.json (local)
 *   2. Embed the user's query using the same embedding model
 *   3. Find top-k most similar content items via cosine similarity
 *   4. Return formatted context string for the LLM prompt
 */

import { FULL_INDEX, type SearchItem } from "@/lib/search";
import { embed } from "@/lib/rag/embedding";

// Try bundled module first (Vercel serverless), fall back to filesystem (local dev)
import { EMBEDDINGS_DATA as bundledEmbeddings } from "./embeddings-data";

export interface RagContext {
  /** Raw search items retrieved */
  items: SearchItem[];
  /** Formatted context string to inject into LLM prompt */
  context: string;
  /** Whether retrieval succeeded */
  ready: boolean;
}

const ITEM_MAP = new Map(FULL_INDEX.map((item) => [item.id, item]));

let cachedRecords: Array<{ id: string; vector: number[] }> = [];

function loadEmbeddings(): Array<{ id: string; vector: number[] }> {
  if (cachedRecords.length > 0) return cachedRecords;
  // Use bundled data (works on Vercel where filesystem reads fail)
  if (bundledEmbeddings && bundledEmbeddings.length > 0) {
    cachedRecords = bundledEmbeddings;
    return cachedRecords;
  }
  cachedRecords = [];
  return cachedRecords;
}

function cosineSim(a: number[], b: number[]): number {
  let dot = 0,
    na = 0,
    nb = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Run the RAG pipeline: embed query → retrieve top-k → format context.
 */
export async function retrieve(query: string, topK = 8): Promise<RagContext> {
  try {
    const records = loadEmbeddings();
    if (records.length === 0) {
      return { items: [], context: "", ready: false };
    }

    const queryVec = await embed(query);
    const scored = records
      .map((r) => ({
        id: r.id,
        vector: r.vector,
        score: cosineSim(queryVec, r.vector),
      }))
      .filter((r) => r.score > 0.15)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    const items: SearchItem[] = [];
    for (const s of scored) {
      const item = ITEM_MAP.get(s.id);
      if (item) items.push(item);
    }

    if (items.length === 0) {
      return { items: [], context: "", ready: false };
    }

    const context = items
      .map((item, i) => {
        const typeLabel = item.type === "letter" ? "来信" : item.type === "link" ? "链接" : "板块";
        let block = `[${i + 1}] 【${typeLabel}】${item.title}\n链接: ${item.href}`;
        if (item.text) block += `\n内容: ${item.text.slice(0, 300)}`;
        if (item.tags.length > 0) block += `\n标签: ${item.tags.join(", ")}`;
        if (item.groupTitle) block += `\n分组: ${item.groupTitle}`;
        return block;
      })
      .join("\n\n");

    return { items, context, ready: true };
  } catch (err) {
    console.error("RAG retrieval failed:", err);
    return { items: [], context: "", ready: false };
  }
}
