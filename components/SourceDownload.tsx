import manifest from "@/public/downloads/source/manifest.json";

const FILES = {
  bilibili: "bilibili-fav-classifier-source-2026-10-20.zip",
  erke: "erke-source-2026-10-20.zip",
} as const;

export default function SourceDownload({ project }: { project: keyof typeof FILES }) {
  const archive = manifest.archives.find((item) => item.file === FILES[project]);
  if (!archive) throw new Error(`Missing source archive: ${project}`);

  return (
    <section aria-label="源码下载" className="my-7 min-w-0 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
      <p className="text-sm font-medium text-text">源码分享版 · {manifest.snapshot}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {(archive.bytes / 1024).toFixed(0)} KB · ZIP 源码包 · 含中文运行说明，不含安装包或个人数据
      </p>
      <a
        href={`/downloads/source/${archive.file}`}
        download={archive.file}
        className="ui-button ui-button-primary mt-4"
      >
        下载源码 ZIP
      </a>
      <details className="mt-4 min-w-0 text-sm text-muted">
        <summary className="cursor-pointer py-2">查看 SHA-256 校验值</summary>
        <code className="mt-2 block break-all rounded-lg bg-surface p-3 text-xs leading-relaxed text-text">{archive.sha256}</code>
        <a className="ui-button ui-button-secondary mt-3" href="/downloads/source/SHA256SUMS.txt" download="SHA256SUMS.txt">
          下载校验清单
        </a>
      </details>
    </section>
  );
}
