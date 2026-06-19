import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const csp = [
  "default-src 'self'",
  // Next 内联水合脚本 + Vercel Analytics
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  // Tailwind 内联样式 + 字体来源
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  // OG 图、用户头像、Supabase storage
  "img-src 'self' data: blob: https:",
  // Supabase Auth + Vercel Analytics 上报
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://va.vercel-scripts.com",
  // OAuth 跳转
  "form-action 'self' https://github.com https://*.supabase.co",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    // Turbopack 要求插件以字符串形式传入，因为 JS 函数不能跨进程序列化到 Rust
    remarkPlugins: [["remark-gfm", {}]],
    rehypePlugins: [
      ["rehype-slug", {}],
      [
        "rehype-autolink-headings",
        {
          behavior: "wrap",
          properties: { className: ["heading-anchor"] },
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
