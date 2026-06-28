import { ImageResponse } from "next/og";
import { LETTERS, getLetter } from "@/lib/letters";
import { SITE } from "@/lib/site";

export const alt = "学长来信";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateImageMetadata() {
  return LETTERS.map((l) => ({
    id: l.slug,
    alt: l.title,
    size,
    contentType,
  }));
}

export default async function LetterOg({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const letter = getLetter(slug);
  const title = letter?.title ?? "学长来信";
  const author = letter?.author ?? SITE.author;
  const date = letter?.date ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#FFFFFF",
          color: "#1A1A1A",
          padding: "80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "#E5C998",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#6B7280",
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#1C1917", fontWeight: 700 }}>letters</span>
          <span>·</span>
          <span>{date}</span>
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: -2,
            color: "#1C1917",
            lineHeight: 1.18,
            maxWidth: 1040,
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 24,
            borderTop: "1px solid #E5E7EB",
            fontSize: 22,
            color: "#6B7280",
          }}
        >
          <span>—— {author}</span>
          <span style={{ color: "#1C1917", fontWeight: 600 }}>
            {SITE.name}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
