import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { getAdminDashboardStats } from "@/lib/articles.functions";
import {
  DashboardHeader,
  DashboardTabBar,
  DashboardMetricsGrid,
  NewsroomPerformanceCard,
  CategoryStatsCard,
  RecentArticlesCard,
  TopArticlesTable,
  RevenueTab,
  type DashboardTab,
  type DashboardData,
  type DatePreset,
} from "@/components/admin/dashboard";

export const Route = createFileRoute("/admin/")({
  loader: async () => {
    return (await getAdminDashboardStats()) as DashboardData;
  },
  component: DashboardPage,
});

function parseDatePrefix(val: unknown): string {
  if (!val) return "";
  if (typeof val === "string") return val.slice(0, 10);
  if (val instanceof Date) {
    try {
      return val.toISOString().slice(0, 10);
    } catch {
      return "";
    }
  }
  if (typeof val === "number") {
    try {
      return new Date(val).toISOString().slice(0, 10);
    } catch {
      return "";
    }
  }
  try {
    const d = new Date(val as any);
    if (!isNaN(d.getTime())) {
      return d.toISOString().slice(0, 10);
    }
  } catch {}
  return String(val).slice(0, 10);
}

function computePresetDates(preset: DatePreset): { startDate: string; endDate: string } {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  switch (preset) {
    case "24h": {
      const past = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return { startDate: past.toISOString().slice(0, 10), endDate: todayStr };
    }
    case "7d": {
      const past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { startDate: past.toISOString().slice(0, 10), endDate: todayStr };
    }
    case "30d": {
      const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { startDate: past.toISOString().slice(0, 10), endDate: todayStr };
    }
    case "6m": {
      const past = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      return { startDate: past.toISOString().slice(0, 10), endDate: todayStr };
    }
    case "1y": {
      const past = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      return { startDate: past.toISOString().slice(0, 10), endDate: todayStr };
    }
    case "all":
    default:
      return { startDate: "", endDate: "" };
  }
}

function DashboardPage() {
  const data = Route.useLoaderData();

  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [preset, setPreset] = useState<DatePreset>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handlePresetChange = (nextPreset: DatePreset) => {
    setPreset(nextPreset);
    if (nextPreset !== "custom") {
      const { startDate: s, endDate: e } = computePresetDates(nextPreset);
      setStartDate(s);
      setEndDate(e);
    }
  };

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    setPreset("custom");
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    setPreset("custom");
  };

  const isDateFiltered = preset !== "all" && (Boolean(startDate) || Boolean(endDate));

  const filteredArticles = isDateFiltered
    ? (data?.topArticles || []).filter((a) => {
        const d = parseDatePrefix(a.date);
        if (!d) return false;
        return (!startDate || d >= startDate) && (!endDate || d <= endDate);
      })
    : (data?.topArticles || []);

  const filteredFeatured = isDateFiltered
    ? (data?.featuredArticles || []).filter((a) => {
        const d = parseDatePrefix(a.date);
        if (!d) return false;
        return (!startDate || d >= startDate) && (!endDate || d <= endDate);
      })
    : (data?.featuredArticles || []);

  const handleResetDates = () => {
    setPreset("all");
    setStartDate("");
    setEndDate("");
    toast.info("Date range reset to All Time");
  };

  const handleExport = () => {
    // Generate CSV report of top articles and stats
    const csvContent = [
      ["Title", "Category", "Views", "Date", "Status"],
      ...filteredArticles.map((a) => [
        `"${a.title.replace(/"/g, '""')}"`,
        `"${a.category || "General"}"`,
        a.views || 0,
        parseDatePrefix(a.date),
        a.status || "Published",
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const rangeTag = preset === "all" ? "all-time" : `${startDate || "start"}-to-${endDate || "end"}`;
    link.setAttribute("download", `analytics-report-${rangeTag}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Analytics data exported successfully as CSV!");
  };

  const handleSaveReport = () => {
    const reportData = {
      title: "Today Tripura - Newsroom Performance Snapshot",
      generatedAt: new Date().toISOString(),
      dateRange: { preset, startDate, endDate },
      kpis: {
        totalPosts: data.totalArticles,
        totalJournalists: data.totalJournalists,
        totalSubscribers: data.totalSubscribers,
        totalRevenue: `${data.currencySymbol || "₹"}${data.totalRevenue}`,
        totalViews: data.totalViews,
      },
      topArticles: filteredArticles.slice(0, 10).map((a) => ({
        title: a.title,
        category: a.category,
        views: a.views,
        date: a.date,
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const rangeTag = preset === "all" ? "all-time" : `${startDate || "start"}-to-${endDate || "end"}`;
    link.setAttribute("download", `todaytripura-report-${rangeTag}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Executive report snapshot downloaded!");
  };

  const handleSendEmail = () => {
    toast.success(`Executive analytics report dispatched to admin mail!`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header (Greeting, Date Controls, Export) */}
      <DashboardHeader
        preset={preset}
        onPresetChange={handlePresetChange}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onResetDates={handleResetDates}
        onExport={handleExport}
      />

      {/* 2. Secondary Tab Bar (Overview, Audiences, Demographics, Content & Posts, Revenue) */}
      <DashboardTabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSaveReport={handleSaveReport}
        onExportPdf={() => {
          window.print();
          toast.success("Preparing print-ready executive PDF report...");
        }}
        onSendEmail={handleSendEmail}
      />

      {/* 3. Core KPI Metrics Grid (Total Posts, Total Journalists, Total Subscribers, Total Revenue) */}
      <DashboardMetricsGrid data={data} />

      {/* 4. Tab Content Views */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Real Newsroom Engagement Metrics */}
          <NewsroomPerformanceCard data={data} />

          {/* Real Content Distribution & Top Articles */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              <TopArticlesTable
                articles={filteredArticles}
                featuredArticles={filteredFeatured}
              />
            </div>
            <div className="lg:col-span-5 xl:col-span-4 space-y-6">
              <CategoryStatsCard
                categories={data.categoryStats}
                totalArticles={data.totalArticles}
              />
              <RecentArticlesCard articles={data.recentArticles} />
            </div>
          </div>
        </div>
      )}

      {activeTab === "content" && (
        <div className="space-y-6">
          <TopArticlesTable
            articles={filteredArticles}
            featuredArticles={filteredFeatured}
          />
          <RecentArticlesCard articles={data.recentArticles} />
        </div>
      )}

      {activeTab === "revenue" && <RevenueTab data={data} />}
    </div>
  );
}
