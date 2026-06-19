export default function Loading() {
  return (
    <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-24">
      <span
        aria-hidden
        className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent"
      />
      <span
        aria-hidden
        className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent [animation-delay:120ms]"
      />
      <span
        aria-hidden
        className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent [animation-delay:240ms]"
      />
      <span className="ml-3 text-sm text-muted">正在加载…</span>
    </div>
  );
}
