export default function Loading() {
  return (
    <div
      className="mx-auto flex max-w-3xl items-center justify-center gap-4 px-6 py-24"
      role="status"
      aria-label="正在加载"
    >
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7 animate-spin text-accent"
        aria-hidden
      >
        <circle
          cx="16"
          cy="16"
          r="13"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth="2"
        />
        <path
          d="M16 3 a13 13 0 0 1 13 13"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-text">正在加载…</p>
        <p className="font-mono text-[11px] text-muted">
          稍等片刻
        </p>
      </div>
    </div>
  );
}