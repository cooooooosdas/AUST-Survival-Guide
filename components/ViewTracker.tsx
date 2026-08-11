"use client";

import { useEffect } from "react";

type Props = {
  targetType: string;
  targetId: string;
  viewerId?: string | null;
};

export default function ViewTracker({ targetType, targetId, viewerId }: Props) {
  useEffect(() => {
    const identity = viewerId ?? "anonymous";
    const key = `aust_viewed_${identity}_${targetType}_${targetId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "pending");

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_type: targetType, target_id: targetId }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("view tracking failed");
        sessionStorage.setItem(key, "recorded");
      })
      .catch(() => {
        sessionStorage.removeItem(key);
      });
  }, [targetType, targetId, viewerId]);

  return null;
}
