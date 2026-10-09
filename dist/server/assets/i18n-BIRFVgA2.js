import { useEffect, useState } from "react";
//#endregion
//#region src/lib/i18n.ts
var resources = {
	en: {
		nav: {
			"home": "Home",
			"subscribe": "Subscribe",
			"nightMode": "Night mode",
			"search": "Search news…",
			"navigation": "Navigation"
		},
		sideNav: {
			"live": "Live",
			"reels": "Shorts / Reels",
			"results": "Results",
			"videos": "Videos",
			"photos": "Photo Gallery",
			"factCheck": "Fact Check",
			"opinion": "Opinion",
			"archive": "Archive",
			"urgent": "Utilities",
			"emiCalculator": "EMI Calculator",
			"ageCalculator": "Age Calculator"
		},
		footer: {
			"quickLinks": "Quick Links",
			"connectWithUs": "Connect With Us",
			"about": "About",
			"contact": "Contact Us",
			"submitNews": "Submit News",
			"event": "Event",
			"privacyPolicy": "Privacy Policy",
			"terms": "Terms & Conditions",
			"cookiePolicy": "Cookie Policy",
			"refundPolicy": "Refund Policy",
			"disclaimer": "Disclaimer",
			"editorialPolicy": "Editorial Policy",
			"dmca": "DMCA",
			"factCheck": "Fact Check",
			"factCheckingPolicy": "Fact-Checking Policy",
			"verifiedJournalist": "Verified Journalist",
			"subscription": "Subscription",
			"workWithUs": "Work With Us",
			"archive": "Archive",
			"earnPoints": "Earn Points",
			"builtBy": "Website built and digital partner",
			"readMore": "Read more"
		}
	},
	hi: {
		nav: {
			"home": "होम",
			"subscribe": "सब्सक्राइब",
			"nightMode": "डार्क मोड",
			"search": "समाचार खोजें…",
			"navigation": "नेविगेशन"
		},
		sideNav: {
			"live": "लाइव",
			"reels": "शॉर्ट्स / रील्स",
			"results": "परिणाम",
			"videos": "वीडियो",
			"photos": "फोटो गैलरी",
			"factCheck": "फैक्ट चेक",
			"opinion": "विचार / ओपिनियन",
			"archive": "आर्काइव",
			"urgent": "ज़रूरी",
			"emiCalculator": "ईएमआई कैलकुलेटर",
			"ageCalculator": "आयु कैलकुलेटर"
		},
		footer: {
			"quickLinks": "त्वरित लिंक",
			"connectWithUs": "हमसे जुड़ें",
			"about": "हमारे बारे में",
			"contact": "संपर्क करें",
			"submitNews": "समाचार भेजें",
			"event": "इवेंट",
			"privacyPolicy": "गोपनीयता नीति",
			"terms": "नियम और शर्तें",
			"cookiePolicy": "कुकी नीति",
			"refundPolicy": "रिफंड नीति",
			"disclaimer": "अस्वीकरण",
			"editorialPolicy": "संपादकीय नीति",
			"factCheck": "फैक्ट चेक",
			"factCheckingPolicy": "फैक्ट-चेकिंग नीति",
			"dmca": "DMCA",
			"verifiedJournalist": "सत्यापित पत्रकार",
			"subscription": "सदस्यता",
			"workWithUs": "हमारे साथ काम करें",
			"archive": "पुरालेख",
			"earnPoints": "अंक अर्जित करें",
			"builtBy": "वेबसाइट निर्माण और डिजिटल पार्टनर",
			"readMore": "और पढ़ें"
		}
	},
	bn: {
		nav: {
			"home": "হোম",
			"subscribe": "সাবস্ক্রাইব",
			"nightMode": "নাইট মোড",
			"search": "খবর খুঁজুন…",
			"navigation": "নেভিগেশন"
		},
		sideNav: {
			"live": "লাইভ",
			"reels": "শর্টস / Reels",
			"results": "Result",
			"videos": "ভিডিও",
			"photos": "ফটো গ্যালারি",
			"factCheck": "ফ্যাক্ট চেক",
			"opinion": "ওপিনিয়ন",
			"archive": "আর্কাইভ",
			"urgent": "জরুরি",
			"emiCalculator": "EMI ক্যালকুলেটর",
			"ageCalculator": "বয়সের ক্যালকুলেটর"
		},
		footer: {
			"quickLinks": "দ্রুত লিঙ্ক",
			"connectWithUs": "আমাদের সাথে যুক্ত হন",
			"about": "আমাদের সম্পর্কে",
			"contact": "যোগাযোগ করুন",
			"submitNews": "খবর পাঠান",
			"event": "ইভেন্ট",
			"privacyPolicy": "গোপনীয়তা নীতি",
			"terms": "শর্তাবলী",
			"cookiePolicy": "কুকি নীতি",
			"refundPolicy": "রিফান্ড নীতি",
			"disclaimer": "দাবিত্যাগ",
			"editorialPolicy": "সম্পাদকীয় নীতি",
			"dmca": "DMCA",
			"factCheck": "ফ্যাক্ট চেক",
			"factCheckingPolicy": "ফ্যাক্ট-চেকিং নীতি",
			"verifiedJournalist": "যাচাইকৃত সাংবাদিক",
			"subscription": "সাবস্ক্রিপশন",
			"workWithUs": "আমাদের সাথে কাজ করুন",
			"archive": "আর্কাইভ",
			"earnPoints": "পয়েন্ট অর্জন করুন",
			"builtBy": "ওয়েবসাইট নির্মাণ এবং ডিজিটাল পার্টনার",
			"readMore": "আরও পড়ুন"
		}
	}
};
var currentLanguage = "en";
var listeners = /* @__PURE__ */ new Set();
function detectInitialLanguage() {
	if (typeof window === "undefined") return "en";
	try {
		const cookie = document.cookie;
		if (cookie.includes("googtrans=/en/hi") || cookie.includes("googtrans=%2Fen%2Fhi")) return "hi";
		if (cookie.includes("googtrans=/en/bn") || cookie.includes("googtrans=%2Fen%2Fbn")) return "bn";
		const stored = localStorage.getItem("nt_i18n_lang");
		if (stored && resources[stored]) return stored;
		const navLang = navigator.language?.toLowerCase() || "";
		if (navLang.startsWith("hi")) return "hi";
		if (navLang.startsWith("bn")) return "bn";
	} catch {}
	return "en";
}
if (typeof window !== "undefined") currentLanguage = detectInitialLanguage();
var i18n = {
	get language() {
		return currentLanguage;
	},
	changeLanguage(lng) {
		if (resources[lng]) currentLanguage = lng;
		else currentLanguage = "en";
		if (typeof window !== "undefined") try {
			localStorage.setItem("nt_i18n_lang", currentLanguage);
		} catch {}
		listeners.forEach((fn) => fn());
		return Promise.resolve();
	}
};
function useTranslation() {
	const [, setTick] = useState(0);
	useEffect(() => {
		const handler = () => setTick((t) => t + 1);
		listeners.add(handler);
		return () => {
			listeners.delete(handler);
		};
	}, []);
	const t = (key, fallback) => {
		const parts = key.split(".");
		let current = resources[currentLanguage] || resources.en;
		for (const part of parts) if (current && typeof current === "object" && part in current) current = current[part];
		else {
			current = void 0;
			break;
		}
		if (typeof current === "string") return current;
		if (fallback !== void 0) return fallback;
		return parts[parts.length - 1] || key;
	};
	return {
		t,
		i18n
	};
}
//#endregion
export { useTranslation as t };

//# sourceMappingURL=i18n-BIRFVgA2.js.map