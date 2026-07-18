"use client";

import dynamic from "next/dynamic";

// Browser-only interactions stay in separate chunks and load after hydration.
const CursorGlow = dynamic(() => import("@/components/CursorGlow"), { ssr: false });
const ClickRipple = dynamic(() => import("@/components/ClickRipple"), { ssr: false });
const AIChat = dynamic(() => import("@/components/AIChat"), { ssr: false });

export default function SceneEffects() {
  return (
    <>
      <CursorGlow />
      <ClickRipple />
      <AIChat />
    </>
  );
}
