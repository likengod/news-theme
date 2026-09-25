import { r as createServerFn } from "./esm-B50dUWcE.js";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.js";
//#region src/lib/verify-image.functions.ts?tss-serverfn-split
var fetchRemoteImageForVerification_createServerFn_handler = createServerRpc({
	id: "2c151724b9e12bfe1f5632766d7139f5833bcb85e798dee1a9c1a6e64280f110",
	name: "fetchRemoteImageForVerification",
	filename: "src/lib/verify-image.functions.ts"
}, (opts) => fetchRemoteImageForVerification.__executeServer(opts));
var fetchRemoteImageForVerification = createServerFn({ method: "POST" }).validator((d) => {
	if (!d || typeof d !== "object" || !("imageUrl" in d)) throw new Error("Missing imageUrl");
	const { imageUrl } = d;
	if (typeof imageUrl !== "string" || !imageUrl.trim()) throw new Error("Invalid imageUrl string");
	return { imageUrl: imageUrl.trim() };
}).handler(fetchRemoteImageForVerification_createServerFn_handler, async ({ data: { imageUrl } }) => {
	let targetUrl = imageUrl;
	if (targetUrl.startsWith("/")) targetUrl = `http://localhost:${process.env.PORT || "3099"}${targetUrl}`;
	try {
		const parsed = new URL(targetUrl);
		if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("URL must use HTTP or HTTPS protocol.");
	} catch (e) {
		throw new Error("Invalid URL format: " + (e.message || ""));
	}
	const response = await fetch(targetUrl, { headers: {
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
		Accept: "image/*,*/*;q=0.8"
	} });
	if (!response.ok) throw new Error(`Failed to download image (HTTP ${response.status}: ${response.statusText})`);
	const contentType = response.headers.get("content-type") || "image/jpeg";
	if (!contentType.startsWith("image/") && !contentType.includes("octet-stream")) throw new Error(`The provided URL did not return an image (Content-Type: ${contentType})`);
	const arrayBuffer = await response.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	if (buffer.length === 0) throw new Error("The retrieved image is empty (0 bytes).");
	const base64 = buffer.toString("base64");
	const mime = contentType.split(";")[0].trim();
	const dataUrl = `data:${mime};base64,${base64}`;
	let fileName = "remote-image";
	try {
		const segments = new URL(targetUrl).pathname.split("/").filter(Boolean);
		if (segments.length > 0) fileName = decodeURIComponent(segments[segments.length - 1]);
	} catch {}
	return {
		success: true,
		dataUrl,
		fileName,
		fileSize: buffer.length,
		mime
	};
});
//#endregion
export { fetchRemoteImageForVerification_createServerFn_handler };
