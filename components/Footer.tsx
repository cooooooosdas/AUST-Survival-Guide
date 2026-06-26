export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border glass-strong rounded-t-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <div>
          © {new Date().getFullYear()} 安徽理工大学生存指南 · coolin
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/cooooooosdas/AUST-Survival-Guide"
            className="hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <span>个人博客 · 长期维护</span>
        </div>
      </div>
    </footer>
  );
}
