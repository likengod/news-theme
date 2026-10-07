import React from "react";
import { PageSeoForm } from "./PageSeoForm";
import { htmlToNormalText } from "./SectionEditorItem";
import type { PageContent, SiteSettings } from "@/lib/site-content";

interface PageEditorSeoTabProps {
  activeSlug: string;
  active?: PageContent;
  settings: SiteSettings;
  updateSetting: <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => void;
  update: <K extends keyof PageContent>(k: K, v: PageContent[K]) => void;
}

export function PageEditorSeoTab({
  activeSlug,
  active,
  settings,
  updateSetting,
  update,
}: PageEditorSeoTabProps) {
  const isSubscription = activeSlug === "subscription";
  const isWorkWithUs = activeSlug === "work-with-us";
  const isEvent = activeSlug === "event";

  if (isSubscription) {
    return (
      <PageSeoForm
        pageTitle={settings.subscriptionTitle || "Subscription"}
        pageIntro={settings.subscriptionIntro || ""}
        pageContent={settings.subscriptionFeatures || settings.subscriptionIntro || ""}
        pageSlug="subscription"
        seo={{
          metaTitle: settings.subscriptionMetaTitle,
          metaDescription: settings.subscriptionMetaDescription,
          ogImage: settings.subscriptionOgImage,
          metaKeywords: settings.subscriptionKeywords,
          canonicalUrl: settings.subscriptionCanonicalUrl,
          noIndex: settings.subscriptionNoIndex,
        }}
        onChange={(k, v) => {
          const map = {
            metaTitle: "subscriptionMetaTitle",
            metaDescription: "subscriptionMetaDescription",
            ogImage: "subscriptionOgImage",
            metaKeywords: "subscriptionKeywords",
            canonicalUrl: "subscriptionCanonicalUrl",
            noIndex: "subscriptionNoIndex",
          } as const;
          updateSetting(map[k] as any, v);
        }}
        siteName={settings.siteName || "News Theme"}
      />
    );
  }

  if (isWorkWithUs) {
    return (
      <PageSeoForm
        pageTitle={settings.workWithUsHeroTitle || "Work With Us"}
        pageIntro={settings.workWithUsHeroIntro || ""}
        pageContent={[
          settings.workWithUsHeroIntro,
          settings.workWithUsRules,
          settings.workWithUsTiers,
          settings.workWithUsFaqs,
        ]
          .filter(Boolean)
          .join("\n\n")}
        pageSlug="work-with-us"
        seo={{
          metaTitle: settings.workWithUsMetaTitle,
          metaDescription: settings.workWithUsMetaDescription,
          ogImage: settings.workWithUsOgImage,
          metaKeywords: settings.workWithUsKeywords,
          canonicalUrl: settings.workWithUsCanonicalUrl,
          noIndex: settings.workWithUsNoIndex,
        }}
        onChange={(k, v) => {
          const map = {
            metaTitle: "workWithUsMetaTitle",
            metaDescription: "workWithUsMetaDescription",
            ogImage: "workWithUsOgImage",
            metaKeywords: "workWithUsKeywords",
            canonicalUrl: "workWithUsCanonicalUrl",
            noIndex: "workWithUsNoIndex",
          } as const;
          updateSetting(map[k] as any, v);
        }}
        siteName={settings.siteName || "News Theme"}
      />
    );
  }

  if (isEvent) {
    return (
      <PageSeoForm
        pageTitle={settings.eventTitle || "Sharad Samman Event"}
        pageIntro={settings.eventSubtitle || settings.eventDescription || ""}
        pageContent={[
          settings.eventSubtitle,
          settings.eventDescription,
          settings.eventPrizes,
          settings.eventCriteria,
          settings.eventGuidelinesText,
        ]
          .filter(Boolean)
          .join("\n\n")}
        pageSlug="event"
        seo={{
          metaTitle: settings.eventMetaTitle,
          metaDescription: settings.eventMetaDescription,
          ogImage: settings.eventOgImage || settings.eventImageUrl,
          metaKeywords: settings.eventKeywords,
          canonicalUrl: settings.eventCanonicalUrl,
          noIndex: settings.eventNoIndex,
        }}
        onChange={(k, v) => {
          const map = {
            metaTitle: "eventMetaTitle",
            metaDescription: "eventMetaDescription",
            ogImage: "eventOgImage",
            metaKeywords: "eventKeywords",
            canonicalUrl: "eventCanonicalUrl",
            noIndex: "eventNoIndex",
          } as const;
          updateSetting(map[k] as any, v);
        }}
        siteName={settings.siteName || "News Theme"}
      />
    );
  }

  return (
    <PageSeoForm
      pageTitle={active?.title || "Page"}
      pageIntro={active?.intro || ""}
      pageContent={
        active?.sections && active.sections.length > 0
          ? active.sections
              .map((s) => `${s.heading}:\n${htmlToNormalText(s.body)}`)
              .join("\n\n")
          : htmlToNormalText(active?.body || "")
      }
      pageSlug={activeSlug}
      seo={{
        metaTitle: active?.metaTitle,
        metaDescription: active?.metaDescription,
        ogImage: active?.ogImage,
        metaKeywords: active?.metaKeywords,
        canonicalUrl: active?.canonicalUrl,
        noIndex: active?.noIndex,
      }}
      onChange={(k, v) => update(k as any, v as any)}
      siteName={settings.siteName || "News Theme"}
    />
  );
}
