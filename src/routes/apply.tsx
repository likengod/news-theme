import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { submitWorkWithUs } from "@/lib/inbox.functions";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Application Form — News Theme" },
    ],
  }),
  component: ApplyPage,
});

const TIERS = [
  { id: "volunteer", name: "Volunteer Journalist" },
  { id: "intern", name: "Intern Journalist" },
  { id: "permanent", name: "Permanent Employee" },
];

function ApplyPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    alternativePhone: "",
    city: "",
    zip: "",
    country: "",
    beat: "",
    tier: "volunteer",
    portfolio: "",
    pitch: ""
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.pitch.trim()) {
      toast.error("Name, email and short pitch are required");
      return;
    }
    setSubmitting(true);
    try {
      await submitWorkWithUs({ data: form });
      toast.success("Application received! Our editors will reply within 5 working days.");
      setForm({
        name: "", email: "", phone: "", alternativePhone: "",
        city: "", zip: "", country: "", beat: "",
        tier: "volunteer", portfolio: "", pitch: ""
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header showTicker={false} showBreakingBar={false} />
      
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-16">
        <section className="rounded-2xl border border-border bg-card/40 p-6 md:p-12">
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Application Form</h1>
            <p className="mt-3 text-sm text-muted-foreground">Every application is reviewed by a senior editor. We reply within 5 working days.</p>
          </div>

          <form onSubmit={submit} className="grid gap-6 md:grid-cols-2">
            <Field label="Full name" value={form.name} onChange={(v) => set("name", v)} required />
            <Field label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} required />
            
            <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} placeholder="+91 00000 00000" />
            <Field label="Alternative Number" value={form.alternativePhone} onChange={(v) => set("alternativePhone", v)} placeholder="Optional backup contact" />
            
            <Field label="City / State" value={form.city} onChange={(v) => set("city", v)} />
            <Field label="Zip / Postal Code" value={form.zip} onChange={(v) => set("zip", v)} />
            
            <Field label="Country" value={form.country} onChange={(v) => set("country", v)} placeholder="e.g. India" />
            <Field label="Beat / Topic" value={form.beat} onChange={(v) => set("beat", v)} placeholder="Politics, Sports, Tech…" />
            
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Applying for</label>
              <select
                value={form.tier}
                onChange={(e) => set("tier", e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              >
                {TIERS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                <option value="fact_checker">Fact Checker</option>
                <option value="proofreader">Proofreader</option>
              </select>
            </div>

            <Field className="md:col-span-2" label="Portfolio / Clips (URL)" value={form.portfolio} onChange={(v) => set("portfolio", v)} placeholder="https://yourwork.com" />
            
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Why do you want to join? *</label>
              <textarea
                value={form.pitch}
                onChange={(e) => set("pitch", e.target.value)}
                rows={6}
                required
                className="w-full rounded-md border border-border bg-background p-3 text-sm focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                placeholder="Tell us about your experience and how you want to contribute."
              />
            </div>
            
            <div className="md:col-span-2 mt-4">
              <div className="flex items-center gap-3 mb-6">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="h-5 w-5 rounded border-border text-foreground focus:ring-foreground"
                />
                <label htmlFor="terms" className="text-sm font-medium text-foreground cursor-pointer">
                  I agree to the <Link to="/terms-and-conditions" className="underline hover:text-blue-600 transition-colors">Terms & Conditions</Link> and <Link to="/privacy-policy" className="underline hover:text-blue-600 transition-colors">Privacy Policy</Link>
                </label>
              </div>
              <button type="submit" disabled={submitting} className="w-full rounded-lg bg-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest text-background transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100">
                {submitting ? "Submitting Application…" : "Submit Application"}
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, placeholder, className = "" }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
        {required ? " *" : <span className="ml-1 text-muted-foreground/60 normal-case tracking-normal">(Optional)</span>}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}
