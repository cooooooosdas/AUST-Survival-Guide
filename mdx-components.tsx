import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import Aside from "@/components/Aside";
import Takeaways from "@/components/Takeaways";
import EditorialFigure from "@/components/EditorialFigure";

const components: MDXComponents = {
  h1: (props) => (
    <h1
      className="mt-12 scroll-mt-24 text-3xl font-semibold tracking-tight text-primary md:text-4xl"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-10 scroll-mt-32 break-words border-b border-border pb-2 text-xl font-semibold leading-snug text-text sm:mt-12 sm:scroll-mt-24 sm:text-2xl"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-7 scroll-mt-32 break-words text-lg font-semibold leading-snug text-text sm:mt-8 sm:scroll-mt-24 sm:text-xl"
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
    <p className="mt-5 break-words text-base leading-[1.85] text-text" {...props} />
  ),
  img: ({ src, alt }) => {
    if (typeof src !== "string") return null;
    return (
      <Image
        src={src}
        alt={alt ?? ""}
        width={1536}
        height={1024}
        sizes="(max-width: 768px) 100vw, 760px"
        className="mt-7 h-auto w-full rounded-2xl object-cover shadow-sm"
      />
    );
  },
  a: ({ href, children, ...rest }: ComponentPropsWithoutRef<"a">) => {
    const isExternal = href && /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="break-words text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary"
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href ?? "#"}
        className="break-words text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary"
      >
        {children}
      </Link>
    );
  },
  ul: (props) => (
    <ul
      className="mt-4 list-disc space-y-2 pl-5 marker:text-accent sm:pl-6"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mt-4 list-decimal space-y-2 pl-5 marker:text-accent sm:pl-6"
      {...props}
    />
  ),
  li: (props) => <li className="break-words leading-[1.85]" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mt-6 rounded-xl border border-border bg-bg-alt px-4 py-3 text-muted italic sm:px-5"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-t border-border" />,
  code: (props) => (
    <code
      className="rounded bg-bg-alt px-1.5 py-0.5 font-mono text-[0.9em] text-primary [overflow-wrap:anywhere]"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="-mx-4 mt-6 overflow-x-auto border-y border-border bg-bg-alt p-4 text-[13px] leading-relaxed sm:mx-0 sm:rounded-md sm:border sm:text-sm"
      {...props}
    />
  ),
  table: (props) => (
    <div className="-mx-4 mt-6 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      <table className="min-w-[36rem] border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b border-border px-3 py-2 text-left align-top font-semibold text-primary"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border-b border-border/60 px-3 py-2 align-top leading-relaxed" {...props} />
  ),
  strong: (props) => (
    <strong className="font-semibold text-primary" {...props} />
  ),
  em: (props) => <em className="text-text" {...props} />,
  Aside,
  Takeaways,
  EditorialFigure,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
