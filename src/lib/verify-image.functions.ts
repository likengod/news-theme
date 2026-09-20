import { createServerFn } from "@tanstack/react-start";

export const fetchRemoteImageForVerification = createServerFn({ method: "POST" })
  .validator((d: unknown): { imageUrl: string } => {
    if (!d || typeof d !== "object" || !("imageUrl" in d)) {
      throw new Error("Missing imageUrl");
    }
    const { imageUrl } = d as { imageUrl: string };
    if (typeof imageUrl !== "string" || !imageUrl.trim()) {
      throw new Error("Invalid imageUrl string");
    }
    return { imageUrl: imageUrl.trim() };
  })
  .handler(async ({ data: { imageUrl } }) => {
    let targetUrl = imageUrl;

    // Handle relative URLs like /uploads/...
    if (targetUrl.startsWith("/")) {
      const port = process.env.PORT || "3099";
      targetUrl = `http://localhost:${port}${targetUrl}`;
    }

    try {
      const parsed = new URL(targetUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("URL must use HTTP or HTTPS protocol.");
      }
    } catch (e: any) {
      throw new Error("Invalid URL format: " + (e.message || ""));
    }

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "image/*,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download image (HTTP ${response.status}: ${response.statusText})`);
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/") && !contentType.includes("octet-stream")) {
      throw new Error(`The provided URL did not return an image (Content-Type: ${contentType})`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      throw new Error("The retrieved image is empty (0 bytes).");
    }

    const base64 = buffer.toString("base64");
    const mime = contentType.split(";")[0].trim();
    const dataUrl = `data:${mime};base64,${base64}`;

    // Extract filename from URL pathname if available
    let fileName = "remote-image";
    try {
      const parsed = new URL(targetUrl);
      const segments = parsed.pathname.split("/").filter(Boolean);
      if (segments.length > 0) {
        fileName = decodeURIComponent(segments[segments.length - 1]);
      }
    } catch {
      // keep fallback
    }

    return {
      success: true,
      dataUrl,
      fileName,
      fileSize: buffer.length,
      mime,
    };
  });
