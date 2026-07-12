/**
 * RAG embedding service — calls an OpenAI-compatible embeddings API.
 *
 * Required env:
 *   EMBEDDING_API_KEY  (falls back to AI_API_KEY)
 *   EMBEDDING_API_URL  (default: https://api.openai.com/v1/embeddings)
 *   EMBEDDING_MODEL    (default: text-embedding-3-small)
 *
 * Compatible providers: OpenAI, DeepSeek, 通义千问, 智谱, OpenRouter, etc.
 */

const DEFAULT_URL = "https://api.openai.com/v1/embeddings";
const DEFAULT_MODEL = "text-embedding-3-small";

function getEmbeddingConfig() {
  const apiKey = process.env.EMBEDDING_API_KEY || process.env.AI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing EMBEDDING_API_KEY or AI_API_KEY env var");
  }
  return {
    apiKey,
    apiUrl: process.env.EMBEDDING_API_URL || DEFAULT_URL,
    model: process.env.EMBEDDING_MODEL || DEFAULT_MODEL,
  };
}

/**
 * Embed a single text string. Returns a 1536-dim vector for text-embedding-3-small.
 */
export async function embed(text: string): Promise<number[]> {
  const { apiKey, apiUrl, model } = getEmbeddingConfig();

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, input: text }),
    // Vercel Edge Runtime doesn't support keepalive, but Node.js runtime does
    // @ts-ignore — nextjs internal type
    // keepalive: true,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Embedding API error ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = (await res.json()) as { data: { embedding: number[] }[] };
  const embedding = data.data?.[0]?.embedding;
  if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
    throw new Error("Empty embedding returned from API");
  }
  return embedding;
}

/**
 * Embed multiple texts in parallel (batched).
 */
export async function embedBatch(texts: string[], concurrency = 5): Promise<number[][]> {
  const results: number[][] = [];
  for (let i = 0; i < texts.length; i += concurrency) {
    const batch = texts.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map((t) => embed(t)));
    results.push(...batchResults);
  }
  return results;
}
