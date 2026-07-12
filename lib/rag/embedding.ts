/**
 * RAG embedding service — calls an OpenAI-compatible or DashScope embeddings API.
 *
 * Required env:
 *   EMBEDDING_API_KEY  (falls back to AI_API_KEY)
 *   EMBEDDING_API_URL  (default: https://dashscope.aliyuncs.com/api/v1/services/embeddings/text-embedding/text-embedding)
 *   EMBEDDING_MODEL    (default: text-embedding-v3)
 *
 * Compatible providers: DashScope (阿里云通义千问), OpenAI, DeepSeek, OpenRouter, etc.
 *
 * Supports both response formats:
 *   - OpenAI-compatible: { "data": [{ "embedding": [...] }] }
 *   - DashScope native:   { "output": { "embeddings": [{ "embedding": [...] }] } }
 */

const DEFAULT_URL = "https://dashscope.aliyuncs.com/api/v1/services/embeddings/text-embedding/text-embedding";
const DEFAULT_MODEL = "text-embedding-v3";

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
 * Extract embedding vector from either OpenAI-compatible or DashScope native response format.
 */
function extractEmbedding(data: Record<string, unknown>): number[] {
  // OpenAI-compatible: { data: [{ embedding: [...] }] }
  const openAiData = data.data as Array<{ embedding?: number[] }> | undefined;
  if (openAiData?.[0]?.embedding) {
    return openAiData[0].embedding;
  }
  // DashScope native: { output: { embeddings: [{ embedding: [...] }] } }
  const output = data.output as Record<string, unknown> | undefined;
  const dashScopeEmbeddings = output?.embeddings as Array<{ embedding?: number[] }> | undefined;
  if (dashScopeEmbeddings?.[0]?.embedding) {
    return dashScopeEmbeddings[0].embedding;
  }
  throw new Error("Unexpected embedding response format");
}

/**
 * Embed a single text string.
 */
export async function embed(text: string): Promise<number[]> {
  const { apiKey, apiUrl, model } = getEmbeddingConfig();

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, input: { texts: [text] } }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Embedding API error ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = (await res.json()) as Record<string, unknown>;
  const embedding = extractEmbedding(data);
  if (!Array.isArray(embedding) || embedding.length === 0) {
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
