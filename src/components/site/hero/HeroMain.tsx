import React from "react";
import { Link } from "@tanstack/react-router";
import { LiveVideo } from "../LiveVideo";
import { MinRead } from "../HeadlineArticle";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export function HeroMain({ activeLeads, cfg }: any) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  const leads = activeLeads || [];

  return (
    <div className="flex flex-col gap-8 lg:col-span-8 lg:border-l lg:border-border lg:pl-8">
      <article>
        <div className="relative group/carousel">
          <Carousel 
            setApi={setApi} 
            plugins={[plugin.current]}
            className="w-full"
            opts={{ loop: true }}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {leads.map((featured: any, index: number) => (
                <CarouselItem key={index}>
                  <Link to="/news/$slug" params={{ slug: featured.slug || "sample" }} className="group block">
                    <div className="overflow-hidden relative">
                      <img
                        src={featured.img}
                        alt={featured.title}
                        loading={index === 0 ? "eager" : "lazy"}
                        fetchPriority={index === 0 ? "high" : "auto"}
                        width={800}
                        height={500}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h2 className="headline mt-4 hidden text-2xl text-foreground group-hover:underline md:block md:text-3xl">
                      {featured.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {featured.dek ?? featured.excerpt ?? ""}
                    </p>
                    
                    {/* Mobile Metadata */}
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground md:hidden">
                      <span>{featured.author}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        {featured.views > 999 ? (featured.views / 1000).toFixed(1) + 'K' : featured.views} views
                      </span>
                      <span>·</span>
                      <span className="font-bold text-foreground">{featured.kicker || "Featured"}</span>
                    </div>

                    {/* Desktop Metadata */}
                    <div className="hidden md:block">
                      <MinRead seed={featured.title} kicker={featured.kicker || "Featured"} />
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Arrows Overlaid on Image */}
            <div className="pointer-events-none absolute inset-x-0 top-0 flex aspect-[16/10] items-center justify-between opacity-0 transition-opacity duration-300 group-hover/carousel:opacity-100">
              <CarouselPrevious className="pointer-events-auto static h-8 w-6 translate-x-0 translate-y-0 rounded-r-md rounded-l-none border-none bg-black/50 text-white hover:bg-black/70" />
              <CarouselNext className="pointer-events-auto static h-8 w-6 translate-x-0 translate-y-0 rounded-l-md rounded-r-none border-none bg-black/50 text-white hover:bg-black/70" />
            </div>

            {/* Dots */}
            {count > 1 && (
              <div className="mt-4 flex justify-center sm:pointer-events-none sm:absolute sm:inset-x-0 sm:top-0 sm:mt-0 sm:aspect-[16/10] sm:items-end sm:pb-3">
                <div className="flex gap-1.5 rounded-full sm:pointer-events-auto sm:bg-white/30 sm:px-2 sm:py-1 sm:backdrop-blur-sm">
                  {Array.from({ length: count }).map((_, i) => (
                    <button
                      key={i}
                      className={`h-2.5 w-2.5 sm:h-2 sm:w-2 rounded-full transition-all ${
                        i === current ? "bg-slate-900" : "bg-slate-300 sm:bg-slate-600/60"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        api?.scrollTo(i);
                      }}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </Carousel>
        </div>
      </article>
      <div>
        <LiveVideo />
      </div>
    </div>
  );
}