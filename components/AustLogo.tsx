"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function AustLogo({ className = "" }: { className?: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const ink = isDark ? "#F7F3F9" : "#241D2A";
  const muted = isDark ? "#D9CEDF" : "#514959";
  const panel = isDark ? "#2A2331" : "#FFFFFF";
  const border = isDark ? "#685370" : "#E1DBE5";
  const primary = isDark ? "#D5AEE9" : "#623B77";
  const accent = isDark ? "#D8AE85" : "#91643F";

  return (
    <svg
      viewBox="0 0 158 42"
      className={`h-9 w-auto shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="安理大生存指南"
      role="img"
    >
      <defs>
        <linearGradient id="aust-logo-mark" x1="4" y1="4" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor={panel} />
          <stop offset="1" stopColor={isDark ? "#3B2B47" : "#EFE8F3"} />
        </linearGradient>
        <linearGradient id="aust-logo-line" x1="11" y1="14" x2="31" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor={primary} />
          <stop offset="1" stopColor={accent} />
        </linearGradient>
      </defs>

      <rect
        x="1"
        y="1"
        width="40"
        height="40"
        rx="12"
        fill="url(#aust-logo-mark)"
        stroke={border}
        strokeWidth="1.4"
      />
      <path
        d="M10.5 13.2C15.2 10.8 18.9 10.8 21 13.2C23.1 10.8 26.8 10.8 31.5 13.2V27.4C26.8 25.1 23.1 25.1 21 27.4C18.9 25.1 15.2 25.1 10.5 27.4V13.2Z"
        fill={isDark ? "#19151E" : "#F8F7F9"}
        stroke={ink}
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M14 17.2C16.6 16.3 18.8 16.6 21 18.2C23.2 16.6 25.4 16.3 28 17.2M14 22.1C16.6 21.2 18.8 21.5 21 23.1C23.2 21.5 25.4 21.2 28 22.1"
        stroke="url(#aust-logo-line)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M21 13.6V27" stroke={border} strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="31.5" cy="8.8" r="2.2" fill={accent} />
      <circle cx="10.5" cy="32.4" r="2.2" fill={primary} />

      <text x="50" y="18" fontFamily="Georgia, 'Noto Serif SC', serif" fontWeight="700" fontSize="15.5" fill={ink}>
        安理大
      </text>
      <text x="50" y="32" fontFamily="var(--font-geist-mono), 'SFMono-Regular', Consolas, monospace" fontWeight="500" fontSize="10" fill={muted} letterSpacing="0.8">
        SURVIVAL GUIDE
      </text>
    </svg>
  );
}
