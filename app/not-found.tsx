import Link from "next/link";

export const metadata = { title: "找不到页面" };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <p className="text-sm uppercase tracking-[0.2em] text-accent">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-primary">这页没找着</h1>
      <p className="mt-4 leading-relaxed text-muted">
        可能链接打错了，也可能我把页面挪走了。下面这些是你大概想去的地方：
      </p>
      <ul className="mt-8 space-y-2 text-sm">
        <li>
          <Link
            href="/"
            className="text-primary underline-offset-4 hover:underline"
          >
            ← 回首页
          </Link>
        </li>
        <li>
          <Link
            href="/letters"
            className="text-primary underline-offset-4 hover:underline"
          >
            学长来信
          </Link>
        </li>
        <li>
          <Link
            href="/board"
            className="text-primary underline-offset-4 hover:underline"
          >
            留言区
          </Link>
        </li>
      </ul>
    </div>
  );
}
