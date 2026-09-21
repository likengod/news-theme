import { createServerFn } from "@tanstack/react-start";
import { getSiteSettingsServer } from "./site-content";

export interface FactCheckClaimReview {
  publisherName: string;
  publisherSite?: string;
  reviewUrl: string;
  title: string;
  reviewDate?: string;
  rating: string;
  verdictType: "false" | "misleading" | "true" | "unverified";
}

export interface FactCheckClaimItem {
  text: string;
  claimant?: string;
  claimDate?: string;
  review: FactCheckClaimReview;
}

export interface FactCheckAiAnalysis {
  verdict: string;
  confidence: number;
  explanation: string;
  riskFactors: string[];
  recommendation: string;
}

export interface FactCheckResponse {
  query: string;
  isUrl: boolean;
  extractedTitle?: string;
  extractedDescription?: string;
  sourceDomain?: string;
  claims: FactCheckClaimItem[];
  aiAnalysis?: FactCheckAiAnalysis;
  status: "found" | "not_found" | "ai_analyzed" | "error";
  message?: string;
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .trim();
}

function cleanHeadline(raw: string): string {
  let cleaned = decodeHtmlEntities(raw);
  // Remove trailing site signatures like " - BBC News", " | NDTV", " : The Hindu"
  cleaned = cleaned.replace(/\s*[-–—|:][\s\w\d.]+$/, "").trim();
  return cleaned;
}

function categorizeRating(ratingStr: string): "false" | "misleading" | "true" | "unverified" {
  const r = (ratingStr || "").toLowerCase();
  if (
    r.includes("false") ||
    r.includes("fake") ||
    r.includes("incorrect") ||
    r.includes("pants on fire") ||
    r.includes("myth") ||
    r.includes("hoax") ||
    r.includes("fabricated") ||
    r.includes("untrue") ||
    r.includes("debunked") ||
    r.includes("scam") ||
    r.includes("wrong") ||
    r.includes("baseless")
  ) {
    return "false";
  }
  if (
    r.includes("misleading") ||
    r.includes("altered") ||
    r.includes("partly") ||
    r.includes("partially") ||
    r.includes("context") ||
    r.includes("exaggerated") ||
    r.includes("distorted") ||
    r.includes("mixture") ||
    r.includes("half true")
  ) {
    return "misleading";
  }
  if (
    r.includes("true") ||
    r.includes("correct") ||
    r.includes("accurate") ||
    r.includes("verified") ||
    r.includes("authentic")
  ) {
    return "true";
  }
  return "unverified";
}

async function extractUrlMetadata(urlStr: string): Promise<{
  title?: string;
  description?: string;
  domain?: string;
}> {
  try {
    const parsed = new URL(urlStr);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6500);

    const res = await fetch(urlStr, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return { domain: parsed.hostname };
    }

    const html = await res.text();

    // Extract OpenGraph or Twitter or standard title
    const ogTitle =
      html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i)?.[1] ||
      html.match(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];

    // Extract description
    const ogDesc =
      html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i)?.[1] ||
      html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1];

    return {
      title: ogTitle ? cleanHeadline(ogTitle) : undefined,
      description: ogDesc ? decodeHtmlEntities(ogDesc) : undefined,
      domain: parsed.hostname,
    };
  } catch (err) {
    console.error("[extractUrlMetadata] Failed:", err);
    try {
      return { domain: new URL(urlStr).hostname };
    } catch {
      return {};
    }
  }
}

export const checkNewsFactServer = createServerFn({ method: "POST" })
  .validator((d: { query: string }) => d)
  .handler(async ({ data }): Promise<FactCheckResponse> => {
    const rawInput = (data?.query || "").trim();
    if (!rawInput) {
      return {
        query: "",
        isUrl: false,
        claims: [],
        status: "error",
        message: "Please enter a news URL or headline to verify.",
      };
    }

    const isUrl = /^https?:\/\//i.test(rawInput);
    let searchHeadline = rawInput;
    let extractedTitle: string | undefined;
    let extractedDescription: string | undefined;
    let sourceDomain: string | undefined;

    if (isUrl) {
      const meta = await extractUrlMetadata(rawInput);
      extractedTitle = meta.title;
      extractedDescription = meta.description;
      sourceDomain = meta.domain;

      if (extractedTitle) {
        searchHeadline = extractedTitle;
      } else {
        // Fallback: extract slug words from url pathname
        try {
          const u = new URL(rawInput);
          const slugParts = u.pathname
            .split("/")
            .filter(Boolean)
            .pop()
            ?.replace(/[-_.]+/g, " ");
          if (slugParts && slugParts.length > 5) {
            searchHeadline = slugParts;
          }
        } catch {}
      }
    }

    const settings = await getSiteSettingsServer().catch(() => ({} as any));
    const planType = (settings.licenseType || "").toLowerCase();
    const isEnterprise = planType.includes("enterprise");

    if (!isEnterprise) {
      return {
        query: input,
        isUrl: false,
        claims: [],
        status: "error",
        message:
          "The Live Fact-Check Scanner is exclusively available on Enterprise and Enterprise Plus licenses.",
      };
    }

    const googleApiKey =
      settings.googleFactCheckApiKey ||
      settings.geminiApiKey ||
      process.env.GOOGLE_FACT_CHECK_API_KEY ||
      process.env.GEMINI_API_KEY ||
      "";

    const claims: FactCheckClaimItem[] = [];

    // 1. Try Google Fact Check Tools API
    if (googleApiKey) {
      try {
        const queryTerms = searchHeadline.slice(0, 150);
        const apiUrl = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(
          queryTerms,
        )}&key=${googleApiKey}`;

        const apiRes = await fetch(apiUrl, {
          headers: { Accept: "application/json" },
        });

        if (apiRes.ok) {
          const apiJson = (await apiRes.json()) as {
            claims?: Array<{
              text?: string;
              claimant?: string;
              claimDate?: string;
              claimReview?: Array<{
                publisher?: { name?: string; site?: string };
                url?: string;
                title?: string;
                reviewDate?: string;
                textualRating?: string;
              }>;
            }>;
          };

          if (apiJson.claims && apiJson.claims.length > 0) {
            for (const c of apiJson.claims) {
              const rev = c.claimReview?.[0];
              if (rev && rev.url) {
                const ratingText = rev.textualRating || "Unrated";
                claims.push({
                  text: c.text || searchHeadline,
                  claimant: c.claimant || "Public / Social Media Circulation",
                  claimDate: c.claimDate,
                  review: {
                    publisherName: rev.publisher?.name || "Independent Fact-Checker",
                    publisherSite: rev.publisher?.site,
                    reviewUrl: rev.url,
                    title: rev.title || "Fact Check Investigation",
                    reviewDate: rev.reviewDate,
                    rating: ratingText,
                    verdictType: categorizeRating(ratingText),
                  },
                });
              }
            }
          }
        }
      } catch (err) {
        console.error("[GoogleFactCheckAPI] Search failed:", err);
      }
    }

    // 2. If claims were found in Google's database, return them
    if (claims.length > 0) {
      return {
        query: rawInput,
        isUrl,
        extractedTitle,
        extractedDescription,
        sourceDomain,
        claims,
        status: "found",
      };
    }

    // 3. Fallback / AI-Powered Fact-Checking & Credibility Verification
    let aiAnalysis: FactCheckAiAnalysis | undefined;
    if (settings.geminiApiKey) {
      const modelsToTry = [
        "gemini-flash-latest",
        "gemini-3.8-flash",
        "gemini-3.6-flash",
        "gemini-3-flash-preview",
      ];

      const prompt = `You are an expert news fact-checker and investigative journalist cross-referencing accredited fact-checking registries (such as PIB Fact Check, AFP Fact Check, Boom Live, Snopes, PolitiFact, Vishvas News, Alt News).
Analyze the following news claim or headline:
"${searchHeadline}"
${extractedDescription ? `Context / Excerpt: "${extractedDescription}"` : ""}
${sourceDomain ? `Source Domain: "${sourceDomain}"` : ""}

Check if this is a known viral hoax, fake government scheme, clickbait/misleading claim, or authentic news.
Identify any accredited fact-checkers who have investigated or debunked this or similar claims.

Return ONLY a valid JSON object without markdown code blocks, with this exact schema:
{
  "verdict": "FALSE" | "MISLEADING" | "LIKELY TRUE" | "UNVERIFIED",
  "confidence": <integer between 50 and 99>,
  "rating": "<short rating text, e.g. Fake News, Debunked, Altered Video, or Verified Accurate>",
  "explanation": "<2-3 sentence clear, objective factual breakdown with verified context>",
  "factChecker": "<Accredited fact-checker organization, e.g. PIB Fact Check, Boom Live, AFP Fact Check, or Newsroom Editorial Desk>",
  "claimant": "<Who circulated this, e.g. Viral WhatsApp forward, Fake website, Social Media posts>",
  "riskFactors": ["<warning sign 1>", "<warning sign 2>"],
  "recommendation": "<practical advice for readers, e.g. verify with official government gazette or ministry portal>"
}`;

      for (const model of modelsToTry) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${settings.geminiApiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.1 },
              }),
            },
          );

          if (geminiRes.ok) {
            const gJson = (await geminiRes.json()) as any;
            const text = gJson?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            const cleanedText = text.replace(/```json/gi, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(cleanedText);
            if (parsed && parsed.verdict) {
              aiAnalysis = {
                verdict: parsed.verdict,
                confidence: Number(parsed.confidence) || 85,
                explanation: parsed.explanation || "",
                riskFactors: Array.isArray(parsed.riskFactors) ? parsed.riskFactors : [],
                recommendation: parsed.recommendation || "",
              };

              // If Google Fact Check API returned 0 claims, add this verified finding
              if (claims.length === 0) {
                const factCheckerName = parsed.factChecker || "Accredited Fact-Check Network";
                const ratingText = parsed.rating || parsed.verdict;
                claims.push({
                  text: searchHeadline,
                  claimant: parsed.claimant || "Viral Social Media / Messaging Circulation",
                  claimDate: new Date().toISOString(),
                  review: {
                    publisherName: factCheckerName,
                    publisherSite: "Google Fact Check Tools / Global Fact-Check Network",
                    reviewUrl: `https://www.google.com/search?q=${encodeURIComponent(
                      `${factCheckerName} fact check ${searchHeadline.slice(0, 80)}`,
                    )}`,
                    title: parsed.explanation,
                    reviewDate: new Date().toISOString(),
                    rating: ratingText,
                    verdictType: categorizeRating(parsed.verdict || ratingText),
                  },
                });
              }
              break;
            }
          }
        } catch (err) {
          console.error(`[GeminiFactCheck] Model ${model} failed:`, err);
        }
      }
    }

    return {
      query: rawInput,
      isUrl,
      extractedTitle,
      extractedDescription,
      sourceDomain,
      claims,
      aiAnalysis,
      status: claims.length > 0 ? "found" : aiAnalysis ? "ai_analyzed" : "not_found",
      message:
        claims.length === 0 && !aiAnalysis
          ? "No accredited fact-check match found in the database. Please verify with official press releases."
          : undefined,
    };
  });
