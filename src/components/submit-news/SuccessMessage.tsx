import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export function SuccessMessage({
  hideIdentity,
  fullName,
  phone,
  onReset,
}: {
  hideIdentity: boolean;
  fullName: string;
  phone: string;
  onReset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header showTicker={false} showBreakingBar={false} />
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14" strokeWidth={1.5} />
        <h1 className="mt-6 text-3xl font-black tracking-tight">Submission received</h1>
        <p className="mt-3 text-muted-foreground">
          Thanks {hideIdentity ? "anonymous contributor" : fullName.split(" ")[0]} — our editors
          will cross-verify your report and get back on{" "}
          <span className="font-semibold">{phone}</span> within 48 hours. Your identity will{" "}
          {hideIdentity ? "not" : ""} be shown on the published story.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/"
            className="border border-foreground bg-foreground px-5 py-2.5 text-sm font-semibold text-background"
          >
            Back to home
          </Link>
          <button
            onClick={onReset}
            className="border border-foreground px-5 py-2.5 text-sm font-semibold"
          >
            Submit another
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
