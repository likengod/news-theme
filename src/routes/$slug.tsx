import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Share2, User } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import Advertisement from "@/components/site/Advertisement";
import { loadAds, loadAdRotation, loadSettings } from "@/lib/site-content";
import { ArchiveFinder } from "@/components/site/ArchiveFinder";
import { Views } from "@/components/site/Views";
import { getCategoryData } from "@/lib/taxonomy.functions";

const FESTIVE_GRADIENT_MAP: Record<string, string> = {
  "indian-flag": "linear-gradient(to right, #FF9933, #000080, #138808)",
  "diwali": "linear-gradient(to right, #FF8008, #FFC837, #FF007F, #7F00FF)",
  "sunset": "linear-gradient(to right, #F5576C, #F093FB)",
  "neon": "linear-gradient(to right, #FF007F, #7F00FF, #00F0FF)",
  "ocean": "linear-gradient(to right, #00c6ff, #0072ff)",
  "forest": "linear-gradient(to right, #11998e, #38ef7d)",
};

const FONT_FAMILY_MAP: Record<string, string> = {
  inter: '"Inter", system-ui, sans-serif',
  serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
  cinzel: '"Cinzel", serif, Georgia',
  playfair: '"Playfair Display", Georgia, serif',
  roboto: '"Roboto", Arial, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
};

const SLUG_ROTATION_KEYFRAMES = `
@keyframes rot-slide-up   { from { opacity:0; transform: translateY(60px);  } to { opacity:1; transform: translateY(0); } }
@keyframes rot-slide-down { from { opacity:0; transform: translateY(-60px); } to { opacity:1; transform: translateY(0); } }
@keyframes rot-slide-left { from { opacity:0; transform: translateX(80px);  } to { opacity:1; transform: translateX(0); } }
@keyframes rot-slide-right{ from { opacity:0; transform: translateX(-80px); } to { opacity:1; transform: translateX(0); } }
@keyframes rot-fade       { from { opacity:0;                                } to { opacity:1;                         } }
@keyframes rot-zoom       { from { opacity:0; transform: scale(0.6);         } to { opacity:1; transform: scale(1);   } }
@keyframes rot-flip       { from { opacity:0; transform: rotateX(90deg);     } to { opacity:1; transform: rotateX(0); } }
`;

const TEXT_ROTATION_CSS: Record<string, React.CSSProperties> = {
  "slide-up":    { animation: "rot-slide-up    0.35s cubic-bezier(0.22,1,0.36,1) both" },
  "slide-down":  { animation: "rot-slide-down  0.35s cubic-bezier(0.22,1,0.36,1) both" },
  "slide-left":  { animation: "rot-slide-left  0.35s cubic-bezier(0.22,1,0.36,1) both" },
  "slide-right": { animation: "rot-slide-right 0.35s cubic-bezier(0.22,1,0.36,1) both" },
  "fade":        { animation: "rot-fade        0.35s ease both" },
  "zoom":        { animation: "rot-zoom        0.35s cubic-bezier(0.34,1.56,0.64,1) both" },
  "flip":        { animation: "rot-flip        0.5s  cubic-bezier(0.22,1,0.36,1) both" },
};

export const Route = createFileRoute("/$slug")({
  validateSearch: (raw: Record<string, unknown>) => ({
    page: Number(raw.page) > 0 ? Number(raw.page) : 1,
  }),
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: async ({ params, deps }) => {
    const data = await getCategoryData({
      data: { slug: params.slug, page: deps.page || 1, limit: 10 }
    });
    return data;
  },
  head: ({ params }) => {
    const title = decodeURIComponent(params.slug).replace(/-/g, " ");
    const cap = title.charAt(0).toUpperCase() + title.slice(1);
    return {
      meta: [
        { title: `${cap} – News Theme` },
        { name: "description", content: `Latest ${cap} news, analysis and reports from News Theme.` },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const loaderData = Route.useLoaderData();
  const search = Route.useSearch();
  const page = search.page || 1;
  const [settings, setSettings] = useState(() => loadSettings());

  const [showCustomText, setShowCustomText] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(loadSettings());
    };
    window.addEventListener("nt:settings-updated", handleUpdate);
    return () => window.removeEventListener("nt:settings-updated", handleUpdate);
  }, []);

  useEffect(() => {
    if (!settings.topBarWeatherCustomText) return;
    const delay = (Number(settings.topBarSwapDelay) || 5) * 1000;
    const interval = setInterval(() => {
      setShowCustomText((prev) => !prev);
    }, delay);
    return () => clearInterval(interval);
  }, [settings.topBarWeatherCustomText, settings.topBarSwapDelay]);

  if (!loaderData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-foreground">Category not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The category you requested could not be located.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const { category, featured, list, latest, totalPages = 1 } = loaderData;

  const categoryTitleStyle = settings.festiveCategoryTitleGradient && FESTIVE_GRADIENT_MAP[settings.festiveCategoryTitleGradient]
    ? {
        backgroundImage: FESTIVE_GRADIENT_MAP[settings.festiveCategoryTitleGradient],
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline-block"
      }
    : settings.festiveCategoryTitleColor
    ? { color: settings.festiveCategoryTitleColor }
    : undefined;

  const isShowingCustomAlert = Boolean(showCustomText && settings.topBarWeatherCustomText);
  // Text rotation: pure CSS keyframe animation (no tailwindcss-animate needed)
  const rotationAnimStyle = TEXT_ROTATION_CSS[settings.customAlertAnimationStyle || "slide-up"] || TEXT_ROTATION_CSS["slide-up"];

  const currentTitleStyle = {
    ...categoryTitleStyle,
    ...(isShowingCustomAlert && settings.customAlertFontFamily
      ? { fontFamily: FONT_FAMILY_MAP[settings.customAlertFontFamily] || FONT_FAMILY_MAP["inter"] }
      : {}),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Inject keyframe animations for text rotation */}
      <style dangerouslySetInnerHTML={{ __html: SLUG_ROTATION_KEYFRAMES }} />
      <Header />

      <main className="mx-auto max-w-7xl px-4 pt-2 pb-10">
        {/* Category heading */}
        <header className="border-b border-border pb-3 overflow-hidden">
          {/* Breadcrumb */}
          <nav className="mb-1 flex items-center gap-1 text-[11px] uppercase tracking-widest text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span className="mx-1">/</span>
            <span className="text-foreground font-semibold">{category.name}</span>
          </nav>
          <h1
            key={`${showCustomText ? "custom" : "default"}-${settings.customAlertAnimationStyle}`}
            className={`font-serif text-5xl font-bold md:text-6xl ${
              categoryTitleStyle ? "" : "text-foreground"
            }`}
            style={{ ...currentTitleStyle, ...rotationAnimStyle }}
          >
            {isShowingCustomAlert ? settings.topBarWeatherCustomText : category.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {category.description}
          </p>
        </header>

        {/* Featured 3-up (Only on page 1) */}
        {featured.length > 0 && (
          <section className="grid grid-cols-1 gap-8 py-8 md:grid-cols-3">
            {featured.map((f) => (
              <article key={f.title} className="flex flex-col">
                <Link to={`/news/${f.slug}`} className="group block overflow-hidden">
                  {f.img ? (
                    <img
                      src={f.img}
                      alt={f.title}
                      loading="eager"
                      // @ts-ignore
                      fetchPriority="high"
                      width={400}
                      height={300}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="aspect-[4/3] w-full bg-slate-100 flex items-center justify-center text-slate-400">No Image</div>
                  )}
                </Link>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-widest">
                  {f.kickers.map((k) => (
                    <span key={k} className="text-foreground">{k}</span>
                  ))}
                  <span className="text-muted-foreground normal-case tracking-normal">· {f.date}</span>
                </div>
                <h2 className="headline mt-2 font-serif text-xl font-bold leading-snug text-primary line-clamp-3">
                  <Link to={`/news/${f.slug}`} className="hover:underline">{f.title}</Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-5">{f.excerpt}</p>
                {/* Author + Views + Share */}
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span className="font-medium text-foreground">{f.author}</span>
                    </span>
                    <Views count={f.views} />
                  </div>
                  <button
                    type="button"
                    aria-label="Share article"
                    onClick={(e) => {
                      e.preventDefault();
                      if (navigator.share) {
                        navigator.share({ title: f.title, url: `/news/${f.slug}` });
                      } else {
                        navigator.clipboard.writeText(window.location.origin + `/news/${f.slug}`);
                        alert("Link copied!");
                      }
                    }}
                    className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                  >
                    <Share2 className="h-3 w-3" />
                    Share
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}

        {featured.length === 0 && list.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">No articles in this category yet.</p>
        )}

        {/* List + sidebar */}
        {list.length > 0 && (
          <section className="grid grid-cols-1 gap-10 border-t border-border pt-8 lg:grid-cols-[1fr_300px]">
            <div className="divide-y divide-border">
              {list.map((p, i) => (
                <React.Fragment key={p.title}>
                  <article className="grid grid-cols-[140px_1fr] gap-5 py-6 first:pt-0 md:grid-cols-[200px_1fr]">
                  <Link to={`/news/${p.slug}`} className="block overflow-hidden">
                    {p.img ? (
                      <img src={p.img} alt={p.title} className="aspect-[4/3] w-full object-cover" />
                    ) : (
                      <div className="aspect-[4/3] w-full bg-slate-100 flex items-center justify-center text-slate-400">No Image</div>
                    )}
                  </Link>
                  <div>
                    <h3 className="headline font-serif text-lg font-bold leading-snug text-primary line-clamp-2">
                      <Link to={`/news/${p.slug}`} className="hover:underline">{p.title}</Link>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">{p.excerpt}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-widest">
                      <span className="text-muted-foreground normal-case tracking-normal">{p.date}</span>
                      {p.tags.map((t) => (
                        <span key={t} className="font-semibold text-foreground">· {t}</span>
                      ))}
                    </div>
                    {/* Author + Views + Share */}
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span className="font-medium text-foreground">{p.author}</span>
                        </span>
                        <span className="ml-auto"><Views count={p.views} /></span>
                      </div>
                      <button
                        type="button"
                        aria-label="Share article"
                        onClick={(e) => {
                          e.preventDefault();
                          if (navigator.share) {
                            navigator.share({ title: p.title, url: `/news/${p.slug}` });
                          } else {
                            navigator.clipboard.writeText(window.location.origin + `/news/${p.slug}`);
                            alert("Link copied!");
                          }
                        }}
                        className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                      >
                        <Share2 className="h-3 w-3" />
                        Share
                      </button>
                    </div>
                  </div>
                </article>
                  {(i + 1) % 3 === 0 && (
                    <div className="py-6">
                      <Advertisement slot="leaderboard" aspectRatio="728 / 90" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            <aside className="space-y-8">
              {latest.length > 0 && (
                <div>
                  <h4 className="mb-4 border-b-2 border-foreground pb-2 text-xs font-bold uppercase tracking-widest text-foreground">
                    Latest Posts
                  </h4>
                  <ul className="space-y-4">
                    {latest.map((l) => (
                      <li key={l.title} className="grid grid-cols-[1fr_72px] gap-3">
                        <div>
                          <Link to={`/news/${l.slug}`} className="headline block font-serif text-sm font-bold leading-snug text-primary hover:underline line-clamp-2">
                            {l.title}
                          </Link>
                          <p className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground normal-case tracking-normal">{l.date}</p>
                        </div>
                        <Link to={`/news/${l.slug}`} className="block overflow-hidden">
                          {l.img ? (
                            <img src={l.img} alt={l.title} className="aspect-square w-full object-cover" />
                          ) : (
                            <div className="aspect-square w-full bg-slate-100 flex items-center justify-center text-slate-400">No Image</div>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Advertisement
                slot="ad3"
                aspectRatio="3/4"
              />

              <ArchiveFinder />
            </aside>
          </section>
        )}

        {/* Pagination UI (10 news items per page) */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-border pt-8">
            <Link
              to="/$slug"
              params={{ slug: category.slug }}
              search={{ page: Math.max(1, page - 1) }}
              className={`rounded border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-muted text-foreground"
              }`}
            >
              Prev
            </Link>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                to="/$slug"
                params={{ slug: category.slug }}
                search={{ page: p }}
                className={`rounded px-3.5 py-1.5 text-xs font-bold transition-colors ${
                  page === p
                    ? "bg-foreground text-background font-black shadow-sm"
                    : "border border-border text-foreground hover:bg-muted"
                }`}
              >
                {p}
              </Link>
            ))}
            <Link
              to="/$slug"
              params={{ slug: category.slug }}
              search={{ page: Math.min(totalPages, page + 1) }}
              className={`rounded border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-muted text-foreground"
              }`}
            >
              Next
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
