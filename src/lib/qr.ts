import QRCode from "qrcode";

export async function generateQrDataUrl(text: string): Promise<string> {
  if (!text) return "";
  try {
    return await QRCode.toDataURL(text, {
      width: 320,
      margin: 2,
      color: {
        dark: "#0f172a", // slate-900
        light: "#ffffff",
      },
    });
  } catch (err) {
    console.error("[QR] Failed to generate QR code data URL:", err);
    return "";
  }
}
