import React, { RefObject, FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  Upload,
  Image as ImageIcon,
  FileText,
  MapPin,
  Phone,
  User,
  EyeOff,
  Eye,
  X,
} from "lucide-react";
import { Section, Field } from "./UIHelpers";
import { MIN_WORDS, IMAGE_MAX_MB, PDF_MAX_MB } from "./constants";

interface SubmitNewsFormProps {
  title: string;
  setTitle: (val: string) => void;
  details: string;
  setDetails: (val: string) => void;
  words: number;
  wordProgress: number;
  newsLocation: string;
  setNewsLocation: (val: string) => void;
  
  imagePreview: string | null;
  clearImage: () => void;
  imageInputRef: RefObject<HTMLInputElement>;
  handleImage: (file: File | undefined) => void;
  
  pdf: File | null;
  clearPdf: () => void;
  pdfInputRef: RefObject<HTMLInputElement>;
  handlePdf: (file: File | undefined) => void;
  
  hideIdentity: boolean;
  setHideIdentity: React.Dispatch<React.SetStateAction<boolean>>;
  fullName: string;
  setFullName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  reporterLocation: string;
  setReporterLocation: (val: string) => void;
  
  agreed: boolean;
  setAgreed: (val: boolean) => void;
  submitting: boolean;
  handleSubmit: (e: FormEvent) => void;
}

export function SubmitNewsForm({
  title, setTitle,
  details, setDetails,
  words, wordProgress,
  newsLocation, setNewsLocation,
  imagePreview, clearImage, imageInputRef, handleImage,
  pdf, clearPdf, pdfInputRef, handlePdf,
  hideIdentity, setHideIdentity,
  fullName, setFullName,
  phone, setPhone,
  reporterLocation, setReporterLocation,
  agreed, setAgreed,
  submitting, handleSubmit
}: SubmitNewsFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Story */}
      <Section number="1" title="Your news">
        <Field label="Headline" required>
          <input
            id="submit-news-title"
            name="title"
            aria-label="Headline"
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
            id="submit-news-details"
            name="details"
            aria-label="News details"
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
            id="submit-news-location"
            name="newsLocation"
            aria-label="News location"
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
                  id="submit-news-image"
                  name="image"
                  aria-label="Upload photo"
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
                  id="submit-news-pdf"
                  name="pdf"
                  aria-label="Attach press release / document"
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
            onClick={() => setHideIdentity((v: boolean) => !v)}
            className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center border ${
              hideIdentity
                ? "border-foreground bg-foreground text-background"
                : "border-border"
            }`}
            aria-pressed={hideIdentity}
            aria-label="Toggle hide identity"
          >
            {hideIdentity ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <div className="text-sm">
            <p className="font-semibold">
              {hideIdentity
                ? "Hide my name on the published story"
                : "Show my name as the source"}
            </p>
            <p className="text-xs text-muted-foreground">
              Either way, your contact details below stay confidential and are only used by
              our editors for cross-verification.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" required icon={<User className="h-4 w-4" />}>
            <input
              id="submit-news-fullname"
              name="fullName"
              aria-label="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="As on your ID"
              className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-foreground focus:outline-none"
            />
          </Field>
          <Field label="Phone number" required icon={<Phone className="h-4 w-4" />}>
            <input
              id="submit-news-phone"
              name="phone"
              aria-label="Phone number"
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
            id="submit-news-reporter-location"
            name="reporterLocation"
            aria-label="Your location"
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
            id="submit-news-consent"
            name="consent"
            aria-label="Consent to terms and accuracy confirmation"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 accent-black"
          />
          <span className="text-muted-foreground">
            I confirm the information above is accurate to my knowledge and I own or have
            permission to share every image and document attached. I have read the{" "}
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
  );
}
