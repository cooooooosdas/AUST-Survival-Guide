import fs from "node:fs";
import path from "node:path";

function countWords(text: string): number {
  // 去掉 JS 前导元数据（export const metadata = {...};）
  const withoutMeta = text.replace(/export\s+const\s+metadata\s*=\s*\{[\s\S]*?\};\s*/g, "");
  // 去掉 markdown 标记
  const clean = withoutMeta
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*/g, "")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`{1,3}[\s\S]*?`{1,3}/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[-*_]{2,}/g, "")
    .replace(/\n{2,}/g, " ");

  // 中文字符算 1 词，英文按空白分词
  const chinese = (clean.match(/[一-鿿]/g) ?? []).length;
  const english = clean
    .split(/\s+/)
    .filter((w) => /[a-zA-Z]/.test(w))
    .length;
  return chinese + english;
}

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "content", "letters");
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
    let total = 0;
    for (const f of files) {
      const text = fs.readFileSync(path.join(dir, f), "utf8");
      total += countWords(text);
    }
    return Response.json({ count: total });
  } catch {
    return Response.json({ count: 0 });
  }
}
