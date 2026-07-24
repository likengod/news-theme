import { SectionCard } from "./SectionCard";
import type { HomepageConfig, SectionStyle } from "@/lib/homepage-config";

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
      />
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
    </div>
  );
}
