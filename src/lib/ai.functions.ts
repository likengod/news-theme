import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "./auth-middleware";
import { getSiteSettingsServer } from "./site-content";

export const generateSectionHtmlServer = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((d: { instructions: string; currentHeading: string; currentBody: string }) => d)
  .handler(async ({ data }) => {
    const settings = await getSiteSettingsServer();
    
    const prompt = `You are an expert web content assistant. Generate HTML content for a webpage section based on the user's instructions.
Only return raw HTML (without markdown formatting blocks like \`\`\`html).
Do not include <html>, <body>, or <head> tags. Just the raw HTML for a section. Use standard tags like <p>, <ul>, <li>, <strong>, etc.
Avoid adding arbitrary classes unless necessary (like "list-disc pl-5" for ul).

Current Section Heading: ${data.currentHeading || 'None'}
Current Content: ${data.currentBody || 'None'}

User Instructions: ${data.instructions}

Updated HTML Content:`;

    let errorContext = "";

    // 1. Try Gemini
    if (settings.geminiApiKey) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${settings.geminiApiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7 }
          })
        });
        if (res.ok) {
          const json = await res.json();
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
          return text.replace(/```html|```/g, "").trim();
        } else {
          errorContext += `Gemini failed: ${res.statusText}. `;
        }
      } catch (e: any) {
        errorContext += `Gemini error: ${e.message}. `;
      }
    }
    
    // 2. Try OpenAI
    if (settings.openAiApiKey) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${settings.openAiApiKey}` },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7
          })
        });
        if (res.ok) {
          const json = await res.json();
          const text = json.choices?.[0]?.message?.content || "";
          return text.replace(/```html|```/g, "").trim();
        } else {
          errorContext += `OpenAI failed: ${res.statusText}. `;
        }
      } catch (e: any) {
        errorContext += `OpenAI error: ${e.message}. `;
      }
    }

    // 3. Try DeepSeek
    if (settings.deepseekApiKey) {
      try {
        const res = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${settings.deepseekApiKey}` },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7
          })
        });
        if (res.ok) {
          const json = await res.json();
          const text = json.choices?.[0]?.message?.content || "";
          return text.replace(/```html|```/g, "").trim();
        } else {
          errorContext += `DeepSeek failed: ${res.statusText}. `;
        }
      } catch (e: any) {
        errorContext += `DeepSeek error: ${e.message}. `;
      }
    }



    if (!settings.geminiApiKey && !settings.openAiApiKey && !settings.deepseekApiKey && !settings.kimiApiKey) {
      throw new Error("No AI API Keys configured. Please go to Settings -> Integrations to set one up.");
    }

    throw new Error(`AI Generation failed. ${errorContext}`);
  });

export const generateArticleContentServer = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((d: { instructions: string; style: string; availableTags: string[] }) => d)
  .handler(async ({ data }) => {
    const settings = await getSiteSettingsServer();
    
    const prompt = `You are an expert journalist and web content assistant. Generate a complete news article based on the provided instructions.
CRITICAL RULE: You must strictly follow the "5 Ws and H" rule. Ensure the lead paragraph clearly answers: Who, What, Where, When, Why, and How.
Writing Style: ${data.style}

Instructions/Details:
${data.instructions}

Available Tags to choose from: ${data.availableTags.join(', ')}

Output exactly and ONLY a JSON object (without markdown \`\`\`json blocks) with the following schema:
{
  "body": "The full article content in semantic HTML format. Use standard tags like <p>, <h2>, <ul>. Do not include <html> or <body>.",
  "excerpt": "A short, compelling summary (max 200 characters).",
  "location": {
    "city": "City extracted from context or blank",
    "state": "State extracted or blank",
    "country": "Country extracted or blank"
  },
  "metaTitle": "SEO friendly meta title (max 60 chars)",
  "metaDescription": "SEO friendly meta description (max 160 chars)",
  "tags": ["tag1", "tag2"]
}`;

    let errorContext = "";

    const cleanJsonResponse = (text: string) => {
      let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      try {
        return JSON.parse(cleaned);
      } catch (err) {
        throw new Error("AI returned invalid JSON.");
      }
    };

    // 1. Try Gemini
    if (settings.geminiApiKey) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${settings.geminiApiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, responseMimeType: "application/json" }
          })
        });
        if (res.ok) {
          const json = await res.json();
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
          return cleanJsonResponse(text);
        } else {
          errorContext += `Gemini failed: ${res.statusText}. `;
        }
      } catch (e: any) {
        errorContext += `Gemini error: ${e.message}. `;
      }
    }
    
    // 2. Try OpenAI
    if (settings.openAiApiKey) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${settings.openAiApiKey}` },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            response_format: { type: "json_object" }
          })
        });
        if (res.ok) {
          const json = await res.json();
          const text = json.choices?.[0]?.message?.content || "";
          return cleanJsonResponse(text);
        } else {
          errorContext += `OpenAI failed: ${res.statusText}. `;
        }
      } catch (e: any) {
        errorContext += `OpenAI error: ${e.message}. `;
      }
    }

    // 3. Try DeepSeek
    if (settings.deepseekApiKey) {
      try {
        const res = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${settings.deepseekApiKey}` },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            response_format: { type: "json_object" }
          })
        });
        if (res.ok) {
          const json = await res.json();
          const text = json.choices?.[0]?.message?.content || "";
          return cleanJsonResponse(text);
        } else {
          errorContext += `DeepSeek failed: ${res.statusText}. `;
        }
      } catch (e: any) {
        errorContext += `DeepSeek error: ${e.message}. `;
      }
    }



    if (!settings.geminiApiKey && !settings.openAiApiKey && !settings.deepseekApiKey && !settings.kimiApiKey) {
      throw new Error("No AI API Keys configured. Please go to Settings -> Integrations to set one up.");
    }

    throw new Error(`AI Generation failed. ${errorContext}`);
  });
