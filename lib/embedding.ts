import { pipeline, env } from "@xenova/transformers";

// @ts-expect-error transformers pipeline types are too broad for feature-extraction
type EmbeddingPipeline = Awaited<ReturnType<typeof pipeline>>;

env.allowLocalModels = false;

let cached: EmbeddingPipeline | null = null;
let loading: Promise<EmbeddingPipeline | null> | null = null;

export async function getEmbedder(): Promise<EmbeddingPipeline> {
  if (cached) return cached;
  if (loading) {
    const result = await loading;
    if (result) cached = result;
    return result!;
  }
  // @ts-expect-error transformers pipeline types are too broad for feature-extraction
  loading = pipeline("feature-extraction", "Xenova/paraphrase-multilingual-MiniLM-L12-v2");
  const result = await loading;
  if (result) cached = result;
  return result!;
}

export async function embedText(text: string): Promise<number[]> {
  const pipe = await getEmbedder();
  // @ts-expect-error transformers pipeline types are too broad for feature-extraction
  const output = await pipe(text, { pooling: "mean", normalize: true });
  // @ts-expect-error transformers pipeline types are too broad for feature-extraction
  return Array.from(output.data);
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const results: number[][] = [];
  for (const text of texts) {
    results.push(await embedText(text));
  }
  return results;
}
