import { useMemo, useRef, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MIN_WORDS, IMAGE_MAX_MB, PDF_MAX_MB, countWords } from "@/components/submit-news/constants";
import { SuccessMessage } from "@/components/submit-news/SuccessMessage";
import { SubmitNewsForm } from "@/components/submit-news/SubmitNewsForm";
import { SubmissionGuidelines } from "@/components/submit-news/SubmissionGuidelines";

export const Route = createFileRoute("/submit-news")({
  head: () => ({
    meta: [
      { title: "Submit News — News Theme" },
      {
        name: "description",
        content:
          "Submit verified news to News Theme. Share tips, photos, PDFs and location details for our editorial team to review.",
      },
      { property: "og:title", content: "Submit News — News Theme" },
      {
        property: "og:description",
        content: "Send tips, photos and PDFs to our newsroom for cross-verification.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SubmitPage,
});

function SubmitPage() {
  const [details, setDetails] = useState("");
  const [title, setTitle] = useState("");
  const [newsLocation, setNewsLocation] = useState("");
  const [hideIdentity, setHideIdentity] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [reporterLocation, setReporterLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const words = useMemo(() => countWords(details), [details]);
  const wordProgress = Math.min(100, Math.round((words / MIN_WORDS) * 100));

  function handleImage(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > IMAGE_MAX_MB * 1024 * 1024) {
      toast.error(`Image is too large. Max ${IMAGE_MAX_MB} MB.`);
      return;
    }
    setImage(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  }

  function handlePdf(file: File | undefined) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are accepted here.");
      return;
    }
    if (file.size > PDF_MAX_MB * 1024 * 1024) {
      toast.error(`PDF is too large. Max ${PDF_MAX_MB} MB.`);
      return;
    }
    setPdf(file);
  }

  function clearImage() {
    setImage(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  function clearPdf() {
    setPdf(null);
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (title.trim().length < 6) {
      toast.error("Give your news a headline (at least 6 characters).");
      return;
    }
    if (words < MIN_WORDS) {
      toast.error(
        `Your news is too short. Add at least ${MIN_WORDS - words} more word${MIN_WORDS - words === 1 ? "" : "s"}.`,
      );
      return;
    }
    if (!image) {
      toast.error("Please attach at least one image.");
      return;
    }
    if (!newsLocation.trim()) {
      toast.error("Add the news location.");
      return;
    }
    if (!fullName.trim() || !phone.trim() || !reporterLocation.trim()) {
      toast.error("Your name, phone and location are required for cross-verification.");
      return;
    }
    if (!/^[+\d][\d\s\-()]{6,}$/.test(phone.trim())) {
      toast.error("Enter a valid phone number.");
      return;
    }
    if (!agreed) {
      toast.error("Please confirm the submission terms.");
      return;
    }

    setSubmitting(true);
    // Simulated submit — no backend wiring requested.
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Thank you! Your submission is with our editors.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 800);
  }

  if (submitted) {
    return (
      <SuccessMessage
        hideIdentity={hideIdentity}
        fullName={fullName}
        phone={phone}
        onReset={() => {
          setSubmitted(false);
          setDetails("");
          setTitle("");
          setNewsLocation("");
          clearImage();
          clearPdf();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header showTicker={false} showBreakingBar={false} />

      <main className="mx-auto max-w-5xl px-4 py-10">
        {/* Hero */}
        <header className="border-y-2 border-foreground py-6">
          <p className="kicker">Newsroom · Citizen Desk</p>
          <h1 className="mt-2 font-serif text-4xl font-black tracking-tight sm:text-5xl">
            Submit your news
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Share verified reports, ground photos and press releases with our editorial team. Every
            submission is cross-verified before publication.
          </p>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
          <SubmitNewsForm
            title={title} setTitle={setTitle}
            details={details} setDetails={setDetails}
            words={words} wordProgress={wordProgress}
            newsLocation={newsLocation} setNewsLocation={setNewsLocation}
            imagePreview={imagePreview} clearImage={clearImage} imageInputRef={imageInputRef} handleImage={handleImage}
            pdf={pdf} clearPdf={clearPdf} pdfInputRef={pdfInputRef} handlePdf={handlePdf}
            hideIdentity={hideIdentity} setHideIdentity={setHideIdentity}
            fullName={fullName} setFullName={setFullName}
            phone={phone} setPhone={setPhone}
            reporterLocation={reporterLocation} setReporterLocation={setReporterLocation}
            agreed={agreed} setAgreed={setAgreed}
            submitting={submitting} handleSubmit={handleSubmit}
          />

          <SubmissionGuidelines
            title={title}
            words={words}
            image={image}
            newsLocation={newsLocation}
            fullName={fullName}
            phone={phone}
            reporterLocation={reporterLocation}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
