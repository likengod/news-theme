import React from "react";
import { HeadlineArticle } from "../HeadlineArticle";

export function HeroSidebarLeft({ activeLeftItems }: { activeLeftItems: any[] }) {
  return (
    <div className="divide-y divide-border lg:col-span-4">
      {activeLeftItems.map((it, i) => {
        let visibilityClass = "";
        if (i >= 5) {
          visibilityClass = "hidden 2xl:block";
        }
        return (
          <div key={`${it.title}-${i}`} className={`${i === 0 ? "pb-3" : "py-3"} ${visibilityClass}`}>
            <HeadlineArticle item={it} dense priority={i === 0} />
          </div>
        );
      })}
    </div>
  );
}
