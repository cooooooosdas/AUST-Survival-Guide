"use client";

import { useState, useEffect } from "react";

export default function FooterYear() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  useEffect(() => {
    const id = setInterval(() => {
      const y = new Date().getFullYear();
      if (y !== year) setYear(y);
    }, 60000);
    return () => clearInterval(id);
  }, [year]);
  return <>{year}</>;
}
