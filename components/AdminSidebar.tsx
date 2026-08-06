"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  HelpCircle,
  Files,
  Sparkles,
  Settings,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  Icon: typeof LayoutDashboard;
};

const ITEMS: NavItem[] = [
  { href: "/admin/dashboard", label: "总览", Icon: LayoutDashboard },
  { href: "/admin/faq", label: "FAQ", Icon: HelpCircle },
  { href: "/admin/questions", label: "提问", Icon: Sparkles },
  { href: "/admin/submissions", label: "投稿", Icon: Files },
  { href: "/admin/projects", label: "项目", Icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="管理后台导航"
      className="flex flex-col gap-1 text-sm"
    >
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">
        Admin
      </p>
      {ITEMS.map((item) => {
        const active = pathname === item.href || pathname?.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={[
              "motion-press flex items-center gap-2 rounded-md px-2.5 py-1.5 transition-colors",
              active
                ? "bg-primary-light font-medium text-primary"
                : "text-text-secondary hover:bg-bg-alt hover:text-text",
            ].join(" ")}
          >
            <item.Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}