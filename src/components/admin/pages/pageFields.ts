import type { FieldDef } from "@/components/admin/settings/SettingsHelpers";

export const subscriptionFields: FieldDef[] = [
  { key: "subscriptionTitle", label: "Subscription Page Title" },
  { key: "subscriptionIntro", label: "Subscription Intro Text", textarea: true },
  { key: "subscriptionPriceINRMonthly", label: "INR Monthly Price (₹)" },
  { key: "subscriptionPriceINRYearly", label: "INR Yearly Price (₹)" },
  { key: "subscriptionPriceUSDMonthly", label: "USD Monthly Price ($)" },
  { key: "subscriptionPriceUSDYearly", label: "USD Yearly Price ($)" },
  {
    key: "subscriptionFeatures",
    label: "Subscription Features",
    textarea: true,
    hint: "One feature per line",
  },
];

export const workWithUsFields: FieldDef[] = [
  {
    key: "workWithUsHeroTitle",
    label: "Hero Title",
    textarea: true,
    hint: "Use newlines for breaks",
  },
  { key: "workWithUsHeroIntro", label: "Hero Intro text", textarea: true },
  { key: "workWithUsIdCardReq", label: "ID Card Requirement Text", textarea: true },
  {
    key: "workWithUsRules",
    label: "Journalist Rules",
    textarea: true,
    hint: "Format: 'Bold Prefix: Description'",
  },
  {
    key: "workWithUsGamification",
    label: "Gamification Cards",
    textarea: true,
    hint: "Format: 'Title: Description' per line",
  },
  {
    key: "workWithUsBadges",
    label: "Badge Benefits",
    textarea: true,
    hint: "Format: 'Rank: Benefit 1 | Benefit 2 | Benefit 3' per line",
  },
  {
    key: "workWithUsTiers",
    label: "Career Tiers",
    textarea: true,
    hint: "Format: 'Tier Name (Requirement): Description' per line",
  },
  {
    key: "workWithUsFaqs",
    label: "FAQs",
    textarea: true,
    hint: "Format: 'Question: Answer' per line",
  },
];

export const eventFields: FieldDef[] = [
  {
    key: "eventGreeting",
    label: "Top Greeting Badge (শীর্ষ সম্ভাষণ)",
    hint: "যেমন: ॥ শারদীয়া দুর্গোৎসব বিশেষ প্রতিযোগিতা ॥",
  },
  { key: "eventTitle", label: "Event Title (ইভেন্টের মূল শিরোনাম)" },
  { key: "eventSubtitle", label: "Event Subtitle (উপশিরোনাম)" },
  { key: "eventDescription", label: "Event Description (বিস্তারিত বিবরণ)", textarea: true },
  { key: "eventDate", label: "Event Schedule / Date (তারিখ ও সময়কাল)" },
  { key: "eventLocation", label: "Event Location (স্থান / অঞ্চল)" },
  {
    key: "eventImageUrl",
    label: "Event Banner / Artwork Image URL (ইভেন্ট ছবি বা ব্যানারের লিঙ্ক)",
    hint: "ইভেন্টের ব্যানার বা ছবির URL প্রদান করুন (যেমন: /durga-face.png)। এটি পেজের শীর্ষে সুন্দরভাবে প্রদর্শিত হবে।",
  },
  {
    key: "eventSection1Divider",
    label: "Highlights Section Divider Text (প্রথম ডিভাইডার লেখা)",
    hint: "যেমন: ॥ প্রতিযোগী সম্মান ও মূল্যায়ন ॥",
  },
  {
    key: "eventPrizesTitle",
    label: "Column 1: Prizes Title (পুরস্কার সেকশন শিরোনাম)",
    hint: "যেমন: পুরস্কার ও সম্মাননা",
  },
  {
    key: "eventPrizes",
    label: "Column 1: Prizes List (পুরস্কার ও সম্মাননা তালিকা)",
    textarea: true,
    hint: "Format: One prize or category per line (প্রতি লাইনে একটি করে পুরস্কার)",
  },
  {
    key: "eventCriteriaTitle",
    label: "Column 2: Criteria Title (মূল্যায়ন সেকশন শিরোনাম)",
    hint: "যেমন: মূল্যায়নের মূল ভিত্তি",
  },
  {
    key: "eventCriteria",
    label: "Column 2: Criteria List (মূল্যায়নের ভিত্তি তালিকা)",
    textarea: true,
    hint: "Format: One criterion per line (প্রতি লাইনে একটি করে মূল্যায়নের পয়েন্ট)",
  },
  {
    key: "eventGuidelinesTitle",
    label: "Column 3: Guidelines Title (নির্দেশিকা শিরোনাম)",
    hint: "যেমন: অংশগ্রহণকারী নির্দেশিকা",
  },
  {
    key: "eventGuidelinesText",
    label: "Column 3: Guidelines Text (নির্দেশিকা বিস্তারিত বিবরণ)",
    textarea: true,
    hint: "অংশগ্রহণকারী ক্লাব বা পূজা কমিটির জন্য নিয়মাবলী বা বার্তা",
  },
  {
    key: "eventGuidelinesBadge",
    label: "Column 3: Highlight Badge (বিশেষ নোট বা ব্যাজ)",
    hint: "যেমন: অংশগ্রহণ সম্পূর্ণ বিনামূল্যে",
  },
  {
    key: "eventSection2Divider",
    label: "Registration Section Divider Text (দ্বিতীয় ডিভাইডার লেখা)",
    hint: "যেমন: ॥ শারদ সম্মান আবেদন পত্র ॥",
  },
  {
    key: "eventFormTitle",
    label: "Registration Form Title (নিবন্ধন ফর্মের শিরোনাম)",
    hint: "যেমন: ইভেন্ট নিবন্ধন ফরম (Event Registration)",
  },
  {
    key: "eventFormSubtitle",
    label: "Registration Form Subtitle (ফর্মের উপশিরোনাম)",
    hint: "যেমন: শারদ সম্মানের জন্য আপনার ক্লাব বা পূজোর বিস্তারিত তথ্য প্রদান করুন",
  },
  {
    key: "eventCustomInputLabel",
    label: "Custom Registration Field Label (কাস্টম ইনপুট লেবেল)",
    hint: "ফর্মের অতিরিক্ত ইনপুট ফিল্ডের নাম (যেমন: ক্লাবের নাম / Club Name)",
  },
  {
    key: "eventButtonText",
    label: "Registration Button Text (নিবন্ধন বাটনের নাম)",
    hint: "যেমন: নিবন্ধন করুন / Join Event / Register",
  },
];
