"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Browser-only interactions stay in separate chunks and load after hydration.
const ClickRipple = dynamic(() => import("@/components/ClickRipple"), { ssr: false });
const AIChat = dynamic(() => import("@/components/AIChat"), { ssr: false });
const KeyboardShortcuts = dynamic(
  () => import("@/components/KeyboardShortcuts"),
  { ssr: false }
);

export default function SceneEffects() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  return (
    <>
      {!isAuthPage && <ClickRipple />}
      {!isAuthPage && <AIChat />}
      <KeyboardShortcuts />
    </>
  );
}
