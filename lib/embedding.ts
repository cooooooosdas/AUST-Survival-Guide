import { pipeline, env } from "@xenova/transformers";

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
  loading = pipeline("feature-extraction", "Xenova/paraphrase-multilingual-MiniLM-L12-v2");
  const result = await loading;
  if (result) cached = result;
  return result!;
}

export async function embedText(text: string): Promise<number[]> {
  const pipe = await getEmbedder();
  // @ts-expect-error transformers pipeline overloads reject normalize:true
  const output = await pipe(text, { pooling: "mean", normalize: true });
  // @ts-expect-error output type from feature-extraction pipeline has .data
  return Array.from(output.data);
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const results: number[][] = [];
  for (const text of texts) {
    results.push(await embedText(text));
  }
  return results;
}
