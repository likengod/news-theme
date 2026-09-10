import { C as hero_markets_default, S as news_fed_default, _ as news_trade_default, b as news_oil_default, c as formatViews, g as viewsFor, v as news_wallstreet_default, x as news_tech_default, y as news_crypto_default } from "./db.server-Chz3iTW3.js";
import { m as loadAds, u as injectReelAds } from "./site-content-BKtfkHB_.js";
import { n as useAdSettings } from "./AdSettingsContext-CPWUIaiP.js";
import { t as useIsMobile } from "./use-mobile-ZPBRhHdE.js";
import { t as Footer } from "./Footer-CjU-o_Ig.js";
import { a as loadReelsConfig, c as toEmbedSrc } from "./reels-config-4dsZmhVB.js";
import { t as Header } from "./Header-BW827sT5.js";
import { t as Route } from "./reels-DUwGe-UI.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Check, ChevronLeft, ChevronRight, Copy, ExternalLink, Eye, Film, Play, Share2, Sparkles, X } from "lucide-react";
import { FaFacebookF, FaTwitter, FaWhatsapp } from "react-icons/fa6";
//#region src/lib/reels-data.ts
var stockImages = [
	news_tech_default,
	news_wallstreet_default,
	news_trade_default,
	news_fed_default,
	hero_markets_default,
	news_oil_default,
	news_crypto_default
];
var baseWatchItems = [
	{
		title: "Where to Invest 10 Lakh Rupees Amid a Fragile Recovery",
		duration: "1:08",
		img: news_tech_default,
		kicker: "Investment",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 71200
	},
	{
		title: "Iran Leaders Are in No Hurry to Get a Peace Deal",
		duration: "1:16",
		img: news_wallstreet_default,
		kicker: "Geopolitics",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 41300
	},
	{
		title: "A Heartless Supreme Court Decision on Housing Rights",
		duration: "2:12",
		img: news_trade_default,
		kicker: "Opinion",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 393e3
	},
	{
		title: "Apple Sweeping Price Hikes Hit iPads and Macs",
		duration: "1:21",
		img: news_fed_default,
		kicker: "Tech",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 18400
	},
	{
		title: "How the 1994 World Cup Changed the Business of Football Forever",
		duration: "1:39",
		img: hero_markets_default,
		kicker: "Sports",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 138700
	},
	{
		title: "Tesla New Factory Sparks Environmental Concerns in Europe",
		duration: "2:45",
		img: news_oil_default,
		kicker: "Tech",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 52100
	},
	{
		title: "The Rise of Generative AI in Modern Healthcare Systems",
		duration: "1:55",
		img: news_crypto_default,
		kicker: "Health",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 84900
	},
	{
		title: "Global Supply Chain Disruptions Continue to Plague Retailers",
		duration: "3:10",
		img: news_wallstreet_default,
		kicker: "Business",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 63400
	},
	{
		title: "ত্রিপুরায় বাঁশ শিল্পের নতুন বিপ্লব ও বিশ্ববাজারে রপ্তানি",
		duration: "1:42",
		img: news_tech_default,
		kicker: "ত্রিপুরা",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 95200
	},
	{
		title: "আগরতলা স্মার্ট সিটির দ্বিতীয় পর্যায়ের মেগা প্রকল্প",
		duration: "2:15",
		img: news_trade_default,
		kicker: "উন্নয়ন",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 48900
	},
	{
		title: "উত্তর-পূর্ব ভারতের পর্যটনে রেকর্ড প্রবৃদ্ধি",
		duration: "1:50",
		img: news_fed_default,
		kicker: "উত্তর-পূর্ব",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 112e3
	},
	{
		title: "ভারত-অস্ট্রেলিয়া টেস্টে রোহিত শর্মার ঐতিহাসিক ইনিংস",
		duration: "2:04",
		img: hero_markets_default,
		kicker: "খেলা",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 45e4
	},
	{
		title: "সৌরশক্তি বিপ্লবে ভারতের বিশ্বরেকর্ড স্থাপন",
		duration: "1:35",
		img: news_oil_default,
		kicker: "শক্তি",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 33400
	},
	{
		title: "সাইবার সুরক্ষায় নতুন দিগন্ত: হ্যাকারদের রুখতে এআই",
		duration: "2:30",
		img: news_crypto_default,
		kicker: "প্রযুক্তি",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 78100
	},
	{
		title: "জেইই মেইন পরীক্ষায় ত্রিপুরার ছাত্রের শীর্ষ সাফল্য",
		duration: "1:48",
		img: news_wallstreet_default,
		kicker: "শিক্ষা",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 162e3
	},
	{
		title: "বলিউডের নতুন ব্লকবাস্টার: রণভূমির বক্স অফিস ঝড়",
		duration: "1:25",
		img: news_tech_default,
		kicker: "সিনেমা",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 29e4
	},
	{
		title: "পিভি সিন্ধুর বিশ্ব চ্যাম্পিয়নশিপ জয়ের স্বর্ণমুহূর্ত",
		duration: "2:18",
		img: news_trade_default,
		kicker: "খেলা",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 215e3
	},
	{
		title: "উনকোটি মন্দিরের অজানা রহস্য ও স্থাপত্য কলা",
		duration: "3:05",
		img: news_fed_default,
		kicker: "ঐতিহ্য",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 185e3
	},
	{
		title: "স্পেসএক্সের স্টারশিপ মহাকাশ মিশনের ঐতিহাসিক মুহূর্ত",
		duration: "1:58",
		img: hero_markets_default,
		kicker: "বিজ্ঞান",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 31e4
	},
	{
		title: "আগরতলা-আখাউড়া রেলযাত্রার প্রথম দিনের অভিজ্ঞতা",
		duration: "2:22",
		img: news_oil_default,
		kicker: "যোগাযোগ",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 142e3
	},
	{
		title: "বিরাট কোহলির আইপিএল ৮০০০ রানের সেরা মুহূর্তগুলি",
		duration: "2:10",
		img: news_crypto_default,
		kicker: "ক্রিকেট",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 52e4
	},
	{
		title: "কৃত্রিম বুদ্ধিমত্তা কীভাবে কর্মক্ষেত্র পরিবর্তন করছে",
		duration: "1:40",
		img: news_wallstreet_default,
		kicker: "প্রযুক্তি",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 67e3
	},
	{
		title: "মেট্রো রেলের নতুন সম্প্রসারণ: ২০টি নতুন শহরের তালিকা",
		duration: "2:05",
		img: news_tech_default,
		kicker: "পরিকাঠামো",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 124e3
	},
	{
		title: "ডিমাপুর বিমানবন্দরের আধুনিক নতুন টার্মিনাল পরিদর্শন",
		duration: "1:33",
		img: news_trade_default,
		kicker: "ভ্রমণ",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 45e3
	},
	{
		title: "অরিজিৎ সিং-এর মনের কথা অ্যালবাম নিয়ে উন্মাদনা",
		duration: "1:52",
		img: news_fed_default,
		kicker: "সংগীত",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 89e4
	},
	{
		title: "প্যারিস অলিম্পিকে নীরজ চোপড়ার জ্যাভেলিন ফাইনালে",
		duration: "2:15",
		img: hero_markets_default,
		kicker: "অলিম্পিক",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 68e4
	},
	{
		title: "মুম্বাইয়ের নতুন আন্তর্জাতিক বিমানবন্দর চালু হল",
		duration: "2:40",
		img: news_oil_default,
		kicker: "দেশ",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 195e3
	},
	{
		title: "ত্রিপুরায় রাবার চাষে কৃষকদের অভাবনীয় সাফল্য",
		duration: "1:45",
		img: news_crypto_default,
		kicker: "কৃষি",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 38e3
	},
	{
		title: "আন্তর্জাতিক বাজারে সোনার দাম বাড়ার পেছনের কারণ",
		duration: "1:30",
		img: news_wallstreet_default,
		kicker: "বাজার",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 156e3
	},
	{
		title: "বৈদ্যুতিক যানবাহনের সুবিধা ও চার্জিং স্টেশন নেটওয়ার্ক",
		duration: "2:25",
		img: news_tech_default,
		kicker: "অটো",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 87e3
	},
	{
		title: "উচ্চশিক্ষায় ছাত্রীদের বিশেষ স্কলারশিপের আবেদন প্রক্রিয়া",
		duration: "1:50",
		img: news_trade_default,
		kicker: "শিক্ষা",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 104e3
	},
	{
		title: "অনলাইন সাইবার স্ক্যাম থেকে পরিবারকে সুরক্ষিত রাখুন",
		duration: "2:14",
		img: news_fed_default,
		kicker: "নিরাপত্তা",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 22e4
	},
	{
		title: "মেঘালয়ের জীবন্ত শিকড়ের সেতু: প্রকৃতির অনন্য সৃষ্টি",
		duration: "2:50",
		img: hero_markets_default,
		kicker: "প্রকৃতি",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 34e4
	},
	{
		title: "সুনীল ছেত্রির বিদায়ি আন্তর্জাতিক ম্যাচের স্মরণীয় মুহূর্ত",
		duration: "2:05",
		img: news_oil_default,
		kicker: "ফুটবল",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 41e4
	},
	{
		title: "আগরতলার ঐতিহ্যবাহী লোক উৎসব ও সংস্কৃতি",
		duration: "1:40",
		img: news_crypto_default,
		kicker: "সংস্কৃতি",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 59e3
	},
	{
		title: "জলবায়ু পরিবর্তন প্রতিরোধে দেড়শো দেশের চুক্তি",
		duration: "2:12",
		img: news_wallstreet_default,
		kicker: "পরিবেশ",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 76e3
	},
	{
		title: "সোশ্যাল মিডিয়ায় ট্রেন্ডিং ভিডিও বানানোর ৫টি নিয়ম",
		duration: "1:28",
		img: news_tech_default,
		kicker: "সোশ্যাল",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 18e4
	},
	{
		title: "নতুন কেন্দ্রীয় বাজেটের মূল সুবিধাগুলি এক নজরে",
		duration: "2:35",
		img: news_trade_default,
		kicker: "অর্থনীতি",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 98e3
	},
	{
		title: "আইআইটি দিল্লির নতুন মহাকাশ গবেষণা ল্যাব",
		duration: "1:55",
		img: news_fed_default,
		kicker: "বিজ্ঞান",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 64e3
	},
	{
		title: "শিলং ও চেরাপুঞ্জির মনোমুগ্ধকর জলপ্রপাত",
		duration: "1:44",
		img: hero_markets_default,
		kicker: "ভ্রমণ",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 275e3
	},
	{
		title: "জাপানের বুলেট ট্রেনের অত্যাধুনিক নিরাপত্তা ব্যবস্থা",
		duration: "2:02",
		img: news_oil_default,
		kicker: "প্রযুক্তি",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 13e4
	},
	{
		title: "আন্তর্জাতিক ওটিটি প্ল্যাটফর্মে বাংলা সিনেমার জয়জয়কার",
		duration: "2:20",
		img: news_crypto_default,
		kicker: "বিনোদন",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 31e4
	},
	{
		title: "দাবায় বিশ্ব জয়: আর প্রজ্ঞানন্দের সেরা জয়ের চাল",
		duration: "2:45",
		img: news_wallstreet_default,
		kicker: "দাবা",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 24e4
	},
	{
		title: "সাবরুম স্থল বন্দর দিয়ে ভারত-বাংলাদেশ নতুন বাণিজ্য",
		duration: "1:50",
		img: news_tech_default,
		kicker: "বাণিজ্য",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 89e3
	},
	{
		title: "অনলাইন ব্যাংক ফ্রড থেকে বাঁচার জরুরি উপায়",
		duration: "1:35",
		img: news_trade_default,
		kicker: "সচেতনতা",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 165e3
	},
	{
		title: "ইসরোর গগনযান মিশনে মহাকাশচারীদের প্রশিক্ষণ",
		duration: "2:30",
		img: news_fed_default,
		kicker: "ইসরো",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 42e4
	},
	{
		title: "উত্তর-পূর্বের চা বাগানের প্রাকৃতিক সৌন্দর্য ও গল্প",
		duration: "2:15",
		img: hero_markets_default,
		kicker: "জীবনযাত্রা",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 115e3
	},
	{
		title: "মোবাইলের চার্জ সারাদিন ধরে রাখার সহজ ৫টি সেটিংস",
		duration: "1:20",
		img: news_oil_default,
		kicker: "গ্যাজেট",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 51e4
	},
	{
		title: "প্রো কবাডি লিগের জমজমাট ফাইনাল ম্যাচ হাইলাইটস",
		duration: "2:08",
		img: news_crypto_default,
		kicker: "কবাডি",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 175e3
	},
	{
		title: "ত্রিপুরায় তৈরি নতুন তথ্যপ্রযুক্তি পার্কের পরিকল্পনা",
		duration: "2:00",
		img: news_wallstreet_default,
		kicker: "আইটি",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 62e3
	},
	{
		title: "বিশ্বের বৃহত্তম সৌর পার্কের বিস্ময়কর দৃশ্য",
		duration: "1:48",
		img: news_tech_default,
		kicker: "সবুজশক্তি",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 92e3
	},
	{
		title: "শাহরুখ খানের নতুন সিনেমা ব্লাড ফ্যামিলির প্রথম লুক",
		duration: "1:32",
		img: news_trade_default,
		kicker: "বিনোদন",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 74e4
	},
	{
		title: "বিশ্বকাপ হকিতে ভারতের শ্বাসরুদ্ধকর কোয়ার্টার ফাইনাল জয়",
		duration: "2:25",
		img: news_fed_default,
		kicker: "হকি",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 29e4
	},
	{
		title: "ত্রিপুরার ঐতিহ্যবাহী কর কর পুজোর অপূর্ব নৃত্য",
		duration: "2:40",
		img: hero_markets_default,
		kicker: "উৎসব",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 128e3
	},
	{
		title: "প্রতিদিনের ব্যায়াম ও সুস্বাস্থ্যের প্রয়োজনীয় নিয়ম",
		duration: "1:50",
		img: news_oil_default,
		kicker: "স্বাস্থ্য",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 145e3
	},
	{
		title: "কৃষিতে ড্রোনের ব্যবহার: ফসলের ফলন দ্বিগুণ করার কৌশল",
		duration: "2:14",
		img: news_crypto_default,
		kicker: "কৃষি",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 83e3
	},
	{
		title: "কান চলচ্চিত্র উৎসবে ভারতীয় সিনেমার ঐতিহাসিক পুরস্কার",
		duration: "1:45",
		img: news_wallstreet_default,
		kicker: "সিনেমা",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 39e4
	},
	{
		title: "স্মার্ট ক্যারিয়ার নির্বাচন: ভবিষ্যতের সবচেয়ে চাহিদাসম্পন্ন ক্ষেত্র",
		duration: "2:10",
		img: news_tech_default,
		kicker: "ক্যারিয়ার",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 11e4
	},
	{
		title: "নাগাল্যান্ডের ঐতিহ্যবাহী হর্নবিল উৎসবের সাংস্কৃতিক মেলা",
		duration: "2:55",
		img: news_trade_default,
		kicker: "সংস্কৃতি",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 205e3
	},
	{
		title: "ইউপিআই ও মোবাইল পেমেন্ট ব্যবহারের নিরাপত্তা নির্দেশিকা",
		duration: "1:38",
		img: news_fed_default,
		kicker: "সচেতনতা",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
		views: 185e3
	}
];
function getAllReels() {
	try {
		const cfg = loadReelsConfig();
		const customItems = [];
		if (cfg && cfg.enabled && Array.isArray(cfg.urls)) cfg.urls.forEach((url, i) => {
			const embed = toEmbedSrc(cfg.provider, url);
			if (embed) customItems.push({
				title: "Featured Reel #" + (i + 1),
				duration: "1:00",
				img: stockImages[i % stockImages.length],
				kicker: "Featured",
				embedSrc: embed,
				views: 5e4 + i * 1234
			});
		});
		return [...customItems, ...baseWatchItems];
	} catch {
		return baseWatchItems;
	}
}
//#endregion
//#region src/components/site/ReelViewerModal.tsx
function ReelViewerModal({ initialIndex, items, onClose }) {
	const [currentIndex, setCurrentIndex] = useState(initialIndex);
	const [copied, setCopied] = useState(false);
	const [showShareMenu, setShowShareMenu] = useState(false);
	const touchStartRef = useRef(null);
	const currentItem = items[currentIndex] || items[0];
	if (!currentItem) return null;
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowRight" || e.key === "ArrowDown") {
				setCurrentIndex((i) => (i + 1) % items.length);
				setShowShareMenu(false);
			}
			if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
				setCurrentIndex((i) => (i - 1 + items.length) % items.length);
				setShowShareMenu(false);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [items.length, onClose]);
	const handleTouchStart = (e) => {
		const t = e.touches[0];
		touchStartRef.current = {
			x: t.clientX,
			y: t.clientY
		};
	};
	const handleTouchEnd = (e) => {
		if (!touchStartRef.current) return;
		const t = e.changedTouches[0];
		const dx = t.clientX - touchStartRef.current.x;
		const dy = t.clientY - touchStartRef.current.y;
		touchStartRef.current = null;
		if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 60) {
			onClose();
			return;
		}
		if (Math.abs(dx) > 40) {
			setShowShareMenu(false);
			if (dx < 0) setCurrentIndex((i) => (i + 1) % items.length);
			else setCurrentIndex((i) => (i - 1 + items.length) % items.length);
		}
	};
	const handleCopyLink = (e) => {
		e.stopPropagation();
		const shareUrl = typeof window !== "undefined" ? window.location.href : "";
		navigator.clipboard.writeText(shareUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	const handleNativeShare = async (e) => {
		e.stopPropagation();
		const shareUrl = typeof window !== "undefined" ? window.location.href : "";
		if (typeof navigator !== "undefined" && navigator.share) try {
			await navigator.share({
				title: currentItem.title,
				text: "Watch " + currentItem.title + " on Vanguard News",
				url: shareUrl
			});
			return;
		} catch {}
		setShowShareMenu((v) => !v);
	};
	const currentUrl = typeof window !== "undefined" ? window.location.href : "";
	const shareText = encodeURIComponent("Watch " + currentItem.title + ": " + currentUrl);
	const viewCount = currentItem.views || viewsFor(currentItem.title);
	return /* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200",
		onTouchStart: handleTouchStart,
		onTouchEnd: handleTouchEnd,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "z-30 flex items-center justify-between text-white max-w-lg mx-auto w-full pt-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
						children: [
							"Reel ",
							currentIndex + 1,
							" / ",
							items.length
						]
					}), /* @__PURE__ */ jsx("span", {
						className: "text-xs text-white/70 hidden sm:inline",
						children: "Swipe left/right for next • Swipe up to close"
					})]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onClose,
					"aria-label": "Close Reel",
					className: "flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/40",
					children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative my-auto flex h-[76vh] w-full max-w-md mx-auto items-center justify-center",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative aspect-[9/16] h-full w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl",
					children: [
						/* @__PURE__ */ jsx("iframe", {
							src: currentItem.embedSrc,
							title: currentItem.title,
							className: "h-full w-full object-cover",
							allow: "autoplay; encrypted-media; picture-in-picture",
							allowFullScreen: true,
							frameBorder: 0
						}, currentItem.title + currentIndex),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: (e) => {
								e.stopPropagation();
								setShowShareMenu(false);
								setCurrentIndex((i) => (i - 1 + items.length) % items.length);
							},
							className: "absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur border border-white/20 transition hover:bg-black/80",
							"aria-label": "Previous Reel",
							children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: (e) => {
								e.stopPropagation();
								setShowShareMenu(false);
								setCurrentIndex((i) => (i + 1) % items.length);
							},
							className: "absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur border border-white/20 transition hover:bg-black/80",
							"aria-label": "Next Reel",
							children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-6 w-6" })
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "absolute right-1 bottom-6 flex flex-col items-center gap-4 z-30",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col items-center gap-1 text-white",
							title: "Views",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur border border-white/20 shadow-xl",
								children: /* @__PURE__ */ jsx(Eye, { className: "h-5 w-5 text-white/90" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-bold tracking-wide text-white/90",
								children: formatViews(viewCount)
							})]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleNativeShare,
							className: "flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform",
							title: "Share Reel",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur border border-white/20 shadow-xl",
								children: /* @__PURE__ */ jsx(Share2, { className: "h-5 w-5 text-white/90" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-medium tracking-wide text-white/90",
								children: "Share"
							})]
						}),
						showShareMenu && /* @__PURE__ */ jsxs("div", {
							className: "absolute bottom-0 right-14 flex flex-col gap-2 rounded-xl border border-white/10 bg-black/90 p-2 shadow-2xl backdrop-blur animate-in fade-in zoom-in-95 duration-150",
							children: [
								/* @__PURE__ */ jsx("a", {
									href: "https://api.whatsapp.com/send?text=" + shareText,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white hover:scale-110 transition-transform",
									title: "Share on WhatsApp",
									children: /* @__PURE__ */ jsx(FaWhatsapp, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ jsx("a", {
									href: "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(currentUrl),
									target: "_blank",
									rel: "noopener noreferrer",
									className: "flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white hover:scale-110 transition-transform",
									title: "Share on Facebook",
									children: /* @__PURE__ */ jsx(FaFacebookF, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ jsx("a", {
									href: "https://twitter.com/intent/tweet?text=" + shareText,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "flex h-9 w-9 items-center justify-center rounded-full bg-black text-white hover:scale-110 transition-transform border border-white/20",
									title: "Share on X",
									children: /* @__PURE__ */ jsx(FaTwitter, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: handleCopyLink,
									className: "flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white hover:scale-110 transition-transform",
									title: "Copy Link",
									children: copied ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-green-400" }) : /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" })
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "z-30 text-white max-w-md mx-auto w-full pb-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 mb-1.5",
					children: [currentItem.kicker && /* @__PURE__ */ jsx("span", {
						className: "rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase",
						children: currentItem.kicker
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-xs text-white/70",
						children: ["Duration: ", currentItem.duration]
					})]
				}), /* @__PURE__ */ jsx("h3", {
					className: "font-bold text-sm sm:text-base leading-snug drop-shadow line-clamp-2",
					children: currentItem.title
				})]
			})
		]
	});
}
//#endregion
//#region src/routes/reels.tsx?tsr-split=component
function ReelsPage() {
	const currentPage = Route.useSearch().page ?? 1;
	const ITEMS_PER_PAGE = 20;
	const allReels = useMemo(() => getAllReels(), []);
	const totalItems = allReels.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
	const validPage = Math.min(Math.max(1, currentPage), totalPages);
	const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
	const currentReels = allReels.slice(startIndex, startIndex + ITEMS_PER_PAGE);
	const adCtx = useAdSettings();
	const reelAds = useMemo(() => {
		return adCtx?.adConfig?.slots?.["reel_ads"] || loadAds("reel_ads");
	}, [adCtx?.adConfig?.slots]);
	const isMobile = useIsMobile();
	const displayReels = useMemo(() => {
		return injectReelAds(currentReels, reelAds, isMobile ? {
			firstAfter: 1,
			interval: 2
		} : 3);
	}, [
		currentReels,
		reelAds,
		isMobile
	]);
	const [activeModalIndex, setActiveModalIndex] = useState(null);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-7xl px-3 sm:px-4 py-4 md:py-8 flex-1 w-full",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mb-3 md:mb-6 flex items-center justify-between border-b border-border pb-2.5 md:pb-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg bg-red-600 text-white shadow",
								children: /* @__PURE__ */ jsx(Film, { className: "h-3.5 w-3.5 md:h-4 md:w-4" })
							}), /* @__PURE__ */ jsx("h1", {
								className: "text-lg md:text-2xl font-black uppercase tracking-wider text-foreground",
								children: "Reels & Shorts"
							})]
						}), /* @__PURE__ */ jsx("p", {
							className: "hidden sm:block text-xs text-muted-foreground mt-1",
							children: "Explore short-form video stories, breaking coverage & highlights"
						})] }), /* @__PURE__ */ jsx("div", {
							className: "hidden sm:flex items-center gap-2 text-xs font-semibold text-muted-foreground",
							children: /* @__PURE__ */ jsxs("span", {
								className: "rounded-full bg-muted px-3 py-1 border border-border",
								children: [
									"Page ",
									validPage,
									" of ",
									totalPages,
									" (",
									totalItems,
									" Reels)"
								]
							})
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4",
						children: displayReels.map((entry, index) => {
							if (entry.isAd && entry.ad) {
								const ad = entry.ad;
								const adImg = ad.imagePortrait || ad.imageLandscape || ad.image;
								const adHref = ad.href || "#";
								const isGenericLabel = !ad.label || /^(sponsored|sponsor|ad|ads|advertisement|sponsored ad)$/i.test(ad.label.trim());
								return /* @__PURE__ */ jsxs("div", {
									className: "group flex flex-col",
									children: [/* @__PURE__ */ jsxs("a", {
										href: adHref,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "block relative aspect-[9/16] w-full overflow-hidden rounded-lg sm:rounded-xl bg-black border border-amber-500/40 shadow-sm transition duration-300 group-hover:scale-[1.02] group-hover:border-amber-400 group-hover:shadow-md",
										children: [
											/* @__PURE__ */ jsx("img", {
												src: adImg,
												alt: ad.label || "Sponsored Ad",
												loading: "lazy",
												className: "h-full w-full object-cover transition duration-500 group-hover:scale-105"
											}),
											/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" }),
											/* @__PURE__ */ jsx("div", {
												className: "absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 flex items-center gap-1",
												children: /* @__PURE__ */ jsxs("span", {
													className: "inline-flex items-center gap-0.5 text-[7px] sm:text-[8px] md:text-[9.5px] font-semibold text-white/90 bg-black/50 backdrop-blur-md px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full border border-white/20 group-hover:bg-amber-500 group-hover:text-black group-hover:border-amber-400 transition-colors leading-none",
													children: [/* @__PURE__ */ jsx("span", { children: "Visit" }), /* @__PURE__ */ jsx(ExternalLink, { className: "h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0" })]
												})
											})
										]
									}), /* @__PURE__ */ jsxs("div", {
										className: "mt-1 flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-amber-600 dark:text-amber-500 truncate",
										children: [
											/* @__PURE__ */ jsx(Sparkles, { className: "h-2.5 w-2.5 shrink-0" }),
											/* @__PURE__ */ jsx("span", { children: "Sponsored" }),
											!isGenericLabel && /* @__PURE__ */ jsxs("span", {
												className: "text-muted-foreground font-normal ml-0.5 truncate",
												children: ["· ", ad.label]
											})
										]
									})]
								}, `reel-ad-${index}`);
							}
							const reel = entry.item;
							const globalIndex = startIndex + entry.originalIndex;
							const count = reel.views || viewsFor(reel.title);
							return /* @__PURE__ */ jsxs("div", {
								onClick: () => setActiveModalIndex(globalIndex),
								className: "group cursor-pointer flex flex-col",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "relative aspect-[9/16] w-full overflow-hidden rounded-lg sm:rounded-xl bg-black border border-border/40 shadow-sm transition duration-300 group-hover:scale-[1.02] group-hover:shadow-md",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: reel.img,
											alt: reel.title,
											loading: "lazy",
											className: "h-full w-full object-cover transition duration-500 group-hover:scale-105"
										}),
										/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" }),
										reel.kicker && /* @__PURE__ */ jsx("span", {
											className: "absolute left-1.5 top-1.5 sm:left-2 sm:top-2 bg-blue-600 px-1.5 py-0.5 text-[8px] sm:text-[10px] font-bold text-white rounded shadow-sm",
											children: reel.kicker
										}),
										/* @__PURE__ */ jsx("h3", {
											className: "absolute bottom-8 sm:bottom-9 left-1.5 right-1.5 sm:left-2 sm:right-2 text-[9px] sm:text-xs font-bold leading-tight text-white drop-shadow line-clamp-2",
											children: reel.title
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 flex items-center gap-1 sm:gap-1.5",
											children: [/* @__PURE__ */ jsx("span", {
												className: "flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-white text-black shadow transition-transform group-hover:scale-110",
												children: /* @__PURE__ */ jsx(Play, { className: "h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current ml-0.5" })
											}), /* @__PURE__ */ jsx("span", {
												className: "text-[8px] sm:text-[10px] font-semibold text-white drop-shadow",
												children: reel.duration
											})]
										})
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "mt-1 flex items-center gap-1 text-[9px] sm:text-[11px] text-muted-foreground",
									children: [/* @__PURE__ */ jsx(Eye, { className: "h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground/70" }), /* @__PURE__ */ jsx("span", { children: formatViews(count) })]
								})]
							}, reel.title + index);
						})
					}),
					totalPages > 1 && /* @__PURE__ */ jsxs("div", {
						className: "mt-10 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "text-xs text-muted-foreground order-2 sm:order-1",
							children: [
								"Showing ",
								/* @__PURE__ */ jsx("strong", {
									className: "text-foreground",
									children: startIndex + 1
								}),
								"–",
								/* @__PURE__ */ jsx("strong", {
									className: "text-foreground",
									children: Math.min(startIndex + ITEMS_PER_PAGE, totalItems)
								}),
								" of",
								" ",
								/* @__PURE__ */ jsx("strong", {
									className: "text-foreground",
									children: totalItems
								}),
								" reels"
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1.5 order-1 sm:order-2",
							children: [
								validPage > 1 ? /* @__PURE__ */ jsxs(Link, {
									to: "/reels",
									search: { page: validPage - 1 },
									className: "flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-xs font-semibold text-foreground transition hover:bg-foreground hover:text-background",
									children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "Prev" })]
								}) : /* @__PURE__ */ jsxs("span", {
									className: "flex h-9 items-center gap-1 rounded-lg border border-border/40 px-3 text-xs font-semibold text-muted-foreground/40 cursor-not-allowed",
									children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "Prev" })]
								}),
								Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
									return /* @__PURE__ */ jsx(Link, {
										to: "/reels",
										search: { page: pageNum },
										className: `flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition ${pageNum === validPage ? "bg-foreground text-background shadow" : "border border-border text-foreground hover:bg-muted"}`,
										children: pageNum
									}, pageNum);
								}),
								validPage < totalPages ? /* @__PURE__ */ jsxs(Link, {
									to: "/reels",
									search: { page: validPage + 1 },
									className: "flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-xs font-semibold text-foreground transition hover:bg-foreground hover:text-background",
									children: [/* @__PURE__ */ jsx("span", { children: "Next" }), /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })]
								}) : /* @__PURE__ */ jsxs("span", {
									className: "flex h-9 items-center gap-1 rounded-lg border border-border/40 px-3 text-xs font-semibold text-muted-foreground/40 cursor-not-allowed",
									children: [/* @__PURE__ */ jsx("span", { children: "Next" }), /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })]
								})
							]
						})]
					}),
					activeModalIndex !== null && /* @__PURE__ */ jsx(ReelViewerModal, {
						initialIndex: activeModalIndex,
						items: allReels,
						onClose: () => setActiveModalIndex(null)
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { ReelsPage as component };
