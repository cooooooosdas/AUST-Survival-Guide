"use client";

import { useEffect } from "react";

export default function ClearQueryParam({ param }: { param: string }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
      window.history.replaceState({}, "", url.toString());
    }
  }, [param]);

  return null;
}
