import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #1E3A5F 0%, #2A4A75 55%, #1E3A5F 100%)",
          color: "white",
          padding: "80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* 杏色装饰圆 */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 360,
            height: 360,
            borderRadius: 9999,
            background: "rgba(229,201,152,0.18)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -120,
            width: 320,
            height: 320,
            borderRadius: 9999,
            background: "rgba(229,201,152,0.12)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#E5C998",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          A Letter to the Next One
        </div>

        <div
          style={{
            marginTop: 36,
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1.1,
          }}
        >
          {SITE.name}
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            color: "rgba(255,255,255,0.78)",
            lineHeight: 1.45,
            maxWidth: 920,
          }}
        >
          一站式资源导航 · 学长来信 · 工具 / 微服务 / 学习 / 软件 / AI
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            color: "rgba(255,255,255,0.65)",
          }}
        >
          <span>{SITE.author} · 长期维护</span>
          <span style={{ color: "#E5C998" }}>aust 生存指南</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
