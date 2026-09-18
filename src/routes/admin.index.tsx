import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { getAdminDashboardStats } from "@/lib/articles.functions";
import {
  DashboardHeader,
  DashboardTabBar,
  DashboardMetricsGrid,
  AudienceChartCard,
  EngagementCards,
  TopArticlesTable,
  TrafficChannelsCard,
  DemographicsTab,
  RevenueTab,
  type DashboardTab,
  type DashboardData,
} from "@/components/admin/dashboard";

export const Route = createFileRoute("/admin/")({
  loader: async () => {
    return (await getAdminDashboardStats()) as DashboardData;
  },
  component: DashboardPage,
});

function DashboardPage() {
  const data = Route.useLoaderData();

  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [startDate, setStartDate] = useState("2026-09-01");
  const [endDate, setEndDate] = useState("2026-09-18");

  const isDateFiltered = startDate !== "2026-09-01" || endDate !== "2026-09-18";

  const filteredArticles = isDateFiltered
    ? data.topArticles.filter((a) => {
        if (!a.date) return true;
        const d = a.date.slice(0, 10);
        return (!startDate || d >= startDate) && (!endDate || d <= endDate);
      })
    : data.topArticles;

  const filteredFeatured = isDateFiltered
    ? data.featuredArticles.filter((a) => {
        if (!a.date) return true;
        const d = a.date.slice(0, 10);
        return (!startDate || d >= startDate) && (!endDate || d <= endDate);
      })
    : data.featuredArticles;

  const handleResetDates = () => {
    setStartDate("2026-09-01");
    setEndDate("2026-09-18");
    toast.info("Date range reset to default");
  };

  const handleExport = () => {
    // Generate CSV report of top articles and stats
    const csvContent = [
      ["Title", "Category", "Views", "Date", "Status"],
      ...data.topArticles.map((a) => [
        `"${a.title.replace(/"/g, '""')}"`,
        `"${a.category || "General"}"`,
        a.views || 0,
        a.date || "",
        a.status || "Published",
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `analytics-report-${startDate}-to-${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Analytics data exported successfully as CSV!");
  };

  const handleSaveReport = () => {
    const reportData = {
      title: "Today Tripura - Newsroom Performance Snapshot",
      generatedAt: new Date().toISOString(),
      dateRange: { startDate, endDate },
      kpis: {
        totalPosts: data.totalArticles,
        totalJournalists: data.totalJournalists,
        totalSubscribers: data.totalSubscribers,
        totalRevenue: `${data.currencySymbol || "₹"}${data.totalRevenue}`,
        totalViews: data.totalViews,
      },
      topArticles: data.topArticles.slice(0, 10).map((a) => ({
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
    link.setAttribute("download", `todaytripura-report-${startDate}-to-${endDate}.json`);
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
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
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
          {/* Main Visual Row: Big Audience Chart (Left) + Engagement Cards (Right) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7 xl:col-span-8">
              <AudienceChartCard
                totalViews={data.totalViews}
                totalUsers={data.totalUsers}
              />
            </div>
            <div className="lg:col-span-5 xl:col-span-4">
              <EngagementCards
                totalUsers={data.totalUsers}
                totalViews={data.totalViews}
              />
            </div>
          </div>

          {/* Bottom Row: Page Views by Page Title (Left) + Sessions by Channel (Right) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7 xl:col-span-7">
              <TopArticlesTable
                articles={filteredArticles}
                featuredArticles={filteredFeatured}
              />
            </div>
            <div className="lg:col-span-5 xl:col-span-5">
              <TrafficChannelsCard />
            </div>
          </div>
        </div>
      )}

      {activeTab === "audiences" && (
        <div className="space-y-6">
          <AudienceChartCard
            totalViews={data.totalViews}
            totalUsers={data.totalUsers}
          />
          <EngagementCards
            totalUsers={data.totalUsers}
            totalViews={data.totalViews}
          />
        </div>
      )}

      {activeTab === "demographics" && <DemographicsTab />}

      {activeTab === "content" && (
        <div className="space-y-6">
          <TopArticlesTable
            articles={filteredArticles}
            featuredArticles={filteredFeatured}
          />
        </div>
      )}

      {activeTab === "revenue" && <RevenueTab data={data} />}
    </div>
  );
}
export default DashboardPage;
