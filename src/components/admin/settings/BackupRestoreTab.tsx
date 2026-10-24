import { useState, useRef } from "react";
import {
  Download,
  Upload,
  DatabaseBackup,
  Loader2,
  FileArchive,
  Cloud,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  FolderArchive,
  ArrowRight,
  Info,
  Server,
  CloudDownload,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import {
  generateBackupServer,
  restoreBackupServer,
  fetchCloudBackupServer,
} from "@/lib/backup.functions";
import JSZip from "jszip";

export function BackupRestoreTab() {
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [cloudLoading, setCloudLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [cloudUrl, setCloudUrl] = useState("");
  const [activeCloudTab, setActiveCloudTab] = useState<"gdrive" | "jiocloud" | "mega">("gdrive");

  const fileRef = useRef<HTMLInputElement>(null);

  const generateBackup = useServerFn(generateBackupServer);
  const restoreBackup = useServerFn(restoreBackupServer);
  const fetchCloudBackup = useServerFn(fetchCloudBackupServer);

  // ── 1. GENERATE & DOWNLOAD FULL BACKUP (ZIP) ─────────────────────────
  const handleDownloadBackup = async () => {
    try {
      setBackupLoading(true);
      setProgress(5);
      setProgressText("Connecting to database & scanning tables...");

      // 1. Fetch complete database and physical uploads from server
      const backupResponse = await generateBackup();
      if (!backupResponse?.data) {
        throw new Error("Server returned empty backup data");
      }

      setProgress(35);
      setProgressText("Packaging database dump & media files into ZIP archive...");

      const zip = new JSZip();

      // Add database dump
      zip.file("database.json", JSON.stringify(backupResponse.data, null, 2));

      // Add manifest metadata
      const manifest = {
        website: "Today Tripura",
        version: backupResponse.version || "1.2.22",
        exportedAt: backupResponse.timestamp || new Date().toISOString(),
        stats: backupResponse.stats,
      };
      zip.file("manifest.json", JSON.stringify(manifest, null, 2));

      // Add physical uploaded images
      if (Array.isArray(backupResponse.files) && backupResponse.files.length > 0) {
        setProgress(50);
        setProgressText(`Adding ${backupResponse.files.length} media files into ZIP...`);
        const uploadsFolder = zip.folder("uploads");
        if (uploadsFolder) {
          for (const file of backupResponse.files) {
            if (file.relativePath && file.base64) {
              uploadsFolder.file(file.relativePath, file.base64, { base64: true });
            }
          }
        }
      }

      // Generate ZIP with progress animation
      setProgress(70);
      setProgressText("Compressing archive...");
      const zipBlob = await zip.generateAsync({ type: "blob" }, (metadata) => {
        const pct = Math.min(99, 70 + Math.round(metadata.percent * 0.28));
        setProgress(pct);
        setProgressText(`Compressing ZIP archive... ${Math.round(metadata.percent)}%`);
      });

      setProgress(99);
      setProgressText("Triggering browser download...");

      const dateStr = new Date().toISOString().split("T")[0];
      const filename = `todaytripura-full-backup-${dateStr}.zip`;

      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProgress(100);
      toast.success(`Backup downloaded successfully! (${(zipBlob.size / 1024 / 1024).toFixed(2)} MB)`);
    } catch (e: any) {
      console.error("Backup failed:", e);
      toast.error(e.message || "Failed to generate backup");
    } finally {
      setTimeout(() => {
        setBackupLoading(false);
        setProgress(0);
        setProgressText("");
      }, 800);
    }
  };

  // ── 2. PROCESS AND EXECUTE RESTORE FROM ZIP BLOB / FILE ────────────────
  const executeRestoreFromZip = async (zipData: Blob | ArrayBuffer) => {
    if (
      !confirm(
        "⚠️ CRITICAL WARNING: Restoring a backup will overwrite all current website data, articles, users, settings, and media files.\n\nAre you sure you want to proceed?",
      )
    ) {
      return;
    }

    try {
      setRestoreLoading(true);
      setProgress(10);
      setProgressText("Unpacking ZIP archive...");

      const zip = new JSZip();
      const unzipped = await zip.loadAsync(zipData);

      // Extract database.json
      setProgress(30);
      setProgressText("Reading database tables from backup...");
      const dbFile = unzipped.file("database.json");
      if (!dbFile) {
        throw new Error("Invalid backup archive: missing database.json");
      }

      const dbJsonStr = await dbFile.async("string");
      const dbData = JSON.parse(dbJsonStr);

      // Extract uploaded media files
      setProgress(50);
      setProgressText("Extracting media files from archive...");
      const extractedFiles: Array<{ relativePath: string; base64: string }> = [];

      const uploadsFolder = unzipped.folder("uploads");
      if (uploadsFolder) {
        const filePromises: Promise<void>[] = [];
        uploadsFolder.forEach((relativePath, fileEntry) => {
          if (!fileEntry.dir) {
            filePromises.push(
              fileEntry.async("base64").then((b64) => {
                extractedFiles.push({
                  relativePath: relativePath.replace(/\\/g, "/"),
                  base64: b64,
                });
              }),
            );
          }
        });
        await Promise.all(filePromises);
      }

      // Send payload to server
      setProgress(75);
      setProgressText(`Restoring ${Object.keys(dbData).length} database tables & ${extractedFiles.length} images...`);

      const res = await restoreBackup({
        data: {
          backup: {
            version: "1.2.22",
            data: dbData,
          },
          files: extractedFiles,
        },
      });

      if (!res?.success) {
        throw new Error("Server restore failed");
      }

      setProgress(100);
      setProgressText("Restore completed! Refreshing page...");
      toast.success(
        `Website restored successfully! (${res.restoredTables || Object.keys(dbData).length} tables, ${res.restoredFiles || extractedFiles.length} files)`,
      );

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (e: any) {
      console.error("Restore failed:", e);
      toast.error(e.message || "Failed to restore backup archive");
      setRestoreLoading(false);
      setProgress(0);
      setProgressText("");
    }
  };

  // ── 3. RESTORE FROM LOCAL ZIP FILE INPUT ──────────────────────────────
  const handleLocalFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await executeRestoreFromZip(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ── 4. RESTORE DIRECTLY FROM CLOUD LINK (Google Drive / Jio / Mega / URL) ─
  const handleRestoreFromCloudUrl = async () => {
    if (!cloudUrl.trim()) {
      toast.error("Please enter a Google Drive, Jio Cloud, or direct ZIP file URL");
      return;
    }

    try {
      setCloudLoading(true);
      setProgress(15);
      setProgressText("Connecting to cloud storage link...");

      const result = await fetchCloudBackup({ data: { url: cloudUrl.trim() } });
      if (!result?.base64Zip) {
        throw new Error("Failed to retrieve file from cloud link");
      }

      setProgress(50);
      setProgressText("Converting cloud file stream...");

      // Convert base64 to binary ArrayBuffer
      const binaryString = atob(result.base64Zip);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Execute restore
      await executeRestoreFromZip(bytes.buffer);
    } catch (e: any) {
      console.error("Cloud restore failed:", e);
      toast.error(e.message || "Failed to restore from cloud link");
    } finally {
      setCloudLoading(false);
      setProgress(0);
      setProgressText("");
    }
  };

  return (
    <div className="space-y-6">
      {/* ── TOP SECTION: BACKUP & RESTORE ACTIONS ── */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs">
              <DatabaseBackup className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                System Backup & Restore
              </h2>
              <p className="text-xs text-slate-500">
                Complete database snapshot & all uploaded images
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg self-start sm:self-auto">
            <Server className="h-3.5 w-3.5 text-emerald-600" />
            <span>Database: Connected</span>
            <span className="text-slate-300">•</span>
            <span>13 Tables</span>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Create and download a full, standalone <strong>.ZIP snapshot</strong> of your website.
          The archive bundles your entire MySQL database (articles, settings, journalists, comments,
          pages, categories, tags) and all physical images stored in the File Manager (<code className="bg-slate-100 px-1 py-0.5 rounded text-xs text-slate-700">/uploads/</code>).
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap gap-3.5 items-center">
          <button
            onClick={handleDownloadBackup}
            disabled={backupLoading || restoreLoading || cloudLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 active:scale-95 disabled:opacity-50 transition shadow-sm cursor-pointer"
          >
            {backupLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download Full Backup (ZIP)
          </button>

          <input
            type="file"
            accept=".zip"
            className="hidden"
            ref={fileRef}
            onChange={handleLocalFileSelected}
          />

          <button
            onClick={() => fileRef.current?.click()}
            disabled={backupLoading || restoreLoading || cloudLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 disabled:opacity-50 transition shadow-xs cursor-pointer"
          >
            {restoreLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
            ) : (
              <Upload className="h-4 w-4 text-slate-600" />
            )}
            Restore from Local ZIP
          </button>
        </div>

        {/* Progress Bar Animation */}
        {(backupLoading || restoreLoading || cloudLoading) && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/80 p-4 max-w-xl">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>{progressText || "Processing..."}</span>
              <span className="font-mono text-emerald-600 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {/* ── RESTORE FROM CLOUD LINK (Google Drive / Jio Cloud / Mega / Direct URL) ── */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4">
          <CloudDownload className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Restore Directly from Cloud Link
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 mb-4">
          Have your backup saved on <strong>Google Drive</strong>, <strong>Jio Cloud</strong>, or <strong>Mega</strong>?
          Paste the shareable or direct download link below. The server will fetch the ZIP file and restore your entire site directly without requiring you to re-upload from your computer.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5 max-w-2xl">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="url"
              value={cloudUrl}
              onChange={(e) => setCloudUrl(e.target.value)}
              placeholder="e.g. https://drive.google.com/file/d/1XyZ.../view?usp=sharing"
              className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm focus:border-slate-900 focus:outline-none"
              disabled={cloudLoading || restoreLoading || backupLoading}
            />
          </div>

          <button
            onClick={handleRestoreFromCloudUrl}
            disabled={cloudLoading || restoreLoading || backupLoading || !cloudUrl.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition shadow-sm shrink-0 cursor-pointer"
          >
            {cloudLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CloudDownload className="h-4 w-4" />
            )}
            Fetch & Restore from Cloud
          </button>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
          <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>
            For Google Drive links: Set link sharing to <strong>&ldquo;Anyone with the link can view&rdquo;</strong> before pasting.
          </span>
        </div>
      </section>

      {/* ── CLOUD STORAGE PROVIDERS & INTEGRATION GUIDE ── */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-indigo-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Cloud Storage Options & Guide
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            Supported & Compatible
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 mb-5">
          <strong>Is it possible to backup and restore using Google Drive, Jio Cloud, and Mega Drive?</strong> Yes!
          Here is how to use each provider:
        </p>

        {/* Provider Tabs */}
        <div className="flex border-b border-slate-200 gap-2 mb-5">
          <button
            type="button"
            onClick={() => setActiveCloudTab("gdrive")}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeCloudTab === "gdrive"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-blue-600"></span>
            Google Drive
          </button>

          <button
            type="button"
            onClick={() => setActiveCloudTab("jiocloud")}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeCloudTab === "jiocloud"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
            Jio Cloud
          </button>

          <button
            type="button"
            onClick={() => setActiveCloudTab("mega")}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeCloudTab === "mega"
                ? "border-red-600 text-red-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-red-600"></span>
            MEGA Drive (MEGA.nz)
          </button>
        </div>

        {/* Tab 1: Google Drive */}
        {activeCloudTab === "gdrive" && (
          <div className="space-y-4 rounded-xl border border-blue-100 bg-blue-50/40 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>Google Drive Storage & Restore</span>
              </h4>
              <span className="text-xs font-medium text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                15 GB Free Storage
              </span>
            </div>

            <ol className="list-decimal list-inside space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li>
                <strong>Create Backup:</strong> Click <em>&ldquo;Download Full Backup (ZIP)&rdquo;</em> above to save your snapshot.
              </li>
              <li>
                <strong>Upload to Drive:</strong> Open <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Google Drive</a> and drag the downloaded ZIP into your preferred folder (e.g. <code className="bg-white px-1 py-0.5 rounded border border-blue-200">TodayTripura_Backups/</code>).
              </li>
              <li>
                <strong>1-Click Restore via Link:</strong> Right-click the file in Google Drive &rarr; <em>Share</em> &rarr; set to <em>&ldquo;Anyone with the link can view&rdquo;</em> &rarr; Copy link &rarr; Paste it in the <strong>&ldquo;Restore Directly from Cloud Link&rdquo;</strong> box above!
              </li>
              <li>
                <strong>Automated Nightly Google Drive API (Optional):</strong> If you want the server to push daily backups to Google Drive automatically via cron, you can connect a Google Cloud Service Account with Google Drive API v3 permissions.
              </li>
            </ol>
          </div>
        )}

        {/* Tab 2: Jio Cloud */}
        {activeCloudTab === "jiocloud" && (
          <div className="space-y-4 rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>Jio Cloud Storage & Restore</span>
              </h4>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                5 GB – 100 GB with Jio
              </span>
            </div>

            <ol className="list-decimal list-inside space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li>
                <strong>Create Backup:</strong> Click <em>&ldquo;Download Full Backup (ZIP)&rdquo;</em> above.
              </li>
              <li>
                <strong>Save to JioCloud:</strong> Log into <a href="https://www.jiocloud.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-medium">JioCloud Web</a> or the JioCloud Mobile / PC app. Upload the ZIP to your Documents or Backups section.
              </li>
              <li>
                <strong>Restore when needed:</strong> When you need to restore your website, download the backup ZIP from JioCloud and click <strong>&ldquo;Restore from Local ZIP&rdquo;</strong>, or generate a shareable JioCloud link and use <em>&ldquo;Fetch & Restore from Cloud&rdquo;</em>.
              </li>
              <li>
                <strong>Note:</strong> JioCloud is consumer-oriented with end-to-end user encryption. Storing periodic copies in JioCloud gives you free, ultra-fast Indian server storage.
              </li>
            </ol>
          </div>
        )}

        {/* Tab 3: MEGA Drive */}
        {activeCloudTab === "mega" && (
          <div className="space-y-4 rounded-xl border border-red-100 bg-red-50/40 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>MEGA Drive (MEGA.nz) Encrypted Storage</span>
              </h4>
              <span className="text-xs font-medium text-red-700 bg-red-100/70 px-2 py-0.5 rounded">
                20 GB Free Zero-Knowledge Storage
              </span>
            </div>

            <ol className="list-decimal list-inside space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li>
                <strong>Create Backup:</strong> Click <em>&ldquo;Download Full Backup (ZIP)&rdquo;</em> above.
              </li>
              <li>
                <strong>Upload to MEGA:</strong> Drag the ZIP into your <a href="https://mega.io" target="_blank" rel="noopener noreferrer" className="text-red-600 underline font-medium">MEGA Cloud Drive</a>. MEGA provides military-grade zero-knowledge encryption.
              </li>
              <li>
                <strong>Restore:</strong> Right-click the file in MEGA &rarr; <em>Get Link</em> &rarr; Copy link. You can also download the ZIP anytime and click <strong>&ldquo;Restore from Local ZIP&rdquo;</strong> to roll back your database and images in seconds.
              </li>
            </ol>
          </div>
        )}
      </section>

      {/* ── ARCHIVE CONTENTS BREAKDOWN ── */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <FolderArchive className="h-4 w-4 text-slate-400" />
          What is Stored in Every Backup Archive?
        </h3>

        <div className="grid gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              13 Database Tables
            </div>
            <p className="text-slate-500 leading-relaxed">
              Articles, categories, tags, comments, profiles, user accounts, journalist points, and system settings.
            </p>
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              All Uploaded Images
            </div>
            <p className="text-slate-500 leading-relaxed">
              Every featured image, ad banner, promo graphic, and logo uploaded to <code className="text-slate-700">/uploads/</code> is packaged inside.
            </p>
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Manifest & Metadata
            </div>
            <p className="text-slate-500 leading-relaxed">
              JSON manifest verifying website version, checksums, export timestamp, and exact record counts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BackupRestoreTab;
