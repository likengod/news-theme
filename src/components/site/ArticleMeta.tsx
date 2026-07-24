import { Views } from "./Views";

type Props = {
  author?: string;
  time?: string;
  category?: string;
  views?: number;
  className?: string;
};

/** Shared meta row: By Author · time · views · CATEGORY */
export function ArticleMeta({ author, time, category, views, className = "" }: Props) {
  const parts: React.ReactNode[] = [];
  if (author) parts.push(<span key="a">By {author}</span>);
  if (time) parts.push(<span key="t">{time}</span>);
  if (typeof views === "number") parts.push(<Views key="v" count={views} />);

  return (
    <p
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] uppercase tracking-wider text-muted-foreground ${className}`}
    >
      {parts.map((node, i) => (
        <span key={i} className="inline-flex items-center gap-2">
          {i > 0 && <span aria-hidden>·</span>}
          {node}
        </span>
      ))}
      {category && (
        <span className="ml-auto inline-flex items-center gap-2">
          <span aria-hidden>·</span>
          <span className="font-bold text-foreground">{category}</span>
        </span>
      )}
    </p>
  );
}
