import { top, lead, grid } from "./news-data";

export type Item = { kicker?: string; title: string; excerpt?: string; img?: string; date?: string; play?: boolean; by?: string; slug?: string; };

export const leftItems: Item[] = [
  { kicker: "Health", title: "Why postpartum depression went untreated for thousands of years", excerpt: "Ei mei scripta intellegat. Verear voluptaria eam at, consul putent eu vel. Pro saepe maluisset ne, audire maiorum forensibus eos." },
  { kicker: "Food", title: "Extra $2.50 for half a prawn? Diner unhappy about $8.50 laksa", excerpt: "Justo fabulas singulis at pri, saepe luptatum mei an. Duo idque solet scribentur eu, natum iudico labore te eos, no." },
  { kicker: "Tech", title: "Did You Know You Can Unsend and Edit Text Messages on Your iPhone", excerpt: "Usu tantas omittantur ut, per te modo appetere senserit. Ei ius aperiam tincidunt, ea sit natum iisque repudiandae.", img: top[2].img },
  { kicker: "Politics", title: "EU governments present bill to reserve 3rd of parliament seats", excerpt: "Duo dolorum mandamus mnesarchum te. Sit ridens persius ex. Vel noluisse perpetua consequat ex, has nostro antiopam eu." },
  { kicker: "Climate", title: "Record heatwave pushes power grids to the brink across southern Europe", excerpt: "Operators in Spain, Italy and Greece warned of rolling blackouts as demand from cooling systems hit all-time highs this week." },
];

export const bottomItems: Item[] = [
  {
    kicker: "Markets",
    title: "Wall Street closes higher as Federal Reserve signals patience on rate cuts and traders bet on a softer landing for the US economy heading into year-end",
    excerpt: "The S&P 500 and Nasdaq notched fresh records after Chair Powell told lawmakers the central bank can afford to wait before easing policy further. Treasury yields slipped across the curve as traders dialed back bets on an imminent cut, while the dollar weakened against a basket of major peers. Bank stocks led the advance, with regional lenders rallying on hopes that a steeper yield curve will revive net interest margins into the new year as deposit costs finally begin to ease.",
  },
  {
    kicker: "Business",
    title: "Boeing wins record $14 billion order as Gulf carrier expands long-haul fleet across Asia and Europe",
    excerpt: "The deal — covering 40 widebody jets with options for 20 more — marks the planemaker's largest single order of the year and lifts its backlog past 5,500 aircraft. Executives said the agreement underscores resurgent long-haul demand out of the Gulf as carriers race to add capacity on routes to Asia, Africa and the Americas. Deliveries are expected to begin in late 2027 and stretch into the following decade, giving Boeing's South Carolina widebody line a multi-year runway just as it stabilizes production after a turbulent stretch on the 787 and 777X programs.",
  },
  {
    kicker: "Tech",
    title: "Nvidia briefly tops $4 trillion as AI chip demand shows no sign of cooling",
    excerpt: "Shares climbed 2.6% in early trading, pushing the chipmaker past Apple and Microsoft to become the most valuable listed company in the world.",
  },
  {
    kicker: "Crypto",
    title: "Bitcoin breaks $112,000 as spot ETFs log record weekly inflows",
    excerpt: "More than $3.2 billion flowed into US-listed spot bitcoin funds last week, with BlackRock's IBIT alone accounting for nearly half of the total.",
  },
  {
    kicker: "Markets",
    title: "Oil slips below $78 as OPEC+ signals gradual supply return",
    excerpt: "Brent crude eased after the producer group confirmed it will unwind voluntary cuts in monthly tranches through the second half of the year.",
  },
  {
    kicker: "Business",
    title: "Tesla unveils next-gen robotaxi platform with sub-$25K price tag",
    excerpt: "Elon Musk said production will begin in Texas next year, with the company targeting one million autonomous units annually by 2028.",
  },
];

export const popularItems = [
  { title: "Europe must forge a new role in the global economy", by: "Claire", img: lead.img },
  { title: "Why postpartum depression went untreated for thousands of years", by: "Claire", img: top[1].img },
  { title: "Global economic growth forecasts slashed", by: "Claire", img: grid[2].img },
  { title: "Extra $2.50 for half a prawn? Diner unhappy about $8.50 laksa", by: "Lucas", img: grid[1].img },
];

export const opinionItems = [
  { title: "A state campsite reservation bill heads for the governor's desk", by: "Claire", img: grid[0].img, slug: "sample" },
  { title: "Did You Know You Can Unsend and Edit Text Messages on Your iPhone", by: "Lucas", img: top[2].img, slug: "sample" },
  { title: "Who is Andrew Yang, the Internet's Favorite Candidate? | 2020 Presidential Candidate", by: "Neil", img: top[0].img, slug: "sample" },
  { title: "Artist / Teacher in Classical Voice job with us", by: "Claire", img: grid[1].img, slug: "sample" },
  { title: "Fed minutes hint at slower pace of rate cuts through summer", by: "Maya", img: grid[2].img, slug: "sample" },
  { title: "Inside the boardroom battle reshaping Europe's largest carmaker", by: "Daniel", img: top[1].img, slug: "sample" },
];

export const cultureItems = [
  { title: "Bob Dylan: Icon of 20th Century Music", excerpt: "Duo dolorum mandamus mnesarchum te. Sit ridens persius ex. Vel noluisse perpetua consequat ex, has nostro antiopam eu. Nec esse meis eu.", date: "Jul 21, 2019", kicker: "Music", img: top[0].img, play: true, slug: "sample" },
  { title: "Bob Dylan: The Best Collection of 1963", excerpt: "Labore nonumes te vel, vis id errem tantas tempor. Solet quidam salutatus at quo. Tantas comprehensam te sea, usu sanctus similique ei.", date: "Jan 20, 2018", kicker: "Music", img: top[1].img, slug: "sample" },
  { title: "Top 20 Female CEOs In Tech Corporates", excerpt: "Duo dolorum mandamus mnesarchum te. Sit ridens persius ex. Vel noluisse perpetua consequat ex, has nostro antiopam eu.", date: "Apr 23, 2017", kicker: "Business", img: grid[0].img, slug: "sample" },
  { title: "Everything about Bitcoin explained in this article", excerpt: "Quo natum nemore putant in, his te case habemus. Nulla detraxit explicari in vim. Id eam magna omnesque.", date: "Nov 11, 2015", kicker: "Crypto", img: grid[2].img, slug: "sample" },
];
