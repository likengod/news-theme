export type Timeframe = "Day" | "Week" | "Month";

export type DashboardTab = "overview" | "audiences" | "demographics" | "content" | "revenue";

export interface ArticleItem {
  id?: number;
  title: string;
  slug?: string;
  category?: string;
  views?: number;
  date?: string;
  featuredImage?: string;
  featured?: boolean | number;
  newsType?: string;
  status?: string;
}

export interface CategoryStat {
  name: string;
  count: number;
  views?: number;
}

export interface DashboardData {
  totalArticles: number;
  totalViews: number;
  totalUsers: number;
  totalComments: number;
  totalSubscribers: number;
  totalJournalists: number;
  totalRevenue: number;
  recentArticles: ArticleItem[];
  topArticles: ArticleItem[];
  featuredArticles: ArticleItem[];
  categoryStats: CategoryStat[];
  currencySymbol?: string;
}
