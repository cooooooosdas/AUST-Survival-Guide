"use client";

import { useState } from "react";

type AvatarProps = {
  src?: string | null;
  name?: string | null;
  email?: string | null;
  size?: number;
  className?: string;
  alt?: string;
};

export default function Avatar({ src, name, email, size = 36, className = "" }: AvatarProps) {
  const [broken, setBroken] = useState(false);
  const label = name || email?.split("@")[0] || "?";
  const initial = label.charAt(0).toUpperCase();
  // 稳定取色：同一字符串永远得到相同色相
  const hue = [...label].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

  if (src && !broken) {
    return (
      <img
        src={src}
        alt={alt || name || "头像"}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className={`shrink-0 rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
        onError={() => setBroken(true)}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-medium text-white select-none ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: `hsl(${hue}, 55%, 55%)`,
        fontSize: Math.max(size * 0.38, 12),
        lineHeight: 1,
      }}
      aria-label={label}
    >
      {initial}
    </div>
  );
}
