import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getHomepageArticles } from "@/lib/articles.functions";

export function BreakingBar({ articles: propArticles }: { articles?: any[] }) {
  const hasPropArticles = Array.isArray(propArticles) && propArticles.length > 0;

  // Smart Background Polling (Option A):
  // Polls every 30s safely without holding persistent open sockets.
  // Responses hit Cloudflare / in-memory micro-cache in 2ms without touching MySQL.
  const { data: fetchedArticles = [] } = useQuery({
    queryKey: ["homepageArticlesBreaking"],
    queryFn: () => getHomepageArticles({ data: 10 }),
    initialData: hasPropArticles ? propArticles : undefined,
    staleTime: 30000,
    refetchInterval: 30000, // 30-second background poll
    refetchIntervalInBackground: false, // Pauses when tab is hidden to save user battery & mobile data
    refetchOnWindowFocus: true, // Instantly checks for fresh news when tab is reopened
  });

  const articles =
    fetchedArticles && fetchedArticles.length > 0
      ? fetchedArticles
      : propArticles || [];

  const [i, setI] = useState(0);

  useEffect(() => {
    if (articles.length <= 1) {
      setI(0);
      return;
    }
    const id = setInterval(() => setI((p) => (p + 1) % articles.length), 5000);
    return () => clearInterval(id);
  }, [articles.length]);

  const currentArticle = articles[i];
  const headlineText = currentArticle
    ? `${currentArticle.category ? `${currentArticle.category}: ` : ""}${currentArticle.title}`
    : "Welcome to Today Tripura — Stay tuned for live breaking news updates.";

  return (
    <div className="border-b border-border bg-foreground text-background">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 text-sm">
        <span className="inline-flex items-center gap-1.5 bg-[#dc2626] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          Live
        </span>
        <div className="relative flex-1 overflow-hidden h-5">
          {currentArticle?.slug ? (
            <Link
              key={currentArticle.slug + i}
              to="/news/$slug"
              params={{ slug: currentArticle.slug }}
              className="absolute inset-0 truncate headline-slide hover:underline hover:text-white/90 text-xs sm:text-sm font-medium"
            >
              {headlineText}
            </Link>
          ) : (
            <span key={i} className="absolute inset-0 truncate headline-slide text-xs sm:text-sm">
              {headlineText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
