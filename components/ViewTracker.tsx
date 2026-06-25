"use client";

import { useEffect } from "react";

type Props = {
  targetType: string;
  targetId: string;
};

export default function ViewTracker({ targetType, targetId }: Props) {
  useEffect(() => {
    // Debounce: only track once per session per target
    const key = `viewed_${targetType}_${targetId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_type: targetType, target_id: targetId }),
    }).catch(() => {});
  }, [targetType, targetId]);

  return null;
}
