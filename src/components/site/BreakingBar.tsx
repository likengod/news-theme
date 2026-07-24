import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getHomepageArticles } from "@/lib/articles.functions";

export function BreakingBar() {
  const { data: articles = [] } = useQuery({
    queryKey: ["homepageArticles"],
    queryFn: () => getHomepageArticles({ data: 10 }),
  });

  const headlines = articles.length > 0
    ? articles.map((a) => `${a.category ? `${a.category}: ` : ""}${a.title}`)
    : ["Welcome to News Theme — Stay tuned for breaking news updates."];

  const [i, setI] = useState(0);

  useEffect(() => {
    if (headlines.length <= 1) {
      setI(0);
      return;
    }
    const id = setInterval(() => setI((p) => (p + 1) % headlines.length), 5000);
    return () => clearInterval(id);
  }, [headlines.length]);

  return (
    <div className="border-b border-border bg-foreground text-background">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 text-sm">
        <span className="bg-[#dc2626] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shrink-0">
          Live
        </span>
        <div className="relative flex-1 overflow-hidden h-5">
          <span
            key={i}
            className="absolute inset-0 truncate headline-slide"
          >
            {headlines[i]}
          </span>
        </div>
      </div>
    </div>
  );
}
