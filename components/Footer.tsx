import { SITE } from "@/lib/site";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border glass-strong rounded-t-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <div>
          © {new Date().getFullYear()} {SITE.shortName} · {SITE.author}
        </div>
        <div className="flex items-center gap-4">
          {SITE.github && (
            <a
              href={SITE.github}
              className="hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          )}
          <Link href="/privacy" className="hover:text-primary transition-colors">
            隐私政策
          </Link>
          <Link href="/disclaimer" className="hover:text-primary transition-colors">
            免责声明
          </Link>
          <span>个人博客 · 长期维护</span>
        </div>
      </div>
    </footer>
  );
}
