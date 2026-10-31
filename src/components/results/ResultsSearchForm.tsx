import React, { useId } from "react";
import { Search, RefreshCw, GraduationCap, Building2 } from "lucide-react";
import {
  SUPPORTED_BOARDS,
  type ExamBoardConfig,
} from "@/lib/results-api";

interface ResultsSearchFormProps {
  selectedBoard: ExamBoardConfig;
  selectedBoardId: string;
  selectedExamId: string;
  setSelectedExamId: (id: string) => void;
  rollNo: string;
  setRollNo: (val: string) => void;
  regNo: string;
  setRegNo: (val: string) => void;
  examYear: string;
  setExamYear: (val: string) => void;
  handleBoardChange: (boardId: string) => void;
  handleSearch: (e?: React.FormEvent) => void;
  isLoading: boolean;
}

export function ResultsSearchForm({
  selectedBoard,
  selectedBoardId,
  selectedExamId,
  setSelectedExamId,
  rollNo,
  setRollNo,
  regNo,
  setRegNo,
  examYear,
  setExamYear,
  handleBoardChange,
  handleSearch,
  isLoading,
}: ResultsSearchFormProps) {
  const boardSelectId = useId();
  const examSelectId = useId();
  const rollInputId = useId();
  const regInputId = useId();
  const yearSelectId = useId();

  return (
    <div className="mb-8 print:hidden space-y-6">
      {/* Quick Board Selection Tabs */}
      <div className="pb-3 border-b border-border/60">
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
          বোর্ড / বিশ্ববিদ্যালয় নির্বাচন করুন (Select Board / University)
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {SUPPORTED_BOARDS.map((b) => {
            const active = b.id === selectedBoardId;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => handleBoardChange(b.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-red-600 text-white shadow-xs"
                    : "bg-muted/60 text-foreground hover:bg-muted hover:text-red-600 border border-border/60"
                }`}
              >
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                <span>{b.bengaliName}</span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Board / University Dropdown */}
          <div>
            <label htmlFor={boardSelectId} className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
              শিক্ষা বোর্ড / বিশ্ববিদ্যালয় (Board / University) <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <select
                id={boardSelectId}
                value={selectedBoardId}
                onChange={(e) => handleBoardChange(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-foreground focus:border-red-600 focus:ring-2 focus:ring-red-600/20 focus:outline-none transition appearance-none cursor-pointer"
              >
                {SUPPORTED_BOARDS.map((b) => (
                  <option key={b.id} value={b.id} className="py-1">
                    {b.bengaliName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Exam / Course Dropdown */}
          <div>
            <label htmlFor={examSelectId} className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
              পরীক্ষার নাম (Examination / Course) <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <select
                id={examSelectId}
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-foreground focus:border-red-600 focus:ring-2 focus:ring-red-600/20 focus:outline-none transition appearance-none cursor-pointer truncate pr-8"
              >
                {selectedBoard.exams.map((ex) => (
                  <option key={ex.id} value={ex.id} className="py-1">
                    {ex.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Roll Number */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor={rollInputId} className="text-xs font-bold text-foreground uppercase tracking-wider">
                রোল নম্বর (Roll Number) <span className="text-red-600">*</span>
              </label>
            </div>
            <input
              id={rollInputId}
              type="text"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="যেমন: 1403 বা 1001"
              required
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm font-bold tracking-wider text-foreground focus:border-red-600 focus:ring-2 focus:ring-red-600/20 focus:outline-none transition"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              অ্যাডমিট কার্ড অনুযায়ী রোল লিখুন
            </p>
          </div>

          {/* Registration Number */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor={regInputId} className="text-xs font-bold text-foreground uppercase tracking-wider">
                রেজিস্ট্রেশন নম্বর (Registration No - Optional)
              </label>
            </div>
            <input
              id={regInputId}
              type="text"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder="Optional registration no..."
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-red-600 focus:ring-2 focus:ring-red-600/20 focus:outline-none transition"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              প্রয়োজন অনুযায়ী দিতে পারেন (ঐচ্ছিক)
            </p>
          </div>

          {/* Exam Year */}
          <div>
            <label htmlFor={yearSelectId} className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
              পরীক্ষার বছর (Exam Year)
            </label>
            <div className="relative">
              <select
                id={yearSelectId}
                value={examYear}
                onChange={(e) => setExamYear(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-red-600 focus:ring-2 focus:ring-red-600/20 focus:outline-none transition appearance-none cursor-pointer"
              >
                <option value="2026">2026 (সর্বশেষ / Latest)</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              পরীক্ষা দেওয়ার শিক্ষাবর্ষ
            </p>
          </div>
        </div>

        {/* Action Button & Notice */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border/60">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-red-600 shrink-0" />
            <span>
              যেকোনো রোল নম্বর (যেমন <strong>1403</strong>, <strong>1001</strong>, <strong>1002</strong>) দিয়ে তাৎক্ষণিক মার্কশিট দেখা যাবে।
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-extrabold px-6 py-2.5 text-xs sm:text-sm shadow-sm transition disabled:opacity-50 cursor-pointer self-end sm:self-auto"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>যাচাই হচ্ছে...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>ফলাফল দেখুন (Check Result)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
