import { RefObject } from "react";
import { FileText, Upload } from "lucide-react";

interface IdVerificationStepProps {
  documentType: string;
  setDocumentType: (val: string) => void;
  documentUrl: string;
  docFileInputRef: RefObject<HTMLInputElement>;
  handleDocumentFile: (file?: File) => void;
  clearDocument: () => void;
}

export function IdVerificationStep({
  documentType,
  setDocumentType,
  documentUrl,
  docFileInputRef,
  handleDocumentFile,
  clearDocument,
}: IdVerificationStepProps) {
  return (
    <div className="pt-2 border-t border-slate-100">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
        <FileText className="h-3.5 w-3.5" />
        <span>2. Identity Document Verification</span>
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Which document you can provide? <span className="text-slate-400 font-normal">(Select one)</span>
          </label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
          >
            <option value="">Select Valid Document</option>
            <option value="Voter ID">Voter ID</option>
            <option value="Aadhaar Card">Aadhaar Card</option>
            <option value="Passport">Passport</option>
          </select>
          <p className="mt-1 text-[11px] text-slate-500">
            Choose any valid government-issued document for official verification.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Upload Document Image <span className="text-slate-400 font-normal">(&lt; 1 MB)</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => docFileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5 text-slate-500" />
              <span>{documentUrl ? "Change Document" : "Upload Document"}</span>
            </button>
            {documentUrl && (
              <button
                type="button"
                onClick={clearDocument}
                className="text-xs font-medium text-red-600 hover:underline px-2 py-1 cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Upload image size less than 1 MB (JPG, PNG, WEBP).
          </p>
          <input
            ref={docFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleDocumentFile(e.target.files?.[0])}
          />
        </div>
      </div>

      {documentUrl && (
        <div className="mt-3 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-3">
          <img
            src={documentUrl}
            alt="Document Preview"
            className="h-20 w-32 object-contain rounded-lg border border-slate-200 bg-white shrink-0 shadow-xs"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                {documentType || "ID Document"}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600">✓ Ready to submit (&lt; 1 MB)</span>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              {documentType ? `${documentType} image loaded.` : "Document image loaded."} Official accreditation proof.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
