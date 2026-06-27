import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, PROJECTS } from "@/lib/projects";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "项目未找到" };
  return {
    title: project.title,
    description: project.description,
  };
}

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

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return notFound();

  const { default: ProjectContent } = await project.load();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        返回项目列表
      </Link>

      <header className="mt-8">
        <h1 className="text-3xl font-serif font-semibold text-text">{project.title}</h1>
        <p className="mt-3 text-muted leading-relaxed">{project.description}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className={cn(
                  "rounded-lg px-2 py-0.5 text-xs font-medium",
                  TECH_COLORS[tech] ?? "bg-bg-alt text-muted"
                )}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
          <time dateTime={project.date}>{project.date}</time>
          <div className="flex items-center gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 transition-colors hover:text-primary"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 transition-colors hover:text-primary"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                在线演示
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="mt-10 card p-6 md:p-8">
        <ProjectContent />
      </div>
    </div>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
