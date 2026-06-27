import Link from "next/link";
import { PROJECTS, ALL_TECH, FEATURED_PROJECTS } from "@/lib/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "项目展示",
  description: "个人项目作品集 — 网站开发、AI 应用及课程大作业",
};

const TECH_COLORS: Record<string, string> = {
  "Next.js": "bg-[#E2E8F0] text-[#1A202C]",
  "TypeScript": "bg-[#3178C6]/10 text-[#3178C6]",
  "Tailwind CSS": "bg-[#06B6D4]/10 text-[#0891B2]",
  "Supabase": "bg-[#3ECF8E]/10 text-[#1A7F4B]",
  "React": "bg-[#61DAFB]/10 text-[#0A7FC2]",
  "Python": "bg-[#3776AB]/10 text-[#3776AB]",
  "FastAPI": "bg-[#009688]/10 text-[#00796B]",
  "Claude API": "bg-[#D97706]/10 text-[#92400E]",
  "Vue.js": "bg-[#42B883]/10 text-[#2C6E49]",
  "Node.js": "bg-[#339933]/10 text-[#1A6B1A]",
  "MySQL": "bg-[#4479A1]/10 text-[#2C5F8A]",
  "Element Plus": "bg-[#409EFF]/10 text-[#2B6CB0]",
  "HTML5": "bg-[#E34F26]/10 text-[#E34F26]",
  "CSS3": "bg-[#1572B6]/10 text-[#1572B6]",
  "JavaScript": "bg-[#F7DF1E]/20 text-[#92760A]",
  "html2canvas": "bg-[#EC4899]/10 text-[#EC4899]",
  "C 语言": "bg-[#5C6BC0]/10 text-[#5C6BC0]",
  "EasyX": "bg-[#10B981]/10 text-[#0E8F66]",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Portfolio</p>
        <h1 className="mt-3 text-3xl font-serif font-semibold text-text">项目展示</h1>
        <p className="mt-3 text-muted leading-relaxed">
          个人项目作品集，包含网站开发、AI 应用及课程大作业。持续更新中。
        </p>
      </div>

      {/* 技术栈筛选 */}
      <div className="mb-8 flex flex-wrap gap-2">
        {ALL_TECH.map((tech) => (
          <span
            key={tech}
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-medium",
              TECH_COLORS[tech] ?? "bg-bg-alt text-muted"
            )}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* 精选项目 */}
      {FEATURED_PROJECTS.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-medium text-text mb-4 flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            精选项目
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {FEATURED_PROJECTS.map((project) => (
              <ProjectCard key={project.slug} project={project} featured />
            ))}
          </div>
        </section>
      )}

      {/* 全部项目 */}
      <section>
        <h2 className="text-lg font-medium text-text mb-4">全部项目</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ProjectCard({
  project,
  featured = false,
}: {
  project: (typeof PROJECTS)[0];
  featured?: boolean;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group block rounded-xl border border-border bg-surface p-5 transition-all duration-200",
        "hover:border-primary/30 hover:shadow-md hover:shadow-primary/5",
        featured && "md:col-span-2 lg:col-span-1"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-medium text-text group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        {project.demo && (
          <span className="shrink-0 rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] text-accent">
            在线演示
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-2">
        {project.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.techStack.map((tech) => (
          <span key={tech} className={cn("rounded-md px-1.5 py-0.5 text-[10px]", TECH_COLORS[tech] ?? "bg-bg-alt text-muted")}>
            {tech}
          </span>
        ))}
      </div>
      {(project.github || project.demo) && (
        <div className="mt-3 flex items-center gap-3 text-[11px] text-muted">
          {project.github && (
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </span>
          )}
          {project.demo && (
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              在线演示
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
