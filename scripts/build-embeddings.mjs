import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline, env } from "@xenova/transformers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");

// Use Chinese mirror for HuggingFace model downloads
env.remoteHost = "https://hf-mirror.com";
env.HF_END_POINT = "https://hf-mirror.com";
env.allowLocalModels = false;

// ---- extract array from source using bracket matching ----
function extractArray(source, varName) {
  const marker = `export const ${varName}`;
  const startIdx = source.indexOf(marker);
  if (startIdx < 0) return [];
  const eqIdx = source.indexOf("=", startIdx);
  if (eqIdx < 0) return [];
  const arrStart = source.indexOf("[", eqIdx);
  if (arrStart < 0) return [];

  // Find matching closing bracket
  let depth = 0;
  for (let i = arrStart; i < source.length; i++) {
    if (source[i] === "[") depth++;
    else if (source[i] === "]") {
      depth--;
      if (depth === 0) {
        const arrStr = source.slice(arrStart, i + 1);
        try {
          return new Function(`return ${arrStr}`)();
        } catch {
          return [];
        }
      }
    }
  }
  return [];
}

// ---- extract object from source ----
function extractObject(source, varName) {
  const marker = `export const ${varName}`;
  const startIdx = source.indexOf(marker);
  if (startIdx < 0) return {};
  const eqIdx = source.indexOf("=", startIdx);
  if (eqIdx < 0) return {};
  const objStart = source.indexOf("{", eqIdx);
  if (objStart < 0) return {};

  let depth = 0;
  for (let i = objStart; i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") {
      depth--;
      if (depth === 0) {
        const objStr = source.slice(objStart, i + 1);
        try {
          return new Function(`return ${objStr}`)();
        } catch {
          return {};
        }
      }
    }
  }
  return {};
}

// ---- build search index ----
function buildIndex() {
  const index = [];

  // 1. Letters - parse MDX metadata
  const lettersDir = path.join(ROOT, "content", "letters");
  if (fs.existsSync(lettersDir)) {
    for (const file of fs.readdirSync(lettersDir).filter((f) => f.endsWith(".mdx"))) {
      const raw = fs.readFileSync(path.join(lettersDir, file), "utf8");
      const slug = file.replace(/\.mdx$/, "");
      const metadata = extractObject(raw, "metadata");
      // Get excerpt from first paragraph
      const body = raw.replace(/^export\s+const\s+metadata\s*=\s*\{[\s\S]*?\};\s*/, "").trim();
      const lines = body.split("\n");
      let excerpt = "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("---")) {
          excerpt = trimmed.slice(0, 300);
          break;
        }
      }
      index.push({
        id: `letter-${slug}`,
        type: "letter",
        title: metadata.title || slug,
        text: metadata.excerpt || excerpt,
        tags: Array.isArray(metadata.tags) ? metadata.tags : [],
        href: `/letters/${slug}`,
        section: "letters",
      });
    }
  }

  // 2. Sections - parse lib/sections.ts
  const sectionsSrc = fs.readFileSync(path.join(ROOT, "lib", "sections.ts"), "utf8");
  const sections = extractArray(sectionsSrc, "SECTIONS");
  for (const s of sections) {
    index.push({
      id: `section-${s.slug}`,
      type: "section",
      title: s.title,
      text: s.description || "",
      tags: [s.group === "main" ? "资源" : "其他"],
      href: s.href,
      section: s.slug,
    });
  }

  // 3. Links - parse content/links/*.ts
  const linksDir = path.join(ROOT, "content", "links");
  if (fs.existsSync(linksDir)) {
    for (const file of fs.readdirSync(linksDir).filter((f) => f.endsWith(".ts"))) {
      const src = fs.readFileSync(path.join(linksDir, file), "utf8");
      const groups = extractArray(src, "groups");
      for (const group of groups) {
        for (const item of group.items || []) {
          index.push({
            id: `link-${group.id}-${item.title}`,
            type: "link",
            title: item.title,
            text: item.description || "",
            tags: item.tags || (item.tag ? [item.tag] : []),
            href: item.url || "#",
            section: file.replace(/\.ts$/, ""),
            groupTitle: group.title,
          });
        }
      }
    }
  }

  return index;
}

// ---- main ----
async function main() {
  console.log("Loading embedding model (paraphrase-multilingual-MiniLM-L12-v2)...");
  const embedder = await pipeline("feature-extraction", "Xenova/paraphrase-multilingual-MiniLM-L12-v2");
  console.log("Model loaded.\n");

  console.log("Building search index...");
  const index = buildIndex();
  console.log(`Found ${index.length} items.\n`);

  console.log("Computing embeddings...");
  const records = [];
  for (let i = 0; i < index.length; i++) {
    const item = index[i];
    const text = `${item.title} ${item.text} ${(item.tags || []).join(" ")}`;
    // @ts-ignore
    const output = await embedder(text, { pooling: "mean", normalize: true });
    records.push({ ...item, vector: Array.from(output.data) });

    if ((i + 1) % 20 === 0) {
      console.log(`  ${i + 1}/${index.length}...`);
    }
  }

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const outPath = path.join(DATA_DIR, "embeddings.json");
  fs.writeFileSync(outPath, JSON.stringify(records, null, 2));
  const sizeMB = (fs.statSync(outPath).size / 1024 / 1024).toFixed(1);
  console.log(`\nSaved ${records.length} embeddings to data/embeddings.json (${sizeMB} MB)`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
