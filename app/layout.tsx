import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import { Noto_Serif_SC } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import AIChat from "@/components/AIChat";
import ParticleCanvas from "@/components/effects/ParticleCanvas";
import CursorGlow from "@/components/CursorGlow";
import ClickRipple from "@/components/ClickRipple";
import { createClient } from "@/lib/supabase/server";
import { SITE, siteUrl } from "@/lib/site";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSerif = Noto_Serif_SC({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const baseUrl = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE.name,
    template: `%s · ${SITE.shortName}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.author }],
  creator: SITE.author,
  publisher: SITE.author,
  icons: {
    icon: "/images/aust-logo.png",
    apple: "/images/aust-logo.png",
  },
  keywords: [
    "安徽理工大学",
    "AUST",
    "新生",
    "生存指南",
    "学长来信",
    "资源导航",
    "计算机学院",
    "软件工程",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: baseUrl,
    siteName: SITE.shortName,
    title: SITE.name,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "education",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#1E3A5F" },
  ],
  width: "device-width",
  initialScale: 1,
};

async function loadUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const meta = (user.user_metadata ?? {}) as { name?: string };
    let avatarUrl: string | null = null;
    let displayName: string | null = meta.name ?? null;
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      if (profile) {
        avatarUrl = profile.avatar_url ?? null;
        if (!displayName) displayName = profile.display_name ?? null;
      }
    } catch (e) {
      console.error("Failed to load user profile:", e);
      // profile 查询失败时退回到 metadata
    }
    return {
      email: user.email ?? null,
      displayName,
      avatarUrl,
    };
  } catch (e) {
    console.error("Failed to load user:", e);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await loadUser();
  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} ${notoSerif.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* 预连接外部域名，加速资源加载 */}
      {sbUrl && (
        <>
          <link rel="preconnect" href={sbUrl} crossOrigin="anonymous" />
          <link rel="preconnect" href={`${sbUrl}/storage/v1`} crossOrigin="anonymous" />
        </>
      )}
      {/* 防止深色模式闪烁：在首屏渲染前读取 localStorage */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var t = localStorage.getItem('theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            })();
          `,
        }}
      />
      <body className="min-h-full flex flex-col bg-bg text-text">
        <ThemeProvider>
        <ParticleCanvas />
        <CursorGlow />
        <ClickRipple />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-white"
        >
          跳到正文
        </a>
        <Header user={user} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
        <AIChat />
        </ThemeProvider>
      </body>
    </html>
  );
}
