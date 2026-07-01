"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function AustLogo({ className = "" }: { className?: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <svg
      viewBox="0 0 220 36"
      className={`h-8 w-auto shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="安理大生存指南"
      role="img"
    >
      {/* 书本/盾牌底形 */}
      <rect x="1" y="1" width="34" height="34" rx="8"
        fill={isDark ? "#292524" : "#FFFFFF"}
        stroke={isDark ? "#57534E" : "#E7E5E4"}
        strokeWidth="1.5"
      />
      {/* 内书页 */}
      <path d="M8 9 Q17 14 26 9" stroke={isDark ? "#F59E0B" : "#B45309"} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 18 Q17 23 26 18" stroke={isDark ? "#F59E0B" : "#B45309"} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="17" y1="9" x2="17" y2="23" stroke={isDark ? "#F59E0B" : "#B45309"} strokeWidth="1.2" strokeDasharray="2 2" />
      {/* 装饰点 */}
      <circle cx="17" cy="27" r="1.6" fill={isDark ? "#F59E0B" : "#B45309"} />

      {/* 站点名 */}
      <text x="42" y="15" fontFamily="Georgia, 'Noto Serif SC', serif" fontWeight="700" fontSize="14" fill={isDark ? "#FAFAF9" : "#1C1917"}>
        安理大
      </text>
      <text x="42" y="29" fontFamily="Georgia, serif" fontWeight="400" fontSize="11" fill={isDark ? "#A8A29E" : "#78716C"} letterSpacing="0.5">
        AUST Survival Guide
      </text>
    </svg>
  );
}
