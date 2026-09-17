import type { AdSlot } from "@/lib/site-content";

export type SlotMeta = {
  key: AdSlot;
  label: string;
  orientation: "Portrait" | "Landscape" | "Portrait + Landscape";
  ratio: string;
  size: string;
  shownOn: string;
};

export const SLOTS: SlotMeta[] = [
  {
    key: "home1",
    label: "Home 1",
    orientation: "Portrait",
    ratio: "3:4",
    size: "600 × 800 px (WebP)",
    shownOn: "Home page — sidebar next to hero board",
  },
  {
    key: "home2",
    label: "Home 2",
    orientation: "Landscape",
    ratio: "~2:1",
    size: "406 × 196 px (WebP)",
    shownOn: "Home page — Markets Magazine sidebar slideshow",
  },
  {
    key: "ad3",
    label: "Ad 3",
    orientation: "Portrait",
    ratio: "3:4",
    size: "600 × 800 px (WebP)",
    shownOn: "Article & Category pages — sidebar ('Your Ad Here')",
  },
  {
    key: "popup",
    label: "Popup",
    orientation: "Portrait + Landscape",
    ratio: "3:4 (mobile) · 16:9 (desktop)",
    size: "600 × 800 px (mobile) · 1200 × 675 px (desktop) (WebP)",
    shownOn: "Article pages — popup modal 7 seconds after open",
  },
  {
    key: "leaderboard",
    label: "Leaderboard",
    orientation: "Landscape",
    ratio: "~8:1",
    size: "728 × 90 px, 970 × 250 px (WebP)",
    shownOn: "Header or top of pages",
  },
  {
    key: "hero_showcase",
    label: "Featured Ads",
    orientation: "Landscape",
    ratio: "16:9",
    size: "800 × 500 px (WebP)",
    shownOn: "Inside the homepage featured stories slider",
  },
  {
    key: "reel_ads",
    label: "Reel Ads",
    orientation: "Portrait",
    ratio: "9:16",
    size: "1080 × 1920 px (WebP)",
    shownOn: "Watch carousel & Reels grid — auto-inserted every 3 reels",
  },
];

export type Tab = AdSlot | "trash";

export const SAMPLE_GOOGLE_ADSENSE = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456" crossorigin="anonymous"></script>
<!-- Responsive Ad -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-1234567890123456"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;
