import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { GraduationCap, AlertCircle } from "lucide-react";
import {
  SUPPORTED_BOARDS,
  queryExamResult,
  type ExamResult,
} from "@/lib/results-api";
import { ResultsSearchForm } from "@/components/results/ResultsSearchForm";
import { MarksheetView } from "@/components/results/MarksheetView";
import { OfficialPortalsGrid } from "@/components/results/OfficialPortalsGrid";

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
  const [selectedBoardId, setSelectedBoardId] = useState(SUPPORTED_BOARDS[0].id);
  const selectedBoard =
    SUPPORTED_BOARDS.find((b) => b.id === selectedBoardId) || SUPPORTED_BOARDS[0];

  const [selectedExamId, setSelectedExamId] = useState(selectedBoard.exams[0].id);
  const [rollNo, setRollNo] = useState("1403");
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-4xl px-4 py-8 w-full">
        {/* Banner Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 dark:bg-red-950/60 px-3.5 py-1 text-xs font-bold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 shadow-xs">
            <GraduationCap className="h-4 w-4" />
            <span>ত্রিপুরা পরীক্ষা ফলাফল ও সার্টিফিকেট যাচাই গেটওয়ে (Tripura Results Portal)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
            Online Marksheet &amp; Certificate Verification
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            ত্রিপুরা মধ্যশিক্ষা পর্ষদ (TBSE) মাধ্যমিক, উচ্চ মাধ্যমিক, ত্রিপুরা বিশ্ববিদ্যালয় এবং অন্যান্য শিক্ষা বোর্ডের
            মার্কশিট ও ডিগ্রি ফলাফল তাৎক্ষণিক যাচাই করুন ও ডাউনলোড করুন।
          </p>
        </div>

        {/* Search / Lookup Form */}
        <ResultsSearchForm
          selectedBoardId={selectedBoardId}
          selectedBoard={selectedBoard}
          selectedExamId={selectedExamId}
          setSelectedExamId={setSelectedExamId}
          rollNo={rollNo}
          setRollNo={setRollNo}
          regNo={regNo}
          setRegNo={setRegNo}
          examYear={examYear}
          setExamYear={setExamYear}
          handleBoardChange={handleBoardChange}
          handleSearch={handleSearch}
          isLoading={isLoading}
        />

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Marksheet & Certificate Display */}
        {result && <MarksheetView result={result} onPrint={handlePrint} />}

        {/* Quick Links Section to Official Educational Portals */}
        <OfficialPortalsGrid />
      </main>

      <Footer />
    </div>
  );
}
