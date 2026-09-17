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
  const [endDate, setEndDate] = useState("2026-09-17");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredArticles =
    selectedCategory === "All"
      ? data.topArticles
      : data.topArticles.filter(
          (a) => (a.category || "").toLowerCase() === selectedCategory.toLowerCase(),
        );

  const filteredFeatured =
    selectedCategory === "All"
      ? data.featuredArticles
      : data.featuredArticles.filter(
          (a) => (a.category || "").toLowerCase() === selectedCategory.toLowerCase(),
        );

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

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header (Greeting, Date Controls, Category Filter, Export) */}
      <DashboardHeader
        startDate={startDate}
        endDate={endDate}
        selectedCategory={selectedCategory}
        categoryStats={data.categoryStats}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onCategoryChange={setSelectedCategory}
        onExport={handleExport}
      />

      {/* 2. Secondary Tab Bar (Overview, Audiences, Demographics, Content & Posts, Revenue) */}
      <DashboardTabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSaveReport={() => toast.success("Dashboard report snapshot saved!")}
        onExportPdf={() => {
          window.print();
          toast.success("Preparing PDF printout...");
        }}
        onSendEmail={() => toast.success("Scheduled automated executive report to admin email.")}
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
