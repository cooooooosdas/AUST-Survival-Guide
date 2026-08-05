"use client";

import dynamic from "next/dynamic";

// Browser-only interactions stay in separate chunks and load after hydration.
const ClickRipple = dynamic(() => import("@/components/ClickRipple"), { ssr: false });
const AIChat = dynamic(() => import("@/components/AIChat"), { ssr: false });
const KeyboardShortcuts = dynamic(
  () => import("@/components/KeyboardShortcuts"),
  { ssr: false }
);

export default function SceneEffects() {
  return (
    <>
      <ClickRipple />
      <AIChat />
      <KeyboardShortcuts />
    </>
  );
}
