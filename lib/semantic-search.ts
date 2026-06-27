import { search } from "./search";
import type { SearchItem } from "./search";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// ---- embedding 运行时懒加载 ----
import { embedText } from "./embedding";

const EMBEDDINGS_PATH = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "embeddings.json");

// ---- 预计算 embedding 索引 ----
export interface EmbeddingRecord extends SearchItem {
  vector: number[];
}

let EMBEDDINGS: EmbeddingRecord[] | null = null;
let loadPromise: Promise<EmbeddingRecord[]> | null = null;

function loadEmbeddingsSync(): EmbeddingRecord[] {
  if (EMBEDDINGS) return EMBEDDINGS;
  try {
    const raw = readFileSync(EMBEDDINGS_PATH, "utf8");
    EMBEDDINGS = JSON.parse(raw) as EmbeddingRecord[];
    return EMBEDDINGS;
  } catch {
    return [];
  }
}

export async function getEmbeddings(): Promise<EmbeddingRecord[]> {
  if (EMBEDDINGS) return EMBEDDINGS;
  if (loadPromise) return loadPromise;
  loadPromise = Promise.resolve(loadEmbeddingsSync());
  return loadPromise;
}

function cosineSim(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

export async function semanticSearch(query: string, topK = 15): Promise<SearchItem[]> {
  const records = await getEmbeddings();
  if (records.length === 0) return [];

  const queryVec = await embedText(query);
  const scored = records
    .map((r) => ({
      ...r,
      score: cosineSim(queryVec, r.vector) as number,
    }))
    .filter((r) => r.score > 0.05)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored.map((r) => { const { vector: _vec, ...rest } = r; return rest; });
}

const RRF_K = 60;

export async function hybridSearch(query: string): Promise<SearchItem[]> {
  const [keywordResults, semanticResults] = await Promise.all([
    Promise.resolve(search(query)),
    semanticSearch(query, 20),
  ]);

  const scores = new Map<string, { item: SearchItem; kwRank: number; semRank: number }>();

  keywordResults.forEach((r, i) => {
    scores.set(r.id, { item: r, kwRank: i + 1, semRank: Infinity });
  });

  semanticResults.forEach((r, i) => {
    const existing = scores.get(r.id);
    if (existing) {
      existing.semRank = i + 1;
    } else {
      scores.set(r.id, { item: r, kwRank: Infinity, semRank: i + 1 });
    }
  });

  const fused = Array.from(scores.values()).map(({ item, kwRank, semRank }) => ({
    ...item,
    score: 1 / (RRF_K + kwRank) * 0.4 + 1 / (RRF_K + semRank) * 0.6,
  }));

  return fused.sort((a, b) => b.score - a.score).slice(0, 20);
}
