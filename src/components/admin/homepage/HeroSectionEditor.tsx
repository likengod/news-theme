import { SectionCard } from "./SectionCard";
import type { HomepageConfig, SectionStyle } from "@/lib/homepage-config";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Props = {
  config: HomepageConfig;
  onUpdate: <K extends keyof HomepageConfig>(key: K, val: HomepageConfig[K]) => void;
};

export function HeroSectionEditor({ config, onUpdate }: Props) {
  return (
    <div className="space-y-3">
      <SectionCard
        label="Featured story"
        hint="Which category feeds the big hero lead story"
        value={config.heroFeatured}
        showCategory
        onChange={(v: SectionStyle) => onUpdate("heroFeatured", v)}
      >
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-medium text-slate-500">Carousel Mode</span>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-multiple"
                checked={config.heroFeatured.showMultiple !== false}
                onCheckedChange={(c) =>
                  onUpdate("heroFeatured", { ...config.heroFeatured, showMultiple: c })
                }
              />
              <Label
                htmlFor="show-multiple"
                className="text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Show multiple images with auto-slide
              </Label>
            </div>
          </div>

          {config.heroFeatured.showMultiple !== false && (
            <>
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-medium text-slate-500">Auto Slide</span>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-slide"
                    checked={config.heroFeatured.autoSlide !== false}
                    onCheckedChange={(c) =>
                      onUpdate("heroFeatured", { ...config.heroFeatured, autoSlide: c })
                    }
                  />
                  <Label
                    htmlFor="auto-slide"
                    className="text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    Enable animation
                  </Label>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="slide-interval" className="text-[11px] font-medium text-slate-500">
                  Slide Timing (seconds)
                </label>
                <input
                  id="slide-interval"
                  type="number"
                  min="2"
                  max="30"
                  value={config.heroFeatured.slideInterval ?? 5}
                  onChange={(e) =>
                    onUpdate("heroFeatured", {
                      ...config.heroFeatured,
                      slideInterval: parseInt(e.target.value) || 5,
                    })
                  }
                  className="h-8 w-24 rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="slide-count" className="text-[11px] font-medium text-slate-500">
                  Slide Count (Max images)
                </label>
                <input
                  id="slide-count"
                  type="number"
                  min="2"
                  max="10"
                  value={config.heroFeatured.slideCount ?? 3}
                  onChange={(e) =>
                    onUpdate("heroFeatured", {
                      ...config.heroFeatured,
                      slideCount: parseInt(e.target.value) || 3,
                    })
                  }
                  className="h-8 w-24 rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
                />
              </div>
            </>
          )}
        </div>
      </SectionCard>
      <SectionCard
        label="Top Stories"
        hint="Header title and category for top stories column"
        value={config.heroTopStories}
        showCategory
        onChange={(v: SectionStyle) => onUpdate("heroTopStories", v)}
      />
      <SectionCard
        label="Culture & Music row"
        hint="Culture section under the main hero grid"
        value={config.heroCultureMusic}
        showCategory
        onChange={(v: SectionStyle) => onUpdate("heroCultureMusic", v)}
      />
      <SectionCard
        label="Opinion (Right Sidebar)"
        hint="Top section on the right sidebar"
        value={config.heroOpinion}
        showCategory
        onChange={(v: SectionStyle) => onUpdate("heroOpinion", v)}
      />
      <SectionCard
        label="Popular (Right Sidebar)"
        hint="Bottom section on the right sidebar"
        value={config.heroPopular}
        showCategory
        onChange={(v: SectionStyle) => onUpdate("heroPopular", v)}
      />
    </div>
  );
}
