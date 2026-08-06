"use client";

import { useState, useEffect } from "react";
import { Clock, CalendarCheck } from "lucide-react";

const SITE_LAUNCH_DATE = new Date("2025-06-01T00:00:00+08:00").getTime();

// 秒数计数器
function SiteUptime() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // 计算初始秒数
    const initialSeconds = Math.floor((Date.now() - SITE_LAUNCH_DATE) / 1000);
    setSeconds(initialSeconds);

    // 每秒更新一次
    const interval = setInterval(() => {
      setSeconds(Math.floor((Date.now() - SITE_LAUNCH_DATE) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 格式化秒数为带逗号的字符串
  const formatted = seconds.toLocaleString("zh-CN");

  return (
    <span className="tabular-nums font-mono text-primary" suppressHydrationWarning>
      {formatted}
    </span>
  );
}

// 建站天数计数器
function SiteDays() {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const initialDays = Math.floor((Date.now() - SITE_LAUNCH_DATE) / (1000 * 60 * 60 * 24));
    setDays(initialDays);

    // 每分钟更新一次（天数变化较慢）
    const interval = setInterval(() => {
      setDays(Math.floor((Date.now() - SITE_LAUNCH_DATE) / (1000 * 60 * 60 * 24)));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="tabular-nums font-mono text-primary" suppressHydrationWarning>
      {days.toLocaleString("zh-CN")}
    </span>
  );
}

export default function SiteUptimeCounter() {
  return (
    <div className="flex gap-4">
      <div className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-muted" strokeWidth={2} />
        <span className="text-[11px] text-muted">累计秒数</span>
        <SiteUptime />
      </div>
      <div className="flex items-center gap-1.5">
        <CalendarCheck className="h-3.5 w-3.5 text-muted" strokeWidth={2} />
        <span className="text-[11px] text-muted">建站天数</span>
        <SiteDays />
      </div>
    </div>
  );
}