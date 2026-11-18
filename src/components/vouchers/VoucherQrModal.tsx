import React, { useEffect, useState } from "react";
import {
  X,
  Copy,
  Check,
  Download,
  QrCode,
  ShieldCheck,
  Calendar,
  Store,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { generateQrDataUrl } from "@/lib/qr";

interface VoucherQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucherTitle: string;
  code: string;
  expiresAt?: string;
  claimedAt?: string;
  description?: string;
  tag?: string;
  status?: "active" | "used_in_store" | "expired";
  usedAt?: string;
  usedByStoreName?: string;
}

export function VoucherQrModal({
  isOpen,
  onClose,
  voucherTitle,
  code,
  expiresAt,
  claimedAt,
  description,
  tag = "Reward Voucher",
  status = "active",
  usedAt,
  usedByStoreName,
}: VoucherQrModalProps) {
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>("");

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const verifyLink = `${origin}/claim-offer?code=${encodeURIComponent(code)}`;

  useEffect(() => {
    if (code) {
      generateQrDataUrl(verifyLink).then((url) => {
        setQrUrl(url);
      });
    }
  }, [code, verifyLink]);

  if (!isOpen || !code) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Promo code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `voucher-${code}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("QR Code downloaded!");
  };

  const isUsed = status === "used_in_store";
  const isExpired = expiresAt && new Date() > new Date(expiresAt);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm sm:max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-rose-500" />
            <h3 className="text-sm font-bold text-slate-900">Voucher & QR Pass</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-center">
          {/* Tag & Status */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
              {tag}
            </span>
            {isUsed ? (
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Redeemed in Store
              </span>
            ) : isExpired ? (
              <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Expired
              </span>
            ) : (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Ready to Redeem
              </span>
            )}
          </div>

          <h2 className="text-lg font-bold text-slate-900 leading-snug">{voucherTitle}</h2>

          {description && (
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              {description}
            </p>
          )}

          {/* QR Code Container */}
          <div className="mx-auto flex flex-col items-center justify-center p-4 bg-white rounded-2xl border-2 border-dashed border-slate-200 shadow-xs max-w-[240px]">
            {qrUrl ? (
              <img
                src={qrUrl}
                alt={`QR code for ${code}`}
                className="w-48 h-48 object-contain rounded-lg"
              />
            ) : (
              <div className="w-48 h-48 grid place-items-center bg-slate-50 rounded-lg text-slate-400 text-xs">
                Generating QR...
              </div>
            )}
            <p className="mt-2 text-[10px] text-slate-400 font-medium">
              Scan with phone camera to verify
            </p>
          </div>

          {/* Promo Code Box */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3.5 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
              Unique Promo Code
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-xl font-black text-rose-950 tracking-wider">
                {code}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                title="Copy Code"
                className="rounded-lg bg-rose-600 p-2 text-white hover:bg-rose-700 transition shadow-xs"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Expiration and Usage info */}
          <div className="text-xs text-slate-500 space-y-1 pt-1">
            {expiresAt && (
              <p className="flex items-center justify-center gap-1.5 text-slate-600 font-medium">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                Valid until:{" "}
                <span className="font-bold text-slate-800">
                  {new Date(expiresAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </p>
            )}

            {isUsed && usedAt && (
              <p className="flex items-center justify-center gap-1.5 text-blue-700 font-semibold text-[11px]">
                <Store className="h-3.5 w-3.5 text-blue-500" />
                Claimed at {usedByStoreName || "Store"} on {new Date(usedAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleDownloadQr}
              disabled={!qrUrl}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition w-full"
            >
              <Download className="h-4 w-4 text-slate-500" />
              Download QR
            </button>

            <a
              href={verifyLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition w-full"
            >
              <ExternalLink className="h-4 w-4" />
              Verify Link
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default VoucherQrModal;
