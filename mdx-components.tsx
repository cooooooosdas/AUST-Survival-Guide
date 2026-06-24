import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import Aside from "@/components/Aside";
import Takeaways from "@/components/Takeaways";

const components: MDXComponents = {
  h1: (props) => (
    <h1
      className="mt-12 scroll-mt-24 text-3xl font-semibold tracking-tight text-primary md:text-4xl"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-12 scroll-mt-24 border-b border-border pb-2 text-2xl font-semibold text-primary"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-8 scroll-mt-24 text-xl font-semibold text-text"
      {...props}
    />
  ),
  h4: (props) => (
    <h4
      className="mt-6 scroll-mt-24 text-lg font-semibold text-text"
      {...props}
    />
  ),
  p: (props) => (
    <p className="mt-5 leading-[1.85] text-text" {...props} />
  ),
  a: ({ href, children, ...rest }: ComponentPropsWithoutRef<"a">) => {
    const isExternal = href && /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="text-primary underline-offset-4 hover:underline"
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href ?? "#"}
        className="text-primary underline-offset-4 hover:underline"
      >
        {children}
      </Link>
    );
  },
  ul: (props) => (
    <ul
      className="mt-4 list-disc space-y-2 pl-6 marker:text-accent"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mt-4 list-decimal space-y-2 pl-6 marker:text-accent"
      {...props}
    />
  ),
  li: (props) => <li className="leading-[1.85]" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mt-6 border-l-4 border-accent bg-bg-alt px-5 py-3 text-muted italic"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-t border-border" />,
  code: (props) => (
    <code
      className="rounded bg-bg-alt px-1.5 py-0.5 font-mono text-[0.9em] text-primary"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="mt-6 overflow-x-auto rounded-md border border-border bg-bg-alt p-4 text-sm leading-relaxed"
      {...props}
    />
  ),
  table: (props) => (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b border-border px-3 py-2 text-left font-semibold text-primary"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border-b border-border/60 px-3 py-2" {...props} />
  ),
  strong: (props) => (
    <strong className="font-semibold text-primary" {...props} />
  ),
  em: (props) => <em className="text-text" {...props} />,
  Aside,
  Takeaways,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
