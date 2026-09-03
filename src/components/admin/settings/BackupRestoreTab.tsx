import { useState, useRef } from "react";
import { Download, Upload, DatabaseBackup, Loader2, FileArchive } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { generateBackupServer, restoreBackupServer } from "@/lib/backup.functions";
import JSZip from "jszip";

export function BackupRestoreTab() {
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const generateBackup = useServerFn(generateBackupServer);
  const restoreBackup = useServerFn(restoreBackupServer);

  const handleDownloadBackup = async () => {
    try {
      setBackupLoading(true);
      setProgress(0);
      setProgressText("Fetching database...");

      // 1. Fetch Database
      const backupData = await generateBackup();

      // 2. Fetch Media Library
      setProgressText("Fetching file manager uploads...");
      const mediaRaw = localStorage.getItem("nt_media_library_v1");
      const mediaItems = mediaRaw ? JSON.parse(mediaRaw) : [];

      // 3. Create ZIP
      setProgressText("Creating ZIP file...");
      const zip = new JSZip();

      // Add database dump
      zip.file("database.json", JSON.stringify(backupData.data, null, 2));

      // Add media metadata
      zip.file("media_library.json", JSON.stringify(mediaItems, null, 2));

      // Add images
      const imagesFolder = zip.folder("uploads");
      if (imagesFolder) {
        for (const item of mediaItems) {
          if (item.dataUrl && item.dataUrl.startsWith("data:")) {
            const base64Data = item.dataUrl.split(",")[1];
            if (base64Data) {
              imagesFolder.file(item.name, base64Data, { base64: true });
            }
          }
        }
      }

      // Generate ZIP with progress animation
      const zipBlob = await zip.generateAsync({ type: "blob" }, (metadata) => {
        setProgress(Math.round(metadata.percent));
        setProgressText(`Compressing... ${Math.round(metadata.percent)}%`);
      });

      setProgressText("Downloading...");
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `northeast-full-backup-${new Date().toISOString().split("T")[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Backup downloaded successfully!");
    } catch (e: any) {
      toast.error(e.message || "Failed to generate backup");
    } finally {
      setBackupLoading(false);
      setProgress(0);
      setProgressText("");
    }
  };

  const handleRestoreBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm("WARNING: Restoring a backup will overwrite ALL current website data and media. Are you absolutely sure?")) {
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    try {
      setRestoreLoading(true);
      setProgress(0);
      setProgressText("Reading ZIP file...");
      
      const zip = new JSZip();
      const unzipped = await zip.loadAsync(file);

      // 1. Extract and restore database
      setProgressText("Restoring database...");
      const dbFile = unzipped.file("database.json");
      if (!dbFile) throw new Error("Invalid backup: missing database.json");
      
      const dbJsonStr = await dbFile.async("string");
      const dbData = JSON.parse(dbJsonStr);
      
      await restoreBackup({ data: { backup: { version: "1.0", data: dbData } } });

      // 2. Extract and restore media library metadata
      setProgressText("Restoring file manager...");
      const mediaFile = unzipped.file("media_library.json");
      if (mediaFile) {
        const mediaJsonStr = await mediaFile.async("string");
        localStorage.setItem("nt_media_library_v1", mediaJsonStr);
      }

      toast.success("Website restored successfully! Refreshing...");
      setTimeout(() => window.location.reload(), 2000);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to restore backup");
    } finally {
      setRestoreLoading(false);
      setProgress(0);
      setProgressText("");
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-2">
          <DatabaseBackup className="h-4 w-4" />
          System Backup & Restore
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Download a complete ZIP snapshot of your website. This includes your database (articles, settings, users, comments, categories, tags, pages) and all images uploaded to the File Manager.
        </p>

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={handleDownloadBackup}
              disabled={backupLoading || restoreLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition"
            >
              {backupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileArchive className="h-4 w-4" />}
              Download Full Backup (ZIP)
            </button>
            
            <input 
              type="file" 
              accept=".zip" 
              className="hidden" 
              ref={fileRef} 
              onChange={handleRestoreBackup} 
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={backupLoading || restoreLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
            >
              {restoreLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Restore from ZIP
            </button>
          </div>

          {/* Progress Animation Bar */}
          {(backupLoading || restoreLoading) && (
            <div className="w-full max-w-md bg-slate-100 rounded-full h-2.5 overflow-hidden relative">
              <div 
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
              <p className="text-xs text-slate-500 mt-2 font-medium">{progressText}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
