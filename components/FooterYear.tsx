"use client";

import { useState, useEffect, useRef } from "react";

export default function FooterYear() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const yearRef = useRef(year);

  useEffect(() => {
    const id = setInterval(() => {
      const y = new Date().getFullYear();
      if (y !== yearRef.current) {
        yearRef.current = y;
        setYear(y);
      }
    }, 60000);
    return () => clearInterval(id);
  }, []);

  return <>{year}</>;
}
