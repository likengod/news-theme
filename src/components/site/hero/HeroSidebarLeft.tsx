import React from "react";
import { HeadlineArticle } from "../HeadlineArticle";

export function HeroSidebarLeft({ activeLeftItems }: { activeLeftItems: any[] }) {
  return (
    <div className="divide-y divide-border lg:col-span-4">
      {activeLeftItems.map((it, i) => (
        <div key={`${it.title}-${i}`} className={i === 0 ? "pb-3" : "py-3"}>
          <HeadlineArticle item={it} dense />
        </div>
      ))}
    </div>
  );
}