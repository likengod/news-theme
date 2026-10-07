import React, { useState, useEffect } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { loadSettings } from "@/lib/site-content";
import { getCategoryData } from "@/lib/taxonomy.functions";

import { CategoryHeader } from "@/components/article-page/CategoryHeader";
import { FeaturedArticles } from "@/components/article-page/FeaturedArticles";
import { ArticleList } from "@/components/article-page/ArticleList";
import { CategorySidebar } from "@/components/article-page/CategorySidebar";
import { Pagination } from "@/components/article-page/Pagination";

export const Route = createFileRoute("/$slug")({
  validateSearch: (raw: Record<string, unknown>): { page?: number } => {
    const p = Number(raw.page);
    return {
      page: p > 0 ? p : undefined,
    };
  },
  loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
  loader: async ({ params, deps }) => {
    try {
      const data = await getCategoryData({
        data: { slug: params.slug, page: deps.page || 1, limit: 10 },
      });
      if (data?.category?.redirectUrl) {
        throw redirect({ href: data.category.redirectUrl });
      }
      return data;
    } catch (err: any) {
      if (err && typeof err === "object" && ("to" in err || "href" in err || "status" in err || (err as any).isRedirect)) {
        throw err;
      }
      console.warn("[Category loader] Error:", err);
      return null;
    }
  },
  head: ({ params }) => {
    const title = decodeURIComponent(params.slug).replace(/-/g, " ");
    const cap = title.charAt(0).toUpperCase() + title.slice(1);
    return {
      meta: [
        { title: `${cap} – News Theme` },
        {
          name: "description",
          content: `Latest ${cap} news, analysis and reports from News Theme.`,
        },
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
    if (loaderData?.category?.redirectUrl && typeof window !== "undefined") {
      window.location.replace(loaderData.category.redirectUrl);
    }
  }, [loaderData?.category?.redirectUrl]);

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(loadSettings());
    };
    window.addEventListener("nt:settings-updated", handleUpdate);
    return () => window.removeEventListener("nt:settings-updated", handleUpdate);
  }, []);

  useEffect(() => {
    if (
      settings.festiveThemeEnabled === false ||
      (!settings.topBarWeatherCustomText && !settings.festiveAlertImage)
    ) {
      setShowCustomText(false);
      return;
    }
    const delay = (Number(settings.topBarSwapDelay) || 5) * 1000;
    const interval = setInterval(() => {
      setShowCustomText((prev) => !prev);
    }, delay);
    return () => clearInterval(interval);
  }, [
    settings.festiveThemeEnabled,
    settings.topBarWeatherCustomText,
    settings.festiveAlertImage,
    settings.topBarSwapDelay,
  ]);

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pt-2 pb-10">
        <CategoryHeader
          category={category}
          settings={settings}
          showCustomText={showCustomText}
        />

        <FeaturedArticles featured={featured} />

        {featured.length === 0 && list.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No articles in this category yet.
          </p>
        )}

        {list.length > 0 && (
          <section className="grid grid-cols-1 gap-10 border-t border-border pt-8 lg:grid-cols-[1fr_300px]">
            <ArticleList list={list} />
            <CategorySidebar latest={latest} />
          </section>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          categorySlug={category.slug}
        />
      </main>

      <Footer />
    </div>
  );
}
