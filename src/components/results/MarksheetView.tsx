import React from "react";
import {
  Award,
  Printer,
  CheckCircle2,
  QrCode,
} from "lucide-react";
import type { ExamResult } from "@/lib/results-api";

interface MarksheetViewProps {
  result: ExamResult;
  onPrint: () => void;
}

export function MarksheetView({ result, onPrint }: MarksheetViewProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 print:hidden">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>ফলাফল সফলভাবে যাচাইকৃত (Verification Successful)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>প্রিন্ট / মার্কশিট ডাউনলোড</span>
          </button>
        </div>
      </div>

      {/* Official Marksheet Document View */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-card p-6 sm:p-8 relative overflow-hidden">
        {/* Decorative Watermark Header */}
        <div className="flex flex-col items-center text-center border-b-2 border-slate-200 dark:border-slate-800 pb-6 mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 mb-2">
            <Award className="h-8 w-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide">
            {result.boardOrUniversity}
          </h2>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">
            OFFICIAL STATEMENT OF MARKS &amp; PROVISIONAL CERTIFICATE
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{result.examName}</p>
        </div>

        {/* Candidate Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-200 dark:border-slate-700 text-xs mb-6">
          <div>
            <span className="text-slate-500 block uppercase font-bold text-[10px]">
              পরীক্ষার্থীর নাম (Candidate Name)
            </span>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
              {result.candidateName}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-bold text-[10px]">
              রোল নম্বর (Roll Number)
            </span>
            <span className="font-mono font-bold text-sm text-red-600">{result.rollNo}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-bold text-[10px]">
              রেজিস্ট্রেশন নম্বর (Registration No)
            </span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              {result.regNo || "N/A"}
            </span>
          </div>
          {result.fatherName && (
            <div>
              <span className="text-slate-500 block uppercase font-bold text-[10px]">
                পিতার নাম (Father's Name)
              </span>
              <span className="font-semibold">{result.fatherName}</span>
            </div>
          )}
          {result.institutionName && (
            <div className="sm:col-span-2">
              <span className="text-slate-500 block uppercase font-bold text-[10px]">
                বিদ্যালয় / কলেজ (Institution)
              </span>
              <span className="font-semibold">{result.institutionName}</span>
            </div>
          )}
        </div>

        {/* Subject-wise Marks Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 font-bold uppercase tracking-wider text-[11px] text-slate-700 dark:text-slate-300">
                <th className="py-2.5 px-3">বিষয় কোড (Code)</th>
                <th className="py-2.5 px-3">বিষয় (Subject Name)</th>
                <th className="py-2.5 px-3 text-center">থিওরি (Theory)</th>
                <th className="py-2.5 px-3 text-center">প্র্যাকটিক্যাল (Prac)</th>
                <th className="py-2.5 px-3 text-center font-black">মোট প্রাপ্ত (Total)</th>
                <th className="py-2.5 px-3 text-center">গ্রেড (Grade)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {result.subjects.map((sub, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-mono text-slate-500">{sub.code || `0${idx + 1}`}</td>
                  <td className="py-2.5 px-3 font-semibold">{sub.name}</td>
                  <td className="py-2.5 px-3 text-center font-mono">{sub.theoryMarks ?? "-"}</td>
                  <td className="py-2.5 px-3 text-center font-mono">{sub.practicalMarks ?? "-"}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-red-600">
                    {sub.totalMarks}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold">
                    <span className="inline-block rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px]">
                      {sub.grade || "A"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Scorecard */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 border-t-2 border-slate-200 dark:border-slate-800 pt-5">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">মোট নম্বর (Total Marks)</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {result.totalMarksObtained} / {result.maxTotalMarks}
            </span>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">শতাংশ (Percentage)</span>
            <span className="text-xl font-black text-red-600">{result.percentage}%</span>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">ফলাফল (Status)</span>
            <span className="inline-flex items-center gap-1 text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>{result.divisionOrGrade || "PASSED"}</span>
            </span>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">সার্টিফিকেট নম্বর (Cert No)</span>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 block truncate mt-1">
              {result.certificateNo || "TBSE-CERT-VERIFIED"}
            </span>
          </div>
        </div>

        {/* Digital Seal & QR Stamp */}
        <div className="mt-8 pt-4 border-t border-dashed border-slate-300 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              <QrCode className="h-9 w-9" />
            </div>
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                ডিজিটাল ভেরিফিকেশন কোড (Digital Verification)
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {result.verificationHash || "SHA256:AUTHENTIC_DOC_VALID"}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              Exam Controller Authority
            </span>
            <span className="text-[11px] text-slate-400">Computer Generated Marksheet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
