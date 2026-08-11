import Image from "next/image";
import { ExternalLink } from "lucide-react";

type Props = {
  src: string;
  alt: string;
  caption: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  credit?: string;
  aspect?: "wide" | "landscape";
};

export default function EditorialFigure({
  src,
  alt,
  caption,
  source,
  sourceUrl,
  publishedAt,
  credit,
  aspect = "landscape",
}: Props) {
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-2xl border border-border bg-bg-alt shadow-sm">
      <div
        className={`relative overflow-hidden bg-border/30 ${
          aspect === "wide" ? "aspect-[16/9]" : "aspect-[3/2]"
        }`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 760px"
          className="object-cover"
        />
      </div>
      <figcaption className="grid gap-2 px-4 py-3 text-xs leading-5 text-muted sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:px-5">
        <span>{caption}</span>
        <span className="flex flex-wrap items-center gap-x-2 text-text-secondary sm:justify-end">
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
          >
            {source}
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
          <span>{publishedAt}</span>
          {credit && <span>{credit}</span>}
        </span>
      </figcaption>
    </figure>
  );
}
