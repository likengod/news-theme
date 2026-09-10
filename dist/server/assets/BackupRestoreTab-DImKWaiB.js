import { i as createServerFn } from "./esm-Dova13aH.js";
import { P as createSsrRpc } from "./site-content-C32CLrYw.js";
import { t as useServerFn } from "./useServerFn-BqzygRuj.js";
import { t as requireAuth } from "./auth-middleware-DMbfTu4m.js";
import { useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { DatabaseBackup, FileArchive, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import JSZip from "jszip";
//#region src/lib/backup.functions.ts
var generateBackupServer = createServerFn({ method: "GET" }).middleware([requireAuth]).handler(createSsrRpc("04344fe1d3ab2fd1861f88f715beb7ef2db30b44e66ca36f7ba3e8404a815be0"));
var restoreBackupServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((d) => d).handler(createSsrRpc("3a38e185b3779aeaabf8e39bee398139af011d9319629d9d39100c41c4bc0595"));
//#endregion
//#region src/components/admin/settings/BackupRestoreTab.tsx
function BackupRestoreTab() {
	const [backupLoading, setBackupLoading] = useState(false);
	const [restoreLoading, setRestoreLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [progressText, setProgressText] = useState("");
	const fileRef = useRef(null);
	const generateBackup = useServerFn(generateBackupServer);
	const restoreBackup = useServerFn(restoreBackupServer);
	const handleDownloadBackup = async () => {
		try {
			setBackupLoading(true);
			setProgress(0);
			setProgressText("Fetching database...");
			const backupData = await generateBackup();
			setProgressText("Fetching file manager uploads...");
			const mediaRaw = localStorage.getItem("nt_media_library_v1");
			const mediaItems = mediaRaw ? JSON.parse(mediaRaw) : [];
			setProgressText("Creating ZIP file...");
			const zip = new JSZip();
			zip.file("database.json", JSON.stringify(backupData.data, null, 2));
			zip.file("media_library.json", JSON.stringify(mediaItems, null, 2));
			const imagesFolder = zip.folder("uploads");
			if (imagesFolder) {
				for (const item of mediaItems) if (item.dataUrl && item.dataUrl.startsWith("data:")) {
					const base64Data = item.dataUrl.split(",")[1];
					if (base64Data) imagesFolder.file(item.name, base64Data, { base64: true });
				}
			}
			const zipBlob = await zip.generateAsync({ type: "blob" }, (metadata) => {
				setProgress(Math.round(metadata.percent));
				setProgressText(`Compressing... ${Math.round(metadata.percent)}%`);
			});
			setProgressText("Downloading...");
			const url = URL.createObjectURL(zipBlob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `northeast-full-backup-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.zip`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			toast.success("Backup downloaded successfully!");
		} catch (e) {
			toast.error(e.message || "Failed to generate backup");
		} finally {
			setBackupLoading(false);
			setProgress(0);
			setProgressText("");
		}
	};
	const handleRestoreBackup = async (e) => {
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
			const unzipped = await new JSZip().loadAsync(file);
			setProgressText("Restoring database...");
			const dbFile = unzipped.file("database.json");
			if (!dbFile) throw new Error("Invalid backup: missing database.json");
			const dbJsonStr = await dbFile.async("string");
			await restoreBackup({ data: { backup: {
				version: "1.0",
				data: JSON.parse(dbJsonStr)
			} } });
			setProgressText("Restoring file manager...");
			const mediaFile = unzipped.file("media_library.json");
			if (mediaFile) {
				const mediaJsonStr = await mediaFile.async("string");
				localStorage.setItem("nt_media_library_v1", mediaJsonStr);
			}
			toast.success("Website restored successfully! Refreshing...");
			setTimeout(() => window.location.reload(), 2e3);
		} catch (e) {
			console.error(e);
			toast.error(e.message || "Failed to restore backup");
		} finally {
			setRestoreLoading(false);
			setProgress(0);
			setProgressText("");
			if (fileRef.current) fileRef.current.value = "";
		}
	};
	return /* @__PURE__ */ jsx("div", {
		className: "space-y-6",
		children: /* @__PURE__ */ jsxs("section", {
			className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
			children: [
				/* @__PURE__ */ jsxs("h2", {
					className: "mb-4 text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(DatabaseBackup, { className: "h-4 w-4" }), "System Backup & Restore"]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-sm text-slate-600 mb-6",
					children: "Download a complete ZIP snapshot of your website. This includes your database (articles, settings, users, comments, categories, tags, pages) and all images uploaded to the File Manager."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap gap-4 items-center",
						children: [
							/* @__PURE__ */ jsxs("button", {
								onClick: handleDownloadBackup,
								disabled: backupLoading || restoreLoading,
								className: "inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition",
								children: [backupLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(FileArchive, { className: "h-4 w-4" }), "Download Full Backup (ZIP)"]
							}),
							/* @__PURE__ */ jsx("input", {
								type: "file",
								accept: ".zip",
								className: "hidden",
								ref: fileRef,
								onChange: handleRestoreBackup
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => fileRef.current?.click(),
								disabled: backupLoading || restoreLoading,
								className: "inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition",
								children: [restoreLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }), "Restore from ZIP"]
							})
						]
					}), (backupLoading || restoreLoading) && /* @__PURE__ */ jsxs("div", {
						className: "w-full max-w-md bg-slate-100 rounded-full h-2.5 overflow-hidden relative",
						children: [/* @__PURE__ */ jsx("div", {
							className: "bg-emerald-500 h-2.5 rounded-full transition-all duration-300 ease-out",
							style: { width: `${progress}%` }
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 mt-2 font-medium",
							children: progressText
						})]
					})]
				})
			]
		})
	});
}
//#endregion
export { BackupRestoreTab };
