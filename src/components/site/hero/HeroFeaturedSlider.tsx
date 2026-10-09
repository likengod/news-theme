import React from "react";
import { Link } from "@tanstack/react-router";
import { MinRead } from "../HeadlineArticle";
import { formatViews } from "@/lib/news-data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ScriptAdRenderer } from "@/components/site/ScriptAdRenderer";
import type { AdSlideItem } from "@/lib/site-content";

interface HeroFeaturedSliderProps {
  leads: any[];
  featuredAds: AdSlideItem[];
  featuredAdMode: string;
  featuredAdScript: string;
  showMultiple: boolean;
  autoSlide: boolean;
  slideInterval: number;
  isEnterprisePlus: boolean;
}

export default function HeroFeaturedSlider({
  leads,
  featuredAds,
  featuredAdMode,
  featuredAdScript,
  showMultiple,
  autoSlide,
  slideInterval,
  isEnterprisePlus,
}: HeroFeaturedSliderProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const plugins = React.useMemo(() => {
    return [
      Autoplay({
        delay: slideInterval,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        active: autoSlide && showMultiple,
        playOnInit: autoSlide && showMultiple,
      }),
    ];
  }, [slideInterval, autoSlide, showMultiple]);

  const carouselItems: React.ReactNode[] = [];
  leads.forEach((featured: any, index: number) => {
    if (!featured) return;

    carouselItems.push(
      <CarouselItem key={`news-${index}`}>
        <Link to="/news/$slug" params={{ slug: featured.slug || "sample" }} className="group block">
          <div className="overflow-hidden relative rounded-xl border border-border/40 bg-black/5 dark:bg-black/30 flex items-center justify-center">
            <img
              src={featured.img}
              alt=""
              aria-hidden="true"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding={index === 0 ? "sync" : "async"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
              width={800}
              height={500}
              className="w-full h-auto max-h-[480px] object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
          <h2 className="headline mt-3 text-xl font-bold text-foreground group-hover:underline md:mt-4 md:text-3xl">
            {featured.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {featured.dek ?? featured.excerpt ?? ""}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground md:hidden">
            <span>{featured.author}</span>
            <span>&bull;</span>
            <span className="inline-flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {formatViews(Number(featured.views) || 0)} views
            </span>
            <span>&bull;</span>
            <span className="font-bold text-foreground">{featured.kicker || "Featured"}</span>
          </div>

          <div className="hidden md:block">
            <MinRead seed={featured.title} kicker={featured.kicker || "Featured"} author={featured.author} views={featured.views} />
          </div>
        </Link>
      </CarouselItem>,
    );

    if (showMultiple && isEnterprisePlus) {
      if (featuredAdMode === "script" && featuredAdScript) {
        carouselItems.push(
          <CarouselItem key={`slide-script-${index}`}>
            <div className="relative flex aspect-[16/10] w-full items-center justify-center bg-slate-50 overflow-hidden">
              <div className="absolute top-3 left-3 z-20 pointer-events-none">
                <span className="inline-flex items-center rounded-md bg-black/80 px-2.5 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-xs border border-white/20">
                  SPONSORED
                </span>
              </div>
              <ScriptAdRenderer code={featuredAdScript} />
            </div>
          </CarouselItem>,
        );
      } else if (featuredAdMode === "image" && featuredAds.length > 0) {
        const ad = featuredAds[index % featuredAds.length];
        const adImg = ad.imageLandscape || ad.image;
        if (adImg && !adImg.includes("placehold.co")) {
          carouselItems.push(
            <CarouselItem key={`showcase-${index}`}>
              <a
                href={ad.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group/showcase block w-full"
              >
                <div className="relative overflow-hidden bg-amber-500 min-h-[200px]">
                  <img
                    src={adImg}
                    alt={ad.label || "Featured Content"}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={500}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover/showcase:scale-105"
                  />
                  <div className="absolute top-3 left-3 z-20 pointer-events-none">
                    <span className="inline-flex items-center rounded-md bg-black/80 px-2.5 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-xs border border-white/20">
                      {ad.label ? ad.label.toUpperCase() : "PROMOTED"}
                    </span>
                  </div>
                </div>
              </a>
            </CarouselItem>,
          );
        }
      }
    }
  });

  return (
    <div className="relative group/carousel w-full max-w-full min-w-0 overflow-hidden" suppressHydrationWarning>
      <Carousel setApi={setApi} plugins={plugins} className="w-full max-w-full" opts={{ loop: true }}>
        <CarouselContent suppressHydrationWarning>{carouselItems}</CarouselContent>

        {count > 1 && (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex aspect-[16/10] items-center justify-between opacity-0 transition-opacity duration-300 group-hover/carousel:opacity-100">
            <CarouselPrevious className="pointer-events-auto static h-8 w-6 translate-x-0 translate-y-0 rounded-r-md rounded-l-none border-none bg-black/50 text-white hover:bg-black/70" />
            <CarouselNext className="pointer-events-auto static h-8 w-6 translate-x-0 translate-y-0 rounded-l-md rounded-r-none border-none bg-black/50 text-white hover:bg-black/70" />
          </div>
        )}

        {count > 1 && (
          <div className="mt-4 flex justify-center sm:pointer-events-none sm:absolute sm:inset-x-0 sm:top-0 sm:mt-0 sm:aspect-[16/10] sm:items-end sm:pb-3">
            <div className="flex items-center gap-0.5 rounded-full sm:pointer-events-auto sm:bg-white/30 sm:px-1.5 sm:py-0.5 sm:backdrop-blur-sm">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className="flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    api?.scrollTo(i);
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <span
                    className={`block h-2.5 w-2.5 sm:h-2 sm:w-2 rounded-full transition-all ${
                      i === current ? "bg-slate-900" : "bg-slate-300 sm:bg-slate-600/60"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </Carousel>
    </div>
  );
}
