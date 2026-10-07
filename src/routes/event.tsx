import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { getSiteSettingsServer, buildPageHead, defaultSettings, type SiteSettings } from "@/lib/site-content";
import { authClient } from "@/lib/auth-client";
import { submitEventRegistration } from "@/lib/inbox.functions";
import { FestiveDivider } from "@/components/event/FestiveDivider";
import { EventHeroSection } from "@/components/event/EventHeroSection";
import { EventHighlightsSection } from "@/components/event/EventHighlightsSection";
import { EventRegistrationForm } from "@/components/event/EventRegistrationForm";

export const Route = createFileRoute("/event")({
  loader: async (): Promise<{ settings: SiteSettings }> => {
    const settings = (await getSiteSettingsServer().catch(() => null)) || defaultSettings;
    return { settings };
  },
  head: ({ loaderData }) => {
    const s = loaderData?.settings;
    return buildPageHead({
      page: {
        title: s?.eventTitle || "শারদ সম্মান ২০২৬",
        metaTitle: s?.eventMetaTitle,
        metaDescription: s?.eventMetaDescription,
        ogImage: s?.eventOgImage,
        metaKeywords: s?.eventKeywords,
        canonicalUrl: s?.eventCanonicalUrl,
        noIndex: s?.eventNoIndex,
      },
      defaultTitle: "শারদ সম্মান ২০২৬ — বিশেষ দুর্গোৎসব প্রতিযোগিতা",
      defaultDescription:
        "শারদ সম্মান ২০২৬ দুর্গোৎসব প্রতিযোগিতা। সেরা মণ্ডপসজ্জা, সেরা প্রতিমা ও সেরা আলোকসজ্জার সম্মাননা। আজই আপনার ক্লাবের নাম নিবন্ধন করুন।",
      slug: "/event",
    });
  },
  component: EventPage,
});

function EventPage() {
  const s = useSiteSettings();

  // Auth state
  const [userId, setUserId] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [customField, setCustomField] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    authClient.auth
      .getSession()
      .then(({ data }) => {
        if (data.session?.user) {
          const u = data.session.user;
          setUserId(u.id);
          setUserEmail(u.email ?? null);
          const dName =
            u.user_metadata?.display_name ||
            u.user_metadata?.full_name ||
            u.email?.split("@")[0] ||
            "User";
          setUserDisplayName(dName);
          setName(dName);
        }
      })
      .catch(() => {});
  }, []);

  const eventTitle = s.eventTitle || "শারদ সম্মান ২০২৬";
  const eventSubtitle = s.eventSubtitle || "সেরা দুর্গোৎসব মূল্যায়ন ও শারদ সম্মাননা প্রতিযোগিতা";
  const eventDesc =
    s.eventDescription ||
    "আসন্ন শারদোৎসবে ত্রিপুরার ঐতিহ্যবাহী ও সর্বজনীন দুর্গাপূজা কমিটি এবং ক্লাবগুলোর জন্য বিশেষ শারদ সম্মান প্রতিযোগিতা। শ্রেষ্ঠ মণ্ডপসজ্জা, প্রতিমা নির্মাণ, আলোকসজ্জা ও পরিবেশবান্ধব ভাবনার ওপর ভিত্তি করে প্রদান করা হবে বিশেষ পুরস্কার ও স্মারক সম্মাননা।";
  const eventDate = s.eventDate || "শারদীয়া দুর্গাপূজা ২০২৬ (মহা পঞ্চমী থেকে বিজয়া দশমী)";
  const eventLocation = s.eventLocation || "ত্রিপুরা ও সংলগ্ন অঞ্চল";
  const customLabel = s.eventCustomInputLabel || "ক্লাবের নাম / Club Name";
  const buttonText = s.eventButtonText || "নিবন্ধন করুন";
  const eventImageUrl = s.eventImageUrl || "/durga-face.png";
  const isButtonEnabled = s.eventButtonEnabled !== false;
  const isFormEnabled = s.eventFormEnabled !== false;

  const eventGreeting = s.eventGreeting || "॥ শারদীয়া দুর্গোৎসব বিশেষ প্রতিযোগিতা ॥";
  const eventSection1Divider = s.eventSection1Divider || "॥ প্রতিযোগী সম্মান ও মূল্যায়ন ॥";
  const eventPrizesTitle = s.eventPrizesTitle || "পুরস্কার ও সম্মাননা";
  const eventCriteriaTitle = s.eventCriteriaTitle || "মূল্যায়নের মূল ভিত্তি";
  const rawCriteria =
    s.eventCriteria ||
    "ঐতিহ্য ও নান্দনিক মণ্ডপসজ্জা\nস্বকীয় প্রতিমা নির্মাণ ও শৈল্পিক ভাব\nপরিবেশবান্ধব উপাদান ও পরিচ্ছন্নতা\nশৃঙ্খলা, দর্শনার্থী নিরাপত্তা ও আলোকসজ্জা";
  const criteriaList = rawCriteria
    .split("\n")
    .map((c) => c.trim())
    .filter(Boolean);

  const eventGuidelinesTitle = s.eventGuidelinesTitle || "অংশগ্রহণকারী নির্দেশিকা";
  const eventGuidelinesText =
    s.eventGuidelinesText ||
    "ত্রিপুরার যে কোনো নিবন্ধিত বা সর্বজনীন পূজা কমিটি ও ক্লাব এই শারদ সম্মান প্রতিযোগিতায় অংশগ্রহণ করতে পারবে। নিচে থাকা ফর্মটি পূরণ করে আপনার ক্লাবের অন্তর্ভুক্তি নিশ্চিত করুন।";
  const eventGuidelinesBadge = s.eventGuidelinesBadge || "অংশগ্রহণ সম্পূর্ণ বিনামূল্যে";
  const eventSection2Divider = s.eventSection2Divider || "॥ শারদ সম্মান আবেদন পত্র ॥";
  const eventFormTitle = s.eventFormTitle || "ইভেন্ট নিবন্ধন ফরম (Event Registration)";
  const eventFormSubtitle =
    s.eventFormSubtitle || "শারদ সম্মানের জন্য আপনার ক্লাব বা পূজোর বিস্তারিত তথ্য প্রদান করুন";

  const rawPrizes =
    s.eventPrizes ||
    "১ম স্থান: ৫০,০০০ টাকা ও বিশেষ শারদ স্মারক\n২য় স্থান: ৩০,০০০ টাকা ও রৌপ্য স্মারক\n৩য় স্থান: ২০,০০০ টাকা ও সম্মাননা পত্র\nবিশেষ বিভাগ: সেরা আলোকসজ্জা, সেরা প্রতিমা ও সেরা শৃঙ্খলা পুরস্কার";

  const prizeList = rawPrizes
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("ইভেন্টে যোগ দিতে অনুগ্রহ করে প্রথমে লগইন করুন।");
      return;
    }
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("দয়া করে সকল প্রয়োজনীয় তথ্য পূরণ করুন।");
      return;
    }

    try {
      setSubmitting(true);
      await submitEventRegistration({
        data: {
          name: name.trim(),
          email: userEmail || "",
          phone: phone.trim(),
          address: address.trim(),
          customField: customField.trim(),
          customFieldLabel: customLabel,
          eventName: eventTitle,
        },
      });
      setSubmitted(true);
      toast.success("আপনার নিবন্ধন সফলভাবে জমা হয়েছে!");
    } catch (err: any) {
      toast.error(err.message || "নিবন্ধন জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F0] to-[#FFFDF9] text-[#1a1a1a] dark:from-[#0d0c0a] dark:via-[#16120b] dark:to-[#0d0c0a] dark:text-[#f3f3f3] flex flex-col justify-between">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8 md:py-14 flex-1 w-full">
        {/* Hero Section */}
        <EventHeroSection
          eventTitle={eventTitle}
          eventSubtitle={eventSubtitle}
          eventDesc={eventDesc}
          eventDate={eventDate}
          eventLocation={eventLocation}
          eventImageUrl={eventImageUrl}
          eventGreeting={eventGreeting}
          buttonText={buttonText}
          isButtonEnabled={isButtonEnabled}
          isFormEnabled={isFormEnabled}
        />

        {/* Divider */}
        <FestiveDivider title={eventSection1Divider} />

        {/* Highlights & Criteria */}
        <EventHighlightsSection
          eventPrizesTitle={eventPrizesTitle}
          prizeList={prizeList}
          eventCriteriaTitle={eventCriteriaTitle}
          criteriaList={criteriaList}
          eventGuidelinesTitle={eventGuidelinesTitle}
          eventGuidelinesText={eventGuidelinesText}
          eventGuidelinesBadge={eventGuidelinesBadge}
        />

        {/* Divider */}
        <FestiveDivider title={eventSection2Divider} />

        {/* Registration Form */}
        <EventRegistrationForm
          isFormEnabled={isFormEnabled}
          submitted={submitted}
          onResetSubmitted={() => {
            setSubmitted(false);
            setPhone("");
            setAddress("");
            setCustomField("");
          }}
          userId={userId}
          userDisplayName={userDisplayName}
          userEmail={userEmail}
          name={name}
          setName={setName}
          phone={phone}
          setPhone={setPhone}
          address={address}
          setAddress={setAddress}
          customField={customField}
          setCustomField={setCustomField}
          customLabel={customLabel}
          submitting={submitting}
          onSubmit={handleSubmit}
          isButtonEnabled={isButtonEnabled}
          buttonText={buttonText}
          eventFormTitle={eventFormTitle}
          eventFormSubtitle={eventFormSubtitle}
        />
      </main>

      <Footer />
    </div>
  );
}
