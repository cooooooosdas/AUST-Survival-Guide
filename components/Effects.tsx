"use client";

import dynamic from "next/dynamic";

const CursorGlow = dynamic(() => import("@/components/CursorGlow").then((m) => m.default), { ssr: false });
const ClickRipple = dynamic(() => import("@/components/ClickRipple").then((m) => m.default), { ssr: false });
const StarField = dynamic(() => import("@/components/StarField").then((m) => m.default), { ssr: false });

export default function Effects() {
  return (
    <>
      <StarField count={12} />
      <CursorGlow />
      <ClickRipple />
    </>
  );
}
