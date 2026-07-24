import { createFileRoute } from "@tanstack/react-router";
import {
  Newspaper,
  Eye,
  MessageSquare,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { getAdminDashboardStats } from "@/lib/articles.functions";

export const Route = createFileRoute("/admin/")({
  loader: async () => {
    return await getAdminDashboardStats();
  },
  component: Dashboard,
});

function Dashboard() {
  const {
    totalArticles,
    totalViews,
    totalUsers,
    totalComments,
    recentArticles,
    categoryStats,
  } = Route.useLoaderData();

  const stats = [
    { label: "Total Articles", value: totalArticles.toLocaleString(), delta: "+1.2%", up: true, icon: Newspaper, tint: "bg-blue-50 text-blue-600" },
    { label: "Total Views", value: totalViews.toLocaleString(), delta: "+8.4%", up: true, icon: Eye, tint: "bg-emerald-50 text-emerald-600" },
    { label: "Comments", value: totalComments.toLocaleString(), delta: "0%", up: true, icon: MessageSquare, tint: "bg-amber-50 text-amber-600" },
    { label: "Users", value: totalUsers.toLocaleString(), delta: "+0.5%", up: true, icon: Users, tint: "bg-violet-50 text-violet-600" },
  ];

  const totalCatArticles = categoryStats.reduce((s: number, c: any) => s + c.count, 0) || 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Welcome back. Here's what's happening on News Theme today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const TrendIcon = s.up ? TrendingUp : TrendingDown;
          return (
            <div
              key={s.label}
              className="rounded-lg border border-slate-200 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    {s.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold">{s.value}</p>
                </div>
                <div className={`grid h-10 w-10 place-items-center rounded-md ${s.tint}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div
                className={`mt-3 inline-flex items-center gap-1 text-xs font-medium ${
                  s.up ? "text-emerald-600" : "text-red-600"
                }`}
              >
                <TrendIcon className="h-3.5 w-3.5" />
                {s.delta} <span className="text-slate-500">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold">Recent Articles</h2>
            <a href="/admin/articles" className="text-xs font-medium text-slate-600 hover:text-slate-900">
              View all →
            </a>
          </div>
          <ul className="divide-y divide-slate-100">
            {recentArticles.length === 0 ? (
              <li className="px-5 py-8 text-center text-sm text-slate-500">
                No articles written yet.
              </li>
            ) : (
              recentArticles.map((a: any, i: number) => (
                <li key={i} className="flex items-center gap-4 px-5 py-3">
                  {a.featuredImage ? (
                    <img
                      src={a.featuredImage}
                      alt=""
                      className="h-12 w-16 rounded object-cover"
                    />
                  ) : (
                    <div className="h-12 w-16 rounded bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                      <Newspaper className="h-5 w-5" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                      {a.category || "General"}
                    </p>
                    <p className="truncate text-sm font-medium">{a.title}</p>
                  </div>
                  <div className="hidden text-right text-xs text-slate-500 sm:block">
                    <div className="flex items-center justify-end gap-1">
                      <Eye className="h-3 w-3" />
                      {a.views?.toLocaleString() ?? "0"}
                    </div>
                    <div>{new Date(a.date).toLocaleDateString()}</div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold">Top Categories</h2>
            </div>
            <ul className="divide-y divide-slate-100">
              {categoryStats.length === 0 ? (
                <li className="px-5 py-8 text-center text-sm text-slate-500">
                  No category data available.
                </li>
              ) : (
                categoryStats.map((c: any, i: number) => {
                  const pct = Math.round((c.count / totalCatArticles) * 100);
                  return (
                    <li key={i} className="px-5 py-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{c.name}</span>
                        <span className="text-slate-500">{pct}% ({c.count})</span>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded bg-slate-100">
                        <div
                          className="h-full bg-slate-900"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
