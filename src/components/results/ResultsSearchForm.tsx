import React, { useId } from "react";
import { Search, RefreshCw } from "lucide-react";
import { SUPPORTED_BOARDS } from "@/lib/results-api";

interface ResultsSearchFormProps {
  selectedBoardId: string;
  selectedBoard: (typeof SUPPORTED_BOARDS)[number];
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
  selectedBoardId,
  selectedBoard,
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
    <div className="mb-10 print:hidden border-b border-slate-200 dark:border-slate-800 pb-8">
      <form onSubmit={handleSearch} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Board / University */}
          <div>
            <label htmlFor={boardSelectId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              শিক্ষা বোর্ড / বিশ্ববিদ্যালয় (Board / University)
            </label>
            <select
              id={boardSelectId}
              value={selectedBoardId}
              onChange={(e) => handleBoardChange(e.target.value)}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm font-medium focus:border-red-600 focus:outline-none"
            >
              {SUPPORTED_BOARDS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.bengaliName} ({b.name})
                </option>
              ))}
            </select>
          </div>

          {/* Exam Course */}
          <div>
            <label htmlFor={examSelectId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              পরীক্ষার নাম (Examination / Course)
            </label>
            <select
              id={examSelectId}
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm font-medium focus:border-red-600 focus:outline-none"
            >
              {selectedBoard.exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Roll Number */}
          <div>
            <label htmlFor={rollInputId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              রোল নম্বর (Roll Number) *
            </label>
            <input
              id={rollInputId}
              type="text"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="e.g. 1001 or 1002"
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm font-semibold tracking-wider focus:border-red-600 focus:outline-none"
            />
          </div>

          {/* Registration Number */}
          <div>
            <label htmlFor={regInputId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              রেজিস্ট্রেশন নম্বর (Registration No - Optional)
            </label>
            <input
              id={regInputId}
              type="text"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder="Optional registration no..."
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm focus:border-red-600 focus:outline-none"
            />
          </div>

          {/* Exam Year */}
          <div>
            <label htmlFor={yearSelectId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              পরীক্ষার বছর (Exam Year)
            </label>
            <select
              id={yearSelectId}
              value={examYear}
              onChange={(e) => setExamYear(e.target.value)}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm font-medium focus:border-red-600 focus:outline-none"
            >
              <option value="2026">2026 (Latest)</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500">
            💡 <span className="font-semibold">টিপ:</span> টেস্ট করার জন্য রোল নম্বর{" "}
            <code className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-bold text-red-600">
              1001
            </code>{" "}
            (TBSE) বা{" "}
            <code className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-bold text-blue-600">
              1002
            </code>{" "}
            (Tripura Univ Degree) ব্যবহার করুন।
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 text-sm transition disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>খোঁজা হচ্ছে...</span>
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
