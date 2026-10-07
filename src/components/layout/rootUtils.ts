import {
  defaultAdSlides,
  defaultAdSlidesHome2,
  defaultAdSlidesAd3,
  defaultAdSlidesPopup,
  defaultAdSlidesLeaderboard,
} from "@/lib/site-content";

export function buildAdConfigData(loaderAdsConfig: any) {
  const defaultSlots = {
    home1: defaultAdSlides,
    home2: defaultAdSlidesHome2,
    ad3: defaultAdSlidesAd3,
    popup: defaultAdSlidesPopup,
    leaderboard: defaultAdSlidesLeaderboard,
    hero_showcase: [],
    reel_ads: [],
  };

  if (loaderAdsConfig) {
    return {
      ...loaderAdsConfig,
      slots: {
        ...defaultSlots,
        ...(loaderAdsConfig.slots || {}),
      },
    };
  }

  return {
    slots: defaultSlots,
    modes: {
      home1: "image",
      home2: "image",
      ad3: "image",
      popup: "image",
      leaderboard: "image",
      hero_showcase: "image",
      reel_ads: "image",
    },
    scripts: {
      home1: "",
      home2: "",
      ad3: "",
      popup: "",
      leaderboard: "",
      hero_showcase: "",
      reel_ads: "",
    },
    rotations: {
      home1: 5,
      home2: 5,
      ad3: 5,
      popup: 6,
      leaderboard: 5,
      hero_showcase: 5,
      reel_ads: 5,
    },
  };
}
