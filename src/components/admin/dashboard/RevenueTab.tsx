import React from "react";
import { Crown, DollarSign, TrendingUp, Users, ArrowUpRight, ShieldCheck } from "lucide-react";
import type { DashboardData } from "./types";

interface RevenueTabProps {
  data: DashboardData;
}

export function RevenueTab({ data }: RevenueTabProps) {
  const currency = data.currencySymbol || "₹";
  const monthlyRate = 149;
  const yearlyRate = 1499;

  const monthlySubs = Math.round(data.totalSubscribers * 0.75);
  const yearlySubs = Math.max(1, data.totalSubscribers - monthlySubs);

  const mrr = data.totalRevenue;
  const arr = mrr * 12;

  return (
    <div className="space-y-6">
      {/* 3 Top Revenue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Monthly Recurring Revenue
            </span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {currency}{mrr.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" /> +18.4% growth this month
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Annualized Run Rate (ARR)
            </span>
            <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Crown className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {currency}{arr.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            Based on active subscriptions
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Subscribers
            </span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {data.totalSubscribers.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-bold">
            96.8% monthly retention rate
          </p>
        </div>
      </div>

      {/* Plan Breakdown & Ad Earnings Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Subscription Plan Tiers
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active reader memberships across recurring billing intervals.
          </p>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Monthly Supporter ({currency}{monthlyRate}/mo)</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Ad-free reading + exclusive investigative pieces</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-slate-900 dark:text-white">{monthlySubs} users</span>
                <p className="text-[10px] text-slate-500 font-semibold">{currency}{(monthlySubs * monthlyRate).toLocaleString()}/mo</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">Yearly Patron ({currency}{yearlyRate}/yr)</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Annual pass with priority news alerts & PDF digest</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-slate-900 dark:text-white">{yearlySubs} users</span>
                <p className="text-[10px] text-slate-500 font-semibold">{currency}{(yearlySubs * yearlyRate).toLocaleString()}/yr</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Monetization Settings & Gateways
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure payment gateways and member perks in Admin settings.
          </p>

          <div className="mt-5 space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Payment Gateway</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" /> Active (Razorpay / Stripe)
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Ad Blocker for Subscribers</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">Automatic (Enabled)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Premium Story Access</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">Restricted to Paid Readers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
