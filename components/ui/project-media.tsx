import Image from "next/image";
import { LoopClip } from "@/components/ui/loop-clip";
import type { Project } from "@/lib/content/projects";
import { cn } from "@/lib/utils";

type Media = NonNullable<Project["media"]>;

/**
 * A real recording or screenshot of a project.
 * Long videos load nothing until the visitor presses play. Short silent clips
 * loop, and fall back to their poster frame when reduced motion is requested.
 */
export function ProjectMedia({
  media,
  className,
  sizes = "(min-width: 800px) 760px, 100vw",
  showCaption = true,
}: {
  media: Media;
  className?: string;
  sizes?: string;
  showCaption?: boolean;
}) {
  const ratio = { aspectRatio: `${media.width} / ${media.height}` };

  return (
    <figure className={cn("overflow-hidden rounded-[14px] border border-border bg-surface", className)}>
      {media.type === "video" && media.loop ? (
        <div className="relative" style={ratio}>
          {media.poster ? (
            <Image
              src={media.poster}
              alt={media.alt}
              width={media.width}
              height={media.height}
              sizes={sizes}
              className="h-full w-full object-cover"
            />
          ) : null}
          <LoopClip
            src={media.src}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      ) : media.type === "video" ? (
        <video
          className="block h-auto w-full bg-black"
          style={ratio}
          controls
          playsInline
          preload="none"
          poster={media.poster}
          aria-label={media.alt}
        >
          <source src={media.src} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          sizes={sizes}
          className="h-auto w-full"
        />
      )}
      {showCaption && media.caption ? (
        <figcaption className="border-t border-border px-4 py-3 text-sm leading-relaxed text-muted">
          {media.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
