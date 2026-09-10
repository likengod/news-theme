import fedImg from '@/assets/news-fed.webp';
import techImg from '@/assets/news-tech.webp';
import oilImg from '@/assets/news-oil.webp';
import cryptoImg from '@/assets/news-crypto.webp';
import wsImg from '@/assets/news-wallstreet.webp';
import tradeImg from '@/assets/news-trade.webp';
import heroImg from '@/assets/hero-markets.webp';
import { loadReelsConfig, toEmbedSrc } from '@/lib/reels-config';

export type WatchItem = {
  id?: string | number;
  title: string;
  duration: string;
  img: string;
  kicker: string | null;
  embedSrc: string;
  views?: number;
};

const stockImages = [techImg, wsImg, tradeImg, fedImg, heroImg, oilImg, cryptoImg];

export const baseWatchItems: WatchItem[] = [
  { title: 'Where to Invest 10 Lakh Rupees Amid a Fragile Recovery', duration: '1:08', img: techImg, kicker: 'Investment', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 71200 },
  { title: 'Iran Leaders Are in No Hurry to Get a Peace Deal', duration: '1:16', img: wsImg, kicker: 'Geopolitics', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 41300 },
  { title: 'A Heartless Supreme Court Decision on Housing Rights', duration: '2:12', img: tradeImg, kicker: 'Opinion', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 393000 },
  { title: 'Apple Sweeping Price Hikes Hit iPads and Macs', duration: '1:21', img: fedImg, kicker: 'Tech', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 18400 },
  { title: 'How the 1994 World Cup Changed the Business of Football Forever', duration: '1:39', img: heroImg, kicker: 'Sports', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 138700 },
  { title: 'Tesla New Factory Sparks Environmental Concerns in Europe', duration: '2:45', img: oilImg, kicker: 'Tech', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 52100 },
  { title: 'The Rise of Generative AI in Modern Healthcare Systems', duration: '1:55', img: cryptoImg, kicker: 'Health', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 84900 },
  { title: 'Global Supply Chain Disruptions Continue to Plague Retailers', duration: '3:10', img: wsImg, kicker: 'Business', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 63400 },
  { title: 'ত্রিপুরায় বাঁশ শিল্পের নতুন বিপ্লব ও বিশ্ববাজারে রপ্তানি', duration: '1:42', img: techImg, kicker: 'ত্রিপুরা', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 95200 },
  { title: 'আগরতলা স্মার্ট সিটির দ্বিতীয় পর্যায়ের মেগা প্রকল্প', duration: '2:15', img: tradeImg, kicker: 'উন্নয়ন', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 48900 },
  { title: 'উত্তর-পূর্ব ভারতের পর্যটনে রেকর্ড প্রবৃদ্ধি', duration: '1:50', img: fedImg, kicker: 'উত্তর-পূর্ব', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 112000 },
  { title: 'ভারত-অস্ট্রেলিয়া টেস্টে রোহিত শর্মার ঐতিহাসিক ইনিংস', duration: '2:04', img: heroImg, kicker: 'খেলা', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 450000 },
  { title: 'সৌরশক্তি বিপ্লবে ভারতের বিশ্বরেকর্ড স্থাপন', duration: '1:35', img: oilImg, kicker: 'শক্তি', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 33400 },
  { title: 'সাইবার সুরক্ষায় নতুন দিগন্ত: হ্যাকারদের রুখতে এআই', duration: '2:30', img: cryptoImg, kicker: 'প্রযুক্তি', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 78100 },
  { title: 'জেইই মেইন পরীক্ষায় ত্রিপুরার ছাত্রের শীর্ষ সাফল্য', duration: '1:48', img: wsImg, kicker: 'শিক্ষা', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 162000 },
  { title: 'বলিউডের নতুন ব্লকবাস্টার: রণভূমির বক্স অফিস ঝড়', duration: '1:25', img: techImg, kicker: 'সিনেমা', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 290000 },
  { title: 'পিভি সিন্ধুর বিশ্ব চ্যাম্পিয়নশিপ জয়ের স্বর্ণমুহূর্ত', duration: '2:18', img: tradeImg, kicker: 'খেলা', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 215000 },
  { title: 'উনকোটি মন্দিরের অজানা রহস্য ও স্থাপত্য কলা', duration: '3:05', img: fedImg, kicker: 'ঐতিহ্য', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 185000 },
  { title: 'স্পেসএক্সের স্টারশিপ মহাকাশ মিশনের ঐতিহাসিক মুহূর্ত', duration: '1:58', img: heroImg, kicker: 'বিজ্ঞান', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 310000 },
  { title: 'আগরতলা-আখাউড়া রেলযাত্রার প্রথম দিনের অভিজ্ঞতা', duration: '2:22', img: oilImg, kicker: 'যোগাযোগ', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 142000 },
  { title: 'বিরাট কোহলির আইপিএল ৮০০০ রানের সেরা মুহূর্তগুলি', duration: '2:10', img: cryptoImg, kicker: 'ক্রিকেট', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 520000 },
  { title: 'কৃত্রিম বুদ্ধিমত্তা কীভাবে কর্মক্ষেত্র পরিবর্তন করছে', duration: '1:40', img: wsImg, kicker: 'প্রযুক্তি', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 67000 },
  { title: 'মেট্রো রেলের নতুন সম্প্রসারণ: ২০টি নতুন শহরের তালিকা', duration: '2:05', img: techImg, kicker: 'পরিকাঠামো', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 124000 },
  { title: 'ডিমাপুর বিমানবন্দরের আধুনিক নতুন টার্মিনাল পরিদর্শন', duration: '1:33', img: tradeImg, kicker: 'ভ্রমণ', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 45000 },
  { title: 'অরিজিৎ সিং-এর মনের কথা অ্যালবাম নিয়ে উন্মাদনা', duration: '1:52', img: fedImg, kicker: 'সংগীত', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 890000 },
  { title: 'প্যারিস অলিম্পিকে নীরজ চোপড়ার জ্যাভেলিন ফাইনালে', duration: '2:15', img: heroImg, kicker: 'অলিম্পিক', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 680000 },
  { title: 'মুম্বাইয়ের নতুন আন্তর্জাতিক বিমানবন্দর চালু হল', duration: '2:40', img: oilImg, kicker: 'দেশ', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 195000 },
  { title: 'ত্রিপুরায় রাবার চাষে কৃষকদের অভাবনীয় সাফল্য', duration: '1:45', img: cryptoImg, kicker: 'কৃষি', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 38000 },
  { title: 'আন্তর্জাতিক বাজারে সোনার দাম বাড়ার পেছনের কারণ', duration: '1:30', img: wsImg, kicker: 'বাজার', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 156000 },
  { title: 'বৈদ্যুতিক যানবাহনের সুবিধা ও চার্জিং স্টেশন নেটওয়ার্ক', duration: '2:25', img: techImg, kicker: 'অটো', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 87000 },
  { title: 'উচ্চশিক্ষায় ছাত্রীদের বিশেষ স্কলারশিপের আবেদন প্রক্রিয়া', duration: '1:50', img: tradeImg, kicker: 'শিক্ষা', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 104000 },
  { title: 'অনলাইন সাইবার স্ক্যাম থেকে পরিবারকে সুরক্ষিত রাখুন', duration: '2:14', img: fedImg, kicker: 'নিরাপত্তা', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 220000 },
  { title: 'মেঘালয়ের জীবন্ত শিকড়ের সেতু: প্রকৃতির অনন্য সৃষ্টি', duration: '2:50', img: heroImg, kicker: 'প্রকৃতি', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 340000 },
  { title: 'সুনীল ছেত্রির বিদায়ি আন্তর্জাতিক ম্যাচের স্মরণীয় মুহূর্ত', duration: '2:05', img: oilImg, kicker: 'ফুটবল', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 410000 },
  { title: 'আগরতলার ঐতিহ্যবাহী লোক উৎসব ও সংস্কৃতি', duration: '1:40', img: cryptoImg, kicker: 'সংস্কৃতি', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 59000 },
  { title: 'জলবায়ু পরিবর্তন প্রতিরোধে দেড়শো দেশের চুক্তি', duration: '2:12', img: wsImg, kicker: 'পরিবেশ', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 76000 },
  { title: 'সোশ্যাল মিডিয়ায় ট্রেন্ডিং ভিডিও বানানোর ৫টি নিয়ম', duration: '1:28', img: techImg, kicker: 'সোশ্যাল', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 180000 },
  { title: 'নতুন কেন্দ্রীয় বাজেটের মূল সুবিধাগুলি এক নজরে', duration: '2:35', img: tradeImg, kicker: 'অর্থনীতি', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 98000 },
  { title: 'আইআইটি দিল্লির নতুন মহাকাশ গবেষণা ল্যাব', duration: '1:55', img: fedImg, kicker: 'বিজ্ঞান', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 64000 },
  { title: 'শিলং ও চেরাপুঞ্জির মনোমুগ্ধকর জলপ্রপাত', duration: '1:44', img: heroImg, kicker: 'ভ্রমণ', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 275000 },
  { title: 'জাপানের বুলেট ট্রেনের অত্যাধুনিক নিরাপত্তা ব্যবস্থা', duration: '2:02', img: oilImg, kicker: 'প্রযুক্তি', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 130000 },
  { title: 'আন্তর্জাতিক ওটিটি প্ল্যাটফর্মে বাংলা সিনেমার জয়জয়কার', duration: '2:20', img: cryptoImg, kicker: 'বিনোদন', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 310000 },
  { title: 'দাবায় বিশ্ব জয়: আর প্রজ্ঞানন্দের সেরা জয়ের চাল', duration: '2:45', img: wsImg, kicker: 'দাবা', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 240000 },
  { title: 'সাবরুম স্থল বন্দর দিয়ে ভারত-বাংলাদেশ নতুন বাণিজ্য', duration: '1:50', img: techImg, kicker: 'বাণিজ্য', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 89000 },
  { title: 'অনলাইন ব্যাংক ফ্রড থেকে বাঁচার জরুরি উপায়', duration: '1:35', img: tradeImg, kicker: 'সচেতনতা', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 165000 },
  { title: 'ইসরোর গগনযান মিশনে মহাকাশচারীদের প্রশিক্ষণ', duration: '2:30', img: fedImg, kicker: 'ইসরো', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 420000 },
  { title: 'উত্তর-পূর্বের চা বাগানের প্রাকৃতিক সৌন্দর্য ও গল্প', duration: '2:15', img: heroImg, kicker: 'জীবনযাত্রা', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 115000 },
  { title: 'মোবাইলের চার্জ সারাদিন ধরে রাখার সহজ ৫টি সেটিংস', duration: '1:20', img: oilImg, kicker: 'গ্যাজেট', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 510000 },
  { title: 'প্রো কবাডি লিগের জমজমাট ফাইনাল ম্যাচ হাইলাইটস', duration: '2:08', img: cryptoImg, kicker: 'কবাডি', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 175000 },
  { title: 'ত্রিপুরায় তৈরি নতুন তথ্যপ্রযুক্তি পার্কের পরিকল্পনা', duration: '2:00', img: wsImg, kicker: 'আইটি', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 62000 },
  { title: 'বিশ্বের বৃহত্তম সৌর পার্কের বিস্ময়কর দৃশ্য', duration: '1:48', img: techImg, kicker: 'সবুজশক্তি', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 92000 },
  { title: 'শাহরুখ খানের নতুন সিনেমা ব্লাড ফ্যামিলির প্রথম লুক', duration: '1:32', img: tradeImg, kicker: 'বিনোদন', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 740000 },
  { title: 'বিশ্বকাপ হকিতে ভারতের শ্বাসরুদ্ধকর কোয়ার্টার ফাইনাল জয়', duration: '2:25', img: fedImg, kicker: 'হকি', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 290000 },
  { title: 'ত্রিপুরার ঐতিহ্যবাহী কর কর পুজোর অপূর্ব নৃত্য', duration: '2:40', img: heroImg, kicker: 'উৎসব', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 128000 },
  { title: 'প্রতিদিনের ব্যায়াম ও সুস্বাস্থ্যের প্রয়োজনীয় নিয়ম', duration: '1:50', img: oilImg, kicker: 'স্বাস্থ্য', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 145000 },
  { title: 'কৃষিতে ড্রোনের ব্যবহার: ফসলের ফলন দ্বিগুণ করার কৌশল', duration: '2:14', img: cryptoImg, kicker: 'কৃষি', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 83000 },
  { title: 'কান চলচ্চিত্র উৎসবে ভারতীয় সিনেমার ঐতিহাসিক পুরস্কার', duration: '1:45', img: wsImg, kicker: 'সিনেমা', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 390000 },
  { title: 'স্মার্ট ক্যারিয়ার নির্বাচন: ভবিষ্যতের সবচেয়ে চাহিদাসম্পন্ন ক্ষেত্র', duration: '2:10', img: techImg, kicker: 'ক্যারিয়ার', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 110000 },
  { title: 'নাগাল্যান্ডের ঐতিহ্যবাহী হর্নবিল উৎসবের সাংস্কৃতিক মেলা', duration: '2:55', img: tradeImg, kicker: 'সংস্কৃতি', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 205000 },
  { title: 'ইউপিআই ও মোবাইল পেমেন্ট ব্যবহারের নিরাপত্তা নির্দেশিকা', duration: '1:38', img: fedImg, kicker: 'সচেতনতা', embedSrc: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1', views: 185000 }
];

export function getAllReels(): WatchItem[] {
  try {
    const cfg = loadReelsConfig();
    const customItems: WatchItem[] = [];
    if (cfg && cfg.enabled && Array.isArray(cfg.urls)) {
      cfg.urls.forEach((url, i) => {
        const embed = toEmbedSrc(cfg.provider, url);
        if (embed) {
          customItems.push({
            title: 'Featured Reel #' + (i + 1),
            duration: '1:00',
            img: stockImages[i % stockImages.length],
            kicker: 'Featured',
            embedSrc: embed,
            views: 50000 + (i * 1234)
          });
        }
      });
    }
    return [...customItems, ...baseWatchItems];
  } catch {
    return baseWatchItems;
  }
}
