import { Link } from "@tanstack/react-router";

type Props = {
  title: string;
  slug?: string;
  as?: "h2" | "h3" | "h4";
  className?: string;
  lineClamp?: 2 | 3 | 4 | 5 | 6;
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80) || "sample";

/** Standard headline link → /article/$slug. Always uses `.headline` (Playfair serif). */
export function HeadlineLink({ title, slug, as: Tag = "h3", className = "", lineClamp = 2 }: Props) {
  const target = slug ?? slugify(title);
  return (
    <Tag className={`headline line-clamp-${lineClamp} ${className}`}>
      <Link
        to="/news/$slug"
        params={{ slug: target }}
        className="text-inherit hover:underline"
      >
        {title}
      </Link>
    </Tag>
  );
}
