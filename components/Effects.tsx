"use client";

import CursorGlow from "@/components/CursorGlow";
import ClickRipple from "@/components/ClickRipple";
import StarField from "@/components/StarField";

export default function Effects() {
  return (
    <>
      <StarField count={12} />
      <CursorGlow />
      <ClickRipple />
    </>
  );
}
