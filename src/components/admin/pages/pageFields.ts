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
    label: "Top Greeting Badge",
    hint: "e.g. Special Festival Competition",
  },
  { key: "eventTitle", label: "Event Title" },
  { key: "eventSubtitle", label: "Event Subtitle" },
  { key: "eventDescription", label: "Event Description", textarea: true },
  { key: "eventDate", label: "Event Schedule / Date" },
  { key: "eventLocation", label: "Event Location" },
  {
    key: "eventImageUrl",
    label: "Event Banner / Artwork Image URL",
    hint: "Enter image or banner URL (e.g. /durga-face.png). Displays at the top of the event page.",
  },
  {
    key: "eventSection1Divider",
    label: "Highlights Section Divider Text",
    hint: "e.g. Competition Honors & Evaluation",
  },
  {
    key: "eventPrizesTitle",
    label: "Column 1: Prizes Title",
    hint: "e.g. Prizes & Awards",
  },
  {
    key: "eventPrizes",
    label: "Column 1: Prizes List",
    textarea: true,
    hint: "Format: One prize or category per line",
  },
  {
    key: "eventCriteriaTitle",
    label: "Column 2: Criteria Title",
    hint: "e.g. Evaluation Criteria",
  },
  {
    key: "eventCriteria",
    label: "Column 2: Criteria List",
    textarea: true,
    hint: "Format: One criterion per line",
  },
  {
    key: "eventGuidelinesTitle",
    label: "Column 3: Guidelines Title",
    hint: "e.g. Participant Guidelines",
  },
  {
    key: "eventGuidelinesText",
    label: "Column 3: Guidelines Text",
    textarea: true,
    hint: "Rules, guidelines, or instructions for participating clubs and teams",
  },
  {
    key: "eventGuidelinesBadge",
    label: "Column 3: Highlight Badge",
    hint: "e.g. Free Entry / Complimentary Participation",
  },
  {
    key: "eventSection2Divider",
    label: "Registration Section Divider Text",
    hint: "e.g. Event Registration Form",
  },
  {
    key: "eventFormTitle",
    label: "Registration Form Title",
    hint: "e.g. Official Event Registration",
  },
  {
    key: "eventFormSubtitle",
    label: "Registration Form Subtitle",
    hint: "e.g. Provide details of your club or organization to register",
  },
  {
    key: "eventCustomInputLabel",
    label: "Custom Registration Field Label",
    hint: "Label for the custom form input (e.g. Club / Organization Name)",
  },
  {
    key: "eventButtonText",
    label: "Registration Button Text",
    hint: "e.g. Register Now / Join Event",
  },
];
