import { useMemo, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  FileText,
  MapPin,
  Phone,
  User,
  EyeOff,
  Eye,
  X,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

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

const MIN_WORDS = 60;
const IMAGE_MAX_MB = 8;
const PDF_MAX_MB = 15;

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

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
      toast.error(`Your news is too short. Add at least ${MIN_WORDS - words} more word${MIN_WORDS - words === 1 ? "" : "s"}.`);
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
      <div className="min-h-screen bg-background text-foreground">
        <Header showTicker={false} showBreakingBar={false} />
        <main className="mx-auto max-w-2xl px-4 py-20 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14" strokeWidth={1.5} />
          <h1 className="mt-6 text-3xl font-black tracking-tight">Submission received</h1>
          <p className="mt-3 text-muted-foreground">
            Thanks {hideIdentity ? "anonymous contributor" : fullName.split(" ")[0]} — our editors will
            cross-verify your report and get back on <span className="font-semibold">{phone}</span> within 48
            hours. Your identity will {hideIdentity ? "not" : ""} be shown on the published story.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/" className="border border-foreground bg-foreground px-5 py-2.5 text-sm font-semibold text-background">
              Back to home
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setDetails("");
                setTitle("");
                setNewsLocation("");
                clearImage();
                clearPdf();
              }}
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
            Share verified reports, ground photos and press releases with our editorial team. Every submission
            is cross-verified before publication.
          </p>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Story */}
            <Section number="1" title="Your news">
              <Field label="Headline" required>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={140}
                  placeholder="A short, factual headline"
                  className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-foreground focus:outline-none"
                />
              </Field>

              <Field
                label="News details"
                required
                hint={
                  <span className={words < MIN_WORDS ? "text-muted-foreground" : "text-foreground"}>
                    {words} / {MIN_WORDS} words minimum
                  </span>
                }
              >
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={8}
                  placeholder="What happened? When and where? Who is involved? Add facts, not opinions."
                  className="w-full resize-y border border-border bg-background px-3 py-2.5 text-sm leading-relaxed focus:border-foreground focus:outline-none"
                />
                <div className="mt-1.5 h-1 w-full bg-muted">
                  <div
                    className="h-1 bg-foreground transition-all"
                    style={{ width: `${wordProgress}%` }}
                  />
                </div>
              </Field>

              <Field label="News location" required icon={<MapPin className="h-4 w-4" />}>
                <input
                  value={newsLocation}
                  onChange={(e) => setNewsLocation(e.target.value)}
                  placeholder="City, district, state"
                  className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-foreground focus:outline-none"
                />
              </Field>
            </Section>

            {/* 2. Attachments */}
            <Section number="2" title="Attachments">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Image */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider">
                    Photo <span className="text-destructive">*</span>
                  </p>
                  {imagePreview ? (
                    <div className="relative overflow-hidden border border-border">
                      <img src={imagePreview} alt="Preview" className="h-44 w-full object-cover" />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute right-2 top-2 grid h-7 w-7 place-items-center bg-background/90 text-foreground"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-44 cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-border text-center text-xs text-muted-foreground transition hover:border-foreground hover:text-foreground">
                      <ImageIcon className="h-6 w-6" />
                      <span className="font-semibold">Click to upload photo</span>
                      <span>JPG, PNG · max {IMAGE_MAX_MB} MB</span>
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImage(e.target.files?.[0])}
                      />
                    </label>
                  )}
                </div>

                {/* PDF */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider">
                    PDF <span className="text-muted-foreground">(optional)</span>
                  </p>
                  {pdf ? (
                    <div className="flex h-44 flex-col items-center justify-center gap-2 border border-border p-4 text-center">
                      <FileText className="h-6 w-6" />
                      <p className="line-clamp-2 text-sm font-semibold">{pdf.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(pdf.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={clearPdf}
                        className="text-xs font-semibold underline underline-offset-2"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-44 cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-border text-center text-xs text-muted-foreground transition hover:border-foreground hover:text-foreground">
                      <Upload className="h-6 w-6" />
                      <span className="font-semibold">Attach press release / document</span>
                      <span>PDF only · max {PDF_MAX_MB} MB</span>
                      <input
                        ref={pdfInputRef}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => handlePdf(e.target.files?.[0])}
                      />
                    </label>
                  )}
                </div>
              </div>
            </Section>

            {/* 3. Identity */}
            <Section number="3" title="Your identity">
              <div className="flex items-start gap-3 border border-border p-3">
                <button
                  type="button"
                  onClick={() => setHideIdentity((v) => !v)}
                  className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center border ${
                    hideIdentity ? "border-foreground bg-foreground text-background" : "border-border"
                  }`}
                  aria-pressed={hideIdentity}
                  aria-label="Toggle hide identity"
                >
                  {hideIdentity ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <div className="text-sm">
                  <p className="font-semibold">
                    {hideIdentity ? "Hide my name on the published story" : "Show my name as the source"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Either way, your contact details below stay confidential and are only used by our editors
                    for cross-verification.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" required icon={<User className="h-4 w-4" />}>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="As on your ID"
                    className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-foreground focus:outline-none"
                  />
                </Field>
                <Field label="Phone number" required icon={<Phone className="h-4 w-4" />}>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    inputMode="tel"
                    placeholder="+91 98xxxxxx"
                    className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-foreground focus:outline-none"
                  />
                </Field>
              </div>

              <Field label="Your location" required icon={<MapPin className="h-4 w-4" />}>
                <input
                  value={reporterLocation}
                  onChange={(e) => setReporterLocation(e.target.value)}
                  placeholder="Where are you writing from?"
                  className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-foreground focus:outline-none"
                />
              </Field>
            </Section>

            {/* Consent + submit */}
            <div className="border-t-2 border-foreground pt-6">
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-black"
                />
                <span className="text-muted-foreground">
                  I confirm the information above is accurate to my knowledge and I own or have permission to
                  share every image and document attached. I have read the{" "}
                  <Link to="/editorial-policy" className="underline">
                    Editorial Policy
                  </Link>
                  .
                </span>
              </label>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="border border-foreground bg-foreground px-6 py-3 text-sm font-bold uppercase tracking-wider text-background transition disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Submit news"}
                </button>
                <p className="text-xs text-muted-foreground">
                  Editors respond within 48 hours to verified submissions.
                </p>
              </div>
            </div>
          </form>

          {/* Sidebar guide */}
          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="border border-border p-4">
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <p className="text-xs font-bold uppercase tracking-wider">How we verify</p>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>· Editors call the number you provide.</li>
                <li>· We cross-check location, photos and PDFs.</li>
                <li>· Nothing is published until at least two sources confirm.</li>
                <li>· Your identity is never disclosed without consent.</li>
              </ul>
            </div>
            <div className="border border-border p-4">
              <p className="text-xs font-bold uppercase tracking-wider">Checklist</p>
              <ul className="mt-2 space-y-1.5 text-xs">
                <Check ok={title.trim().length >= 6}>Headline</Check>
                <Check ok={words >= MIN_WORDS}>≥ {MIN_WORDS} words of detail</Check>
                <Check ok={!!image}>1 photo attached</Check>
                <Check ok={!!newsLocation.trim()}>News location</Check>
                <Check ok={!!fullName.trim() && !!phone.trim() && !!reporterLocation.trim()}>
                  Contact details
                </Check>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ─── UI helpers ─────────────────────────── */

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 border-b border-border pb-2">
        <span className="grid h-7 w-7 place-items-center bg-foreground text-xs font-bold text-background">
          {number}
        </span>
        <h2 className="font-serif text-xl font-black tracking-tight">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  hint,
  icon,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
          {icon}
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
        {hint && <span className="text-[11px]">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Check({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className={`flex items-center gap-2 ${ok ? "text-foreground" : "text-muted-foreground"}`}>
      <span
        className={`grid h-4 w-4 place-items-center border ${
          ok ? "border-foreground bg-foreground text-background" : "border-border"
        }`}
      >
        {ok && <CheckCircle2 className="h-3 w-3" />}
      </span>
      {children}
    </li>
  );
}
