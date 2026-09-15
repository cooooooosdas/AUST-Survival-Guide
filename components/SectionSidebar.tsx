"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Compass } from "lucide-react";
import { MAIN_SECTIONS } from "@/lib/sections";

export default function SectionSidebar() {
  const pathname = usePathname();
  return (
    <nav aria-label="资源板块" className="section-directory">
      <div className="eyebrow">
        <Compass size={16} aria-hidden />
        资源板块
      </div>
      <div className="section-directory-links">
        {MAIN_SECTIONS.map((section) => {
          const active =
            pathname === section.href ||
            pathname.startsWith(section.href + "/");
          return (
            <Link
              key={section.slug}
              href={section.href}
              aria-current={active ? "page" : undefined}
            >
              <span>{section.title}</span>
              <ArrowUpRight size={15} aria-hidden />
            </Link>
          );
        })}
      </div>
      <Link href="/#start-guide" className="directory-help">
        不知道从哪里开始？
        <br />
        <span>看看使用引导 →</span>
      </Link>
    </nav>
  );
}
