import React from "react";
import { Check } from "lucide-react";

interface SetupStepIndicatorProps {
  step: 1 | 2 | 3;
}

export function SetupStepIndicator({ step }: SetupStepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center h-8 w-8 rounded-full border ${step >= 1 ? "bg-amber-500 border-amber-500 text-slate-900" : "border-slate-600 text-slate-400"} font-bold text-sm`}
          >
            {step > 1 ? <Check className="h-4 w-4" /> : "1"}
          </div>
          <span className="ml-2 text-sm font-medium text-slate-300">Database</span>
        </div>
        <div className="flex-1 h-0.5 bg-slate-700 mx-4" />
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center h-8 w-8 rounded-full border ${step >= 2 ? "bg-amber-500 border-amber-500 text-slate-900" : "border-slate-600 text-slate-400"} font-bold text-sm`}
          >
            {step > 2 ? <Check className="h-4 w-4" /> : "2"}
          </div>
          <span className="ml-2 text-sm font-medium text-slate-300">Admin Account</span>
        </div>
        <div className="flex-1 h-0.5 bg-slate-700 mx-4" />
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center h-8 w-8 rounded-full border ${step >= 3 ? "bg-amber-500 border-amber-500 text-slate-900" : "border-slate-600 text-slate-400"} font-bold text-sm`}
          >
            3
          </div>
          <span className="ml-2 text-sm font-medium text-slate-300">Install</span>
        </div>
      </div>
    </div>
  );
}
