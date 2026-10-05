import { memo } from "react";
import DOMPurify from "isomorphic-dompurify";
type Props = {
  paragraphs: string[];
  midImage?: { src: string; caption?: string; credit?: string };
};

// Enforce security on rich text embeds (sandboxing iframes, safe link openers)
if (typeof (DOMPurify as any)?.addHook === "function") {
  (DOMPurify as any).addHook("afterSanitizeAttributes", (node: Element) => {
    if (node.tagName === "IFRAME") {
      node.setAttribute(
        "sandbox",
        "allow-scripts allow-same-origin allow-presentation allow-popups",
      );
      node.setAttribute("loading", "lazy");
      node.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    }
    if (node.tagName === "A") {
      const href = node.getAttribute("href") || "";
      if (href.startsWith("http://") || href.startsWith("https://")) {
        node.setAttribute("rel", "noopener noreferrer");
        node.setAttribute("target", "_blank");
      }
    }
  });
}

const purifyConfig = {
  ADD_TAGS: ["iframe"],
  ADD_ATTR: [
    "style",
    "class",
    "target",
    "rel",
    "loading",
    "allowfullscreen",
    "sandbox",
    "referrerpolicy",
    "frameborder",
  ],
};

export const ArticleBody = memo(function ArticleBody({ paragraphs, midImage }: Props) {
  const hasHtml = paragraphs.some((p) => p.includes("<"));

  if (hasHtml || paragraphs.length === 1) {
    let fullContent = paragraphs.join("\n");
    if (!hasHtml) {
      // If it's pure text, replace newlines with <br> so it doesn't clump together
      fullContent = fullContent.replace(/\n/g, "<br/>");
    }
    return (
      <div
        className="prose-article space-y-4 md:space-y-5 text-base md:text-lg leading-relaxed md:leading-[1.85] text-foreground/90 whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(fullContent, purifyConfig) }}
      />
    );
  }

  const first = paragraphs[0];
  const beforeMid = paragraphs.slice(1, 4);
  const afterMid = paragraphs.slice(4);

  return (
    <div className="prose-article space-y-4 md:space-y-5 text-base md:text-lg leading-relaxed md:leading-[1.85] text-foreground/90">
      {first && <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(first, purifyConfig) }} />}

      {beforeMid.map((p, i) => (
        <p
          key={`b-${i}`}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(p, purifyConfig) }}
        />
      ))}

      {midImage && (
        <figure className="my-8">
          <img
            src={midImage.src}
            alt=""
            loading="lazy"
            decoding="async"
            className="aspect-[16/9] w-full object-cover rounded-lg"
          />
          {(midImage.caption || midImage.credit) && (
            <figcaption className="mt-3 border-b border-border pb-3 text-xs leading-relaxed text-muted-foreground">
              {midImage.caption && <span className="italic">{midImage.caption}</span>}
              {midImage.caption && midImage.credit && <span className="mx-2 text-border">|</span>}
              {midImage.credit && (
                <span className="font-medium uppercase tracking-wider">{midImage.credit}</span>
              )}
            </figcaption>
          )}
        </figure>
      )}

      {afterMid.map((p, i) => (
        <p
          key={`a-${i}`}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(p, purifyConfig) }}
        />
      ))}
    </div>
  );
});
