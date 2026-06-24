import Link from "next/link";
import { SECTIONS } from "@/lib/sections";
import HeroDecoration from "@/components/HeroDecoration";
import ScrollReveal from "@/components/ScrollReveal";
import SidebarInfoPanel from "@/components/SidebarInfoPanel";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      {/* 信件开场 */}
      <section className="relative border-b border-border py-16 md:py-24 overflow-hidden">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_360px]">
          <div
            className="max-w-2xl"
            style={{ animation: "fade-up 0.9s var(--ease-out-soft) forwards" }}
          >
            <p className="mb-6 text-sm tracking-widest text-accent-hover uppercase">
              A Letter to the Next One
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold leading-relaxed text-primary">
              致即将到来的你 ——
            </h1>
            <div className="mt-8 space-y-5 text-base md:text-lg leading-loose text-text">
              <p>
                去年九月我也是个对一切都懵的新生，对学校、对专业、对大学生活都没有把握。
              </p>
              <p>
                这里写下我希望那时有人告诉我的事——常用的工具、踩过的坑、走得通的路。
                不算多，但能让你少花一点摸索的时间。
              </p>
              <p>你可以从下面任意一个板块进去，随便翻。</p>
            </div>
            <p className="mt-10 text-sm text-muted">
              —— 胡希 · 软件工程 25-4 · 长期维护
            </p>
          </div>

          <div
            className="hidden md:block"
            style={{ animation: "fade-in 1.4s ease-out 0.2s both" }}
          >
            <HeroDecoration />
          </div>
        </div>
      </section>

      {/* 站点信息面板（主页独立区块） */}
      <section className="py-8 md:py-10">
        <ScrollReveal>
          <SidebarInfoPanel />
        </ScrollReveal>
      </section>

      {/* 入口卡片 */}
      <section className="py-12 md:py-16">
        <ScrollReveal>
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="text-xl font-semibold text-primary">板块入口</h2>
            <span className="text-sm text-muted">慢慢补充中</span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {SECTIONS.map((s, i) => (
            <ScrollReveal key={s.slug} delay={80 + i * 60}>
              <Link
                href={s.href}
                className="group relative flex h-full flex-col gap-2 overflow-hidden rounded-md border border-border bg-bg-alt p-5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-accent hover:bg-bg hover:shadow-[0_10px_30px_-12px_rgba(30,58,95,0.18)] active:translate-y-0 active:scale-[0.985]"
              >
                {/* 角标杏色装饰，hover 才显形 */}
                <span
                  aria-hidden
                  className="absolute -right-6 -top-6 h-12 w-12 rounded-full bg-accent/0 transition-colors duration-500 group-hover:bg-accent/50"
                />
                <div className="text-base font-medium text-primary group-hover:text-primary-hover">
                  {s.title}
                </div>
                <div className="text-sm leading-relaxed text-muted">
                  {s.description}
                </div>
                <span className="mt-auto pt-3 text-xs text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  进入 →
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
