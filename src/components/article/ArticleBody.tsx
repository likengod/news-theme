import { memo } from "react";
import DOMPurify from 'isomorphic-dompurify';
type Props = {
  paragraphs: string[];
  midImage?: { src: string; caption?: string; credit?: string };
};

export const ArticleBody = memo(function ArticleBody({ paragraphs, midImage }: Props) {
  // If the content is HTML, render it directly
  if (paragraphs.length === 1 && (paragraphs[0].startsWith("<") || paragraphs[0].includes("<p>"))) {
    return (
      <div 
        className="prose-article space-y-4 md:space-y-5 text-[15px] md:text-lg leading-relaxed md:leading-[1.85] text-foreground/90"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(paragraphs[0]) }}
      />
    );
  }

  const first = paragraphs[0];
  const beforeMid = paragraphs.slice(1, 4);
  const afterMid = paragraphs.slice(4);

  return (
    <div className="prose-article space-y-4 md:space-y-5 text-[15px] md:text-lg leading-relaxed md:leading-[1.85] text-foreground/90">
      {first && (
        <p className="first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-6xl first-letter:font-bold first-letter:leading-none">
          {first}
        </p>
      )}
      {beforeMid.map((p, i) => (
        <p key={`b-${i}`}>{p}</p>
      ))}

      {midImage && (
        <figure className="my-8">
          <img
            src={midImage.src}
            alt=""
            loading="lazy"
            decoding="async"
            className="aspect-[16/9] w-full object-cover"
          />
          {(midImage.caption || midImage.credit) && (
            <figcaption className="mt-3 border-b border-border pb-3 text-xs leading-relaxed text-muted-foreground">
              {midImage.caption && <span className="italic">{midImage.caption}</span>}
              {midImage.caption && midImage.credit && <span className="mx-2 text-border">|</span>}
              {midImage.credit && <span className="font-medium uppercase tracking-wider">{midImage.credit}</span>}
            </figcaption>
          )}
        </figure>
      )}

      {afterMid.map((p, i) => (
        <p key={`a-${i}`}>{p}</p>
      ))}
    </div>
  );
});
