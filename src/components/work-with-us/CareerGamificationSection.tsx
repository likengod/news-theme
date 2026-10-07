import React from "react";
import { Medal, TrendingUp, Search, CheckSquare, DollarSign } from "lucide-react";

interface CareerGamificationSectionProps {
  gamificationText?: string;
}

const gamificationIcons = [TrendingUp, Search, CheckSquare, DollarSign];

export function CareerGamificationSection({ gamificationText }: CareerGamificationSectionProps) {
  const gamificationList = (gamificationText || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (gamificationList.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border bg-card/40 p-6 md:p-10">
      <div className="flex items-center gap-3 mb-8">
        <Medal className="h-6 w-6 text-foreground" />
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Earn Points & Grow Your Rank
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {gamificationList.map((item, idx) => {
          const Icon = gamificationIcons[idx % gamificationIcons.length];
          const colonIdx = item.indexOf(":");
          const title = colonIdx > -1 ? item.slice(0, colonIdx).trim() : item;
          const desc = colonIdx > -1 ? item.slice(colonIdx + 1).trim() : "";
          return (
            <div
              key={idx}
              className="rounded-xl border border-border bg-background p-6 transition-shadow hover:shadow-md"
            >
              <Icon className="h-6 w-6 mb-4 text-foreground/70" />
              <h3 className="font-bold text-lg">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
