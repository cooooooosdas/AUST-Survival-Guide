"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_SECTIONS } from "@/lib/sections";

export default function SectionSidebar() {
  const pathname = usePathname();
  return (
    <aside className="md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:overflow-auto">
      <div className="mb-3 text-xs font-medium tracking-widest text-muted uppercase">
        资源板块
      </div>
      <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
        {MAIN_SECTIONS.map((s) => {
          const active = pathname === s.href || pathname?.startsWith(s.href + "/");
          return (
            <Link
              key={s.slug}
              href={s.href}
              aria-current={active ? "page" : undefined}
              className={[
                "rounded-md px-3 py-2 text-sm transition-colors whitespace-nowrap",
                active
                  ? "bg-primary text-white"
                  : "text-text hover:bg-bg-alt hover:text-primary",
              ].join(" ")}
            >
              {s.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
