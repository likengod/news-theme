import { RefObject } from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";

interface AvatarStepProps {
  avatarUrl: string;
  fileInputRef: RefObject<HTMLInputElement>;
  handleAvatarFile: (file?: File) => void;
  clearAvatar: () => void;
}

export function AvatarStep({
  avatarUrl,
  fileInputRef,
  handleAvatarFile,
  clearAvatar,
}: AvatarStepProps) {
  return (
    <div className="pt-2 border-t border-slate-100">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
        <ImageIcon className="h-3.5 w-3.5" />
        <span>3. Profile Photo / Press Avatar</span>
      </h3>

      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Preview Box */}
        <div className="h-28 w-28 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 relative group">
          {avatarUrl ? (
            <>
              <img
                src={avatarUrl}
                alt="Avatar Preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={clearAvatar}
                className="absolute right-1 top-1 bg-red-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 shadow-sm transition"
                title="Remove photo"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          ) : (
            <div className="text-center p-2 text-slate-400">
              <ImageIcon className="h-7 w-7 mx-auto mb-1 text-slate-300" />
              <span className="text-[10px]">No Photo</span>
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-2">
          <p className="text-xs text-slate-600">
            Upload a clear, passport-style square photo (400×400 px recommended). This
            will be printed on your digital Press ID card upon accreditation.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5 text-slate-500" />
              <span>{avatarUrl ? "Change Photo" : "Upload Photo"}</span>
            </button>
            {avatarUrl && (
              <button
                type="button"
                onClick={clearAvatar}
                className="text-xs font-medium text-red-600 hover:underline px-2 py-1 cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleAvatarFile(e.target.files?.[0])}
          />
        </div>
      </div>
    </div>
  );
}
