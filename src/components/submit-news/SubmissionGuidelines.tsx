import { ShieldCheck } from "lucide-react";
import { Check } from "./UIHelpers";
import { MIN_WORDS } from "./constants";

export function SubmissionGuidelines({
  title,
  words,
  image,
  newsLocation,
  fullName,
  phone,
  reporterLocation,
}: {
  title: string;
  words: number;
  image: File | null;
  newsLocation: string;
  fullName: string;
  phone: string;
  reporterLocation: string;
}) {
  return (
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
  );
}
