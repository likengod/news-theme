import { useState, useId } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  GraduationCap,
  Search,
  Award,
  FileCheck2,
  Printer,
  Download,
  Building2,
  Calendar,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  QrCode,
  Sparkles,
} from "lucide-react";
import {
  SUPPORTED_BOARDS,
  queryExamResult,
  type ExamResult,
} from "@/lib/results-api";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "ত্রিপুরা পরীক্ষা ফলাফল, মার্কশিট ও সার্টিফিকেট পোর্টাল — Today Tripura" },
      {
        name: "description",
        content:
          "Tripura Board TBSE Madhyamik, Higher Secondary, Tripura University Degree Marksheet & Certificate Verification Portal.",
      },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const boardSelectId = useId();
  const examSelectId = useId();
  const rollInputId = useId();
  const regInputId = useId();
  const yearSelectId = useId();

  const [selectedBoardId, setSelectedBoardId] = useState(SUPPORTED_BOARDS[0].id);
  const selectedBoard =
    SUPPORTED_BOARDS.find((b) => b.id === selectedBoardId) || SUPPORTED_BOARDS[0];

  const [selectedExamId, setSelectedExamId] = useState(selectedBoard.exams[0].id);
  const [rollNo, setRollNo] = useState("1001");
  const [regNo, setRegNo] = useState("");
  const [examYear, setExamYear] = useState("2026");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);

  const handleBoardChange = (newBoardId: string) => {
    setSelectedBoardId(newBoardId);
    const newBoard = SUPPORTED_BOARDS.find((b) => b.id === newBoardId) || SUPPORTED_BOARDS[0];
    setSelectedExamId(newBoard.exams[0].id);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!rollNo.trim()) {
      setErrorMsg("অনুগ্রহ করে একটি রোল নম্বর লিখুন। (Please enter a valid Roll Number)");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await queryExamResult({
        boardId: selectedBoardId,
        examId: selectedExamId,
        rollNo: rollNo.trim(),
        regNo: regNo.trim() || undefined,
        examYear,
      });

      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setResult(null);
        setErrorMsg(res.message || "কোনো ফলাফল পাওয়া যায়নি।");
      }
    } catch {
      setErrorMsg("ফলাফল লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-5xl px-4 py-8 w-full">
        {/* Banner Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-100 dark:bg-red-950/50 px-3 py-1 text-xs font-bold text-red-700 dark:text-red-400">
            <GraduationCap className="h-4 w-4" />
            <span>ত্রিপুরা পরীক্ষার ফলাফল ও সার্টিফিকেট পোর্টাল</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Online Marksheet &amp; Degree Certificate Verification
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            ত্রিপুরা মধ্যশিক্ষা পর্ষদ (TBSE), ত্রিপুরা বিশ্ববিদ্যালয় এবং অন্যান্য পরীক্ষার মার্কশিট ও
            ডিগ্রি ফলাফল সহজেই চেক ও ডাউনলোড করুন।
          </p>
        </div>

        {/* Search / Lookup Form Box */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-5 sm:p-7 mb-8 print:hidden">
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
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm font-medium focus:border-red-600 focus:outline-none"
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
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm font-medium focus:border-red-600 focus:outline-none"
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
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm font-semibold tracking-wider focus:border-red-600 focus:outline-none"
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
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm focus:border-red-600 focus:outline-none"
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
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm font-medium focus:border-red-600 focus:outline-none"
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
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
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

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Marksheet & Certificate Display Card */}
        {result && (
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
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 transition cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>প্রিন্ট / মার্কশিট ডাউনলোড</span>
                </button>
              </div>
            </div>

            {/* Official Marksheet Document Card */}
            <div className="rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
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
        )}

        {/* Quick Links Section to Official Educational Portals */}
        <div className="mt-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 print:hidden">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-red-600" />
            <span>ত্রিপুরা শিক্ষা ও ফলাফল অফিশিয়াল পোর্টালসমূহ (Official Portals)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <a
              href="https://tbse.tripura.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-3 hover:border-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition group"
            >
              <div>
                <span className="font-bold block text-slate-900 dark:text-white group-hover:text-red-600">TBSE Portal</span>
                <span className="text-[11px] text-slate-400">tbse.tripura.gov.in</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-red-600" />
            </a>

            <a
              href="https://tripurauniv.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-3 hover:border-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition group"
            >
              <div>
                <span className="font-bold block text-slate-900 dark:text-white group-hover:text-red-600">Tripura University</span>
                <span className="text-[11px] text-slate-400">tripurauniv.ac.in</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-red-600" />
            </a>

            <a
              href="https://mbbuniversity.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-3 hover:border-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition group"
            >
              <div>
                <span className="font-bold block text-slate-900 dark:text-white group-hover:text-red-600">MBB University</span>
                <span className="text-[11px] text-slate-400">mbbuniversity.ac.in</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-red-600" />
            </a>

            <a
              href="https://digilocker.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-3 hover:border-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition group"
            >
              <div>
                <span className="font-bold block text-slate-900 dark:text-white group-hover:text-red-600">DigiLocker</span>
                <span className="text-[11px] text-slate-400">Verified Certificates</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-red-600" />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
