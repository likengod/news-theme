import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { SocialIcons } from "@/components/site/SocialIcons";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { toast } from "sonner";
import { submitContactMessage } from "@/lib/inbox.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us – News Theme" },
      { name: "description", content: "Get in touch with the News Theme newsroom. Send tips, feedback, partnership and advertising enquiries." },
      { property: "og:title", content: "Contact Us – News Theme" },
      { property: "og:description", content: "Reach the News Theme newsroom for tips, feedback and partnerships." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "News tip", message: "" });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <header className="border-b border-border pb-6">
          <h1 className="font-serif text-5xl font-bold text-foreground md:text-6xl">Contact Us</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Story tips, corrections, partnership and advertising enquiries — the News Theme desk reads every message. We aim to reply within one business day.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-10 py-10 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <div>
            <h2 className="headline font-serif text-2xl font-bold text-primary">Send us a message</h2>
            {sent ? (
              <div className="mt-6 border border-border bg-card/40 p-6 text-sm text-foreground">
                Thanks — your message has been received. Our team will get back to you shortly.
              </div>
            ) : (
            <form
                className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSubmitting(true);
                  try {
                    await submitContactMessage({ data: form });
                    setSent(true);
                    toast.success("Message sent — we'll reply within one business day.");
                  } catch (err: any) {
                    toast.error(err.message || "Failed to send message");
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Full name</span>
                  <input required type="text" value={form.name} onChange={(e) => set("name", e.target.value)} className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground" />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email</span>
                  <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground" />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Subject</span>
                  <select value={form.subject} onChange={(e) => set("subject", e.target.value)} className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground">
                    <option>News tip</option>
                    <option>Correction</option>
                    <option>Advertising</option>
                    <option>Partnership</option>
                    <option>Careers</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Message</span>
                  <textarea required rows={6} value={form.message} onChange={(e) => set("message", e.target.value)} className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground" />
                </label>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 bg-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest text-background hover:opacity-90 disabled:opacity-60"
                  >
                    {submitting ? "Sending…" : "Send Message"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div>
              <h3 className="mb-4 border-b-2 border-foreground pb-2 text-xs font-bold uppercase tracking-widest text-foreground">
                Newsroom
              </h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                  <span>Agartala, Tripura (W)<br />India — Pin: 799006</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-foreground" />
                  <a href="tel:+919999999999" className="hover:text-foreground hover:underline">+91 99999 99999</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-foreground" />
                  <a href="mailto:hello@northeasttimeline.com" className="hover:text-foreground hover:underline">hello@northeasttimeline.com</a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                  <span>Mon – Sat · 9:00 AM – 7:00 PM IST</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 border-b-2 border-foreground pb-2 text-xs font-bold uppercase tracking-widest text-foreground">
                Desks
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span className="font-semibold text-foreground">News tips:</span> tips@northeasttimeline.com</li>
                <li><span className="font-semibold text-foreground">Advertising:</span> ads@northeasttimeline.com</li>
                <li><span className="font-semibold text-foreground">Careers:</span> careers@northeasttimeline.com</li>
                <li><span className="font-semibold text-foreground">Corrections:</span> corrections@northeasttimeline.com</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 border-b-2 border-foreground pb-2 text-xs font-bold uppercase tracking-widest text-foreground">
                Follow
              </h3>
              <SocialIcons size="md" />
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}
