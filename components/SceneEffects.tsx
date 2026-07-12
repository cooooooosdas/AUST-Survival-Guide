"use client";

import dynamic from "next/dynamic";

// Client-only visual effects — dynamically imported so they don't bloat
// the initial JS bundle. Using ssr: false here because these components
// depend on browser APIs (canvas, mousemove, localStorage) and make no
// sense on the server. The dynamic import ensures they split into their
// own chunk loaded after hydration.
const ParticleCanvas = dynamic(() => import("@/components/effects/ParticleCanvas"), { ssr: false });
const CursorGlow = dynamic(() => import("@/components/CursorGlow"), { ssr: false });
const ClickRipple = dynamic(() => import("@/components/ClickRipple"), { ssr: false });
const AIChat = dynamic(() => import("@/components/AIChat"), { ssr: false });

export default function SceneEffects() {
  return (
    <>
      <ParticleCanvas />
      <CursorGlow />
      <ClickRipple />
      <AIChat />
    </>
  );
}
