type Props = {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
};

export function ArticleHero({ src, alt, caption, credit }: Props) {
  return (
    <figure className="mb-8">
      <img
        src={src}
        alt={alt}
        width={1200}
        height={675}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="aspect-[16/9] w-full object-cover"
      />
      {(caption || credit) && (
        <figcaption className="mt-3 border-b border-border pb-3 text-xs leading-relaxed text-muted-foreground">
          {caption && <span className="italic">{caption}</span>}
          {caption && credit && <span className="mx-2 text-border">|</span>}
          {credit && <span className="font-medium uppercase tracking-wider">{credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}
