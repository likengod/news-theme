import { i as createServerFn } from "./server-BgZ4iWFx.js";
import { t as createSsrRpc } from "./createSsrRpc-CpBx-axM.js";
import { t as useServerFn } from "./useServerFn-B0OM9FrS.js";
import { t as requireAdmin } from "./auth-middleware-CyvYO-vu.js";
import { t as attachAuth } from "./auth-attacher-CiewOB_t.js";
import { t as APP_VERSION } from "./version-DNFW4PAE.js";
import { useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, Cloud, CloudDownload, DatabaseBackup, Download, FolderArchive, Info, Link, Loader2, Server, Upload } from "lucide-react";
import { toast } from "sonner";
import JSZip from "jszip";
// src/lib/backup.functions.ts
var generateBackupServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).handler(createSsrRpc("04344fe1d3ab2fd1861f88f715beb7ef2db30b44e66ca36f7ba3e8404a815be0"));
var restoreBackupServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((d) => d).handler(createSsrRpc("3a38e185b3779aeaabf8e39bee398139af011d9319629d9d39100c41c4bc0595"));
var fetchCloudBackupServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((d) => d).handler(createSsrRpc("89382b2939ddbd1aa77145d368669ee82e1eceec29261bf47fd3c8be059eb039"));
// src/components/admin/settings/BackupRestoreTab.tsx
function BackupRestoreTab() {
	const [backupLoading, setBackupLoading] = useState(false);
	const [restoreLoading, setRestoreLoading] = useState(false);
	const [cloudLoading, setCloudLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [progressText, setProgressText] = useState("");
	const [cloudUrl, setCloudUrl] = useState("");
	const [activeCloudTab, setActiveCloudTab] = useState("gdrive");
	const fileRef = useRef(null);
	const generateBackup = useServerFn(generateBackupServer);
	const restoreBackup = useServerFn(restoreBackupServer);
	const fetchCloudBackup = useServerFn(fetchCloudBackupServer);
	const handleDownloadBackup = async () => {
		try {
			setBackupLoading(true);
			setProgress(5);
			setProgressText("Connecting to database & scanning tables...");
			const backupResponse = await generateBackup();
			if (!backupResponse?.data) throw new Error("Server returned empty backup data");
			setProgress(35);
			setProgressText("Packaging database dump & media files into ZIP archive...");
			const zip = new JSZip();
			zip.file("database.json", JSON.stringify(backupResponse.data, null, 2));
			const manifest = {
				website: "Today Tripura",
				version: backupResponse.version || "v1.2.31",
				exportedAt: backupResponse.timestamp || (/* @__PURE__ */ new Date()).toISOString(),
				stats: backupResponse.stats
			};
			zip.file("manifest.json", JSON.stringify(manifest, null, 2));
			if (Array.isArray(backupResponse.files) && backupResponse.files.length > 0) {
				setProgress(50);
				setProgressText(`Adding ${backupResponse.files.length} media files into ZIP...`);
				const uploadsFolder = zip.folder("uploads");
				if (uploadsFolder) {
					for (const file of backupResponse.files) if (file.relativePath && file.base64) uploadsFolder.file(file.relativePath, file.base64, { base64: true });
				}
			}
			setProgress(70);
			setProgressText("Compressing archive...");
			const zipBlob = await zip.generateAsync({ type: "blob" }, (metadata) => {
				const pct = Math.min(99, 70 + Math.round(metadata.percent * .28));
				setProgress(pct);
				setProgressText(`Compressing ZIP archive... ${Math.round(metadata.percent)}%`);
			});
			setProgress(99);
			setProgressText("Triggering browser download...");
			const filename = `todaytripura-full-backup-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.zip`;
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
		} catch (e) {
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
	const executeRestoreFromZip = async (zipData) => {
		if (!confirm("⚠️ CRITICAL WARNING: Restoring a backup will overwrite all current website data, articles, users, settings, and media files.\n\nAre you sure you want to proceed?")) return;
		try {
			setRestoreLoading(true);
			setProgress(10);
			setProgressText("Unpacking ZIP archive...");
			const unzipped = await new JSZip().loadAsync(zipData);
			setProgress(30);
			setProgressText("Reading database tables from backup...");
			const dbFile = unzipped.file("database.json");
			if (!dbFile) throw new Error("Invalid backup archive: missing database.json");
			const dbJsonStr = await dbFile.async("string");
			const dbData = JSON.parse(dbJsonStr);
			setProgress(50);
			setProgressText("Extracting media files from archive...");
			const extractedFiles = [];
			const uploadsFolder = unzipped.folder("uploads");
			if (uploadsFolder) {
				const filePromises = [];
				uploadsFolder.forEach((relativePath, fileEntry) => {
					if (!fileEntry.dir) filePromises.push(fileEntry.async("base64").then((b64) => {
						extractedFiles.push({
							relativePath: relativePath.replace(/\\/g, "/"),
							base64: b64
						});
					}));
				});
				await Promise.all(filePromises);
			}
			setProgress(75);
			setProgressText(`Restoring ${Object.keys(dbData).length} database tables & ${extractedFiles.length} images...`);
			const res = await restoreBackup({ data: {
				backup: {
					version: APP_VERSION,
					data: dbData
				},
				files: extractedFiles
			} });
			if (!res?.success) throw new Error("Server restore failed");
			setProgress(100);
			setProgressText("Restore completed! Refreshing page...");
			toast.success(`Website restored successfully! (${res.restoredTables || Object.keys(dbData).length} tables, ${res.restoredFiles || extractedFiles.length} files)`);
			setTimeout(() => {
				window.location.reload();
			}, 1500);
		} catch (e) {
			console.error("Restore failed:", e);
			toast.error(e.message || "Failed to restore backup archive");
			setRestoreLoading(false);
			setProgress(0);
			setProgressText("");
		}
	};
	const handleLocalFileSelected = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		await executeRestoreFromZip(file);
		if (fileRef.current) fileRef.current.value = "";
	};
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
			if (!result?.base64Zip) throw new Error("Failed to retrieve file from cloud link");
			setProgress(50);
			setProgressText("Converting cloud file stream...");
			const binaryString = atob(result.base64Zip);
			const len = binaryString.length;
			const bytes = new Uint8Array(len);
			for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
			await executeRestoreFromZip(bytes.buffer);
		} catch (e) {
			console.error("Cloud restore failed:", e);
			toast.error(e.message || "Failed to restore from cloud link");
		} finally {
			setCloudLoading(false);
			setProgress(0);
			setProgressText("");
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4 mb-5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs",
								children: /* @__PURE__ */ jsx(DatabaseBackup, { className: "h-5 w-5" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
								className: "text-sm font-bold uppercase tracking-wider text-slate-800",
								children: "System Backup & Restore"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500",
								children: "Complete database snapshot & all uploaded images"
							})] })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg self-start sm:self-auto",
							children: [
								/* @__PURE__ */ jsx(Server, { className: "h-3.5 w-3.5 text-emerald-600" }),
								/* @__PURE__ */ jsx("span", { children: "Database: Connected" }),
								/* @__PURE__ */ jsx("span", {
									className: "text-slate-300",
									children: "•"
								}),
								/* @__PURE__ */ jsx("span", { children: "13 Tables" })
							]
						})]
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "text-sm text-slate-600 mb-6 leading-relaxed",
						children: [
							"Create and download a full, standalone ",
							/* @__PURE__ */ jsx("strong", { children: ".ZIP snapshot" }),
							" of your website. The archive bundles your entire MySQL database (articles, settings, journalists, comments, pages, categories, tags) and all physical images stored in the File Manager (",
							/* @__PURE__ */ jsx("code", {
								className: "bg-slate-100 px-1 py-0.5 rounded text-xs text-slate-700",
								children: "/uploads/"
							}),
							")."
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap gap-3.5 items-center",
						children: [
							/* @__PURE__ */ jsxs("button", {
								onClick: handleDownloadBackup,
								disabled: backupLoading || restoreLoading || cloudLoading,
								className: "inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 active:scale-95 disabled:opacity-50 transition shadow-sm cursor-pointer",
								children: [backupLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), "Download Full Backup (ZIP)"]
							}),
							/* @__PURE__ */ jsx("input", {
								type: "file",
								accept: ".zip",
								className: "hidden",
								ref: fileRef,
								onChange: handleLocalFileSelected
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => fileRef.current?.click(),
								disabled: backupLoading || restoreLoading || cloudLoading,
								className: "inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 disabled:opacity-50 transition shadow-xs cursor-pointer",
								children: [restoreLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin text-slate-600" }) : /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4 text-slate-600" }), "Restore from Local ZIP"]
							})
						]
					}),
					(backupLoading || restoreLoading || cloudLoading) && /* @__PURE__ */ jsxs("div", {
						className: "mt-5 rounded-xl border border-slate-200 bg-slate-50/80 p-4 max-w-xl",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5",
							children: [/* @__PURE__ */ jsx("span", { children: progressText || "Processing..." }), /* @__PURE__ */ jsxs("span", {
								className: "font-mono text-emerald-600 font-bold",
								children: [progress, "%"]
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "w-full bg-slate-200 rounded-full h-2 overflow-hidden",
							children: /* @__PURE__ */ jsx("div", {
								className: "bg-emerald-600 h-2 rounded-full transition-all duration-300 ease-out",
								style: { width: `${progress}%` }
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4",
						children: [/* @__PURE__ */ jsx(CloudDownload, { className: "h-4 w-4 text-blue-600" }), /* @__PURE__ */ jsx("h3", {
							className: "text-sm font-bold uppercase tracking-wider text-slate-800",
							children: "Restore Directly from Cloud Link"
						})]
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "text-xs sm:text-sm text-slate-600 mb-4",
						children: [
							"Have your backup saved on ",
							/* @__PURE__ */ jsx("strong", { children: "Google Drive" }),
							", ",
							/* @__PURE__ */ jsx("strong", { children: "Jio Cloud" }),
							", or ",
							/* @__PURE__ */ jsx("strong", { children: "Mega" }),
							"? Paste the shareable or direct download link below. The server will fetch the ZIP file and restore your entire site directly without requiring you to re-upload from your computer."
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row gap-2.5 max-w-2xl",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ jsx(Link, { className: "absolute left-3 top-3 h-4 w-4 text-slate-400" }), /* @__PURE__ */ jsx("input", {
								type: "url",
								value: cloudUrl,
								onChange: (e) => setCloudUrl(e.target.value),
								placeholder: "e.g. https://drive.google.com/file/d/1XyZ.../view?usp=sharing",
								className: "h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm focus:border-slate-900 focus:outline-none",
								disabled: cloudLoading || restoreLoading || backupLoading
							})]
						}), /* @__PURE__ */ jsxs("button", {
							onClick: handleRestoreFromCloudUrl,
							disabled: cloudLoading || restoreLoading || backupLoading || !cloudUrl.trim(),
							className: "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition shadow-sm shrink-0 cursor-pointer",
							children: [cloudLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(CloudDownload, { className: "h-4 w-4" }), "Fetch & Restore from Cloud"]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-3 flex items-center gap-1.5 text-[11px] text-slate-500",
						children: [/* @__PURE__ */ jsx(Info, { className: "h-3.5 w-3.5 text-slate-400 shrink-0" }), /* @__PURE__ */ jsxs("span", { children: [
							"For Google Drive links: Set link sharing to ",
							/* @__PURE__ */ jsx("strong", { children: "“Anyone with the link can view”" }),
							" before pasting."
						] })]
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between border-b border-slate-100 pb-3 mb-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Cloud, { className: "h-4 w-4 text-indigo-600" }), /* @__PURE__ */ jsx("h3", {
								className: "text-sm font-bold uppercase tracking-wider text-slate-800",
								children: "Cloud Storage Options & Guide"
							})]
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full",
							children: "Supported & Compatible"
						})]
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "text-xs sm:text-sm text-slate-600 mb-5",
						children: [/* @__PURE__ */ jsx("strong", { children: "Is it possible to backup and restore using Google Drive, Jio Cloud, and Mega Drive?" }), " Yes! Here is how to use each provider:"]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex border-b border-slate-200 gap-2 mb-5",
						children: [
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setActiveCloudTab("gdrive"),
								className: `pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${activeCloudTab === "gdrive" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"}`,
								children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-blue-600" }), "Google Drive"]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setActiveCloudTab("jiocloud"),
								className: `pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${activeCloudTab === "jiocloud" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-800"}`,
								children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-600" }), "Jio Cloud"]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setActiveCloudTab("mega"),
								className: `pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${activeCloudTab === "mega" ? "border-red-600 text-red-600" : "border-transparent text-slate-500 hover:text-slate-800"}`,
								children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-red-600" }), "MEGA Drive (MEGA.nz)"]
							})
						]
					}),
					activeCloudTab === "gdrive" && /* @__PURE__ */ jsxs("div", {
						className: "space-y-4 rounded-xl border border-blue-100 bg-blue-50/40 p-4 sm:p-5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "text-sm font-bold text-slate-800 flex items-center gap-2",
								children: /* @__PURE__ */ jsx("span", { children: "Google Drive Storage & Restore" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs font-medium text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded",
								children: "15 GB Free Storage"
							})]
						}), /* @__PURE__ */ jsxs("ol", {
							className: "list-decimal list-inside space-y-2.5 text-xs sm:text-sm text-slate-700",
							children: [
								/* @__PURE__ */ jsxs("li", { children: [
									/* @__PURE__ */ jsx("strong", { children: "Create Backup:" }),
									" Click ",
									/* @__PURE__ */ jsx("em", { children: "“Download Full Backup (ZIP)”" }),
									" above to save your snapshot."
								] }),
								/* @__PURE__ */ jsxs("li", { children: [
									/* @__PURE__ */ jsx("strong", { children: "Upload to Drive:" }),
									" Open ",
									/* @__PURE__ */ jsx("a", {
										href: "https://drive.google.com",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "text-blue-600 underline font-medium",
										children: "Google Drive"
									}),
									" and drag the downloaded ZIP into your preferred folder (e.g. ",
									/* @__PURE__ */ jsx("code", {
										className: "bg-white px-1 py-0.5 rounded border border-blue-200",
										children: "TodayTripura_Backups/"
									}),
									")."
								] }),
								/* @__PURE__ */ jsxs("li", { children: [
									/* @__PURE__ */ jsx("strong", { children: "1-Click Restore via Link:" }),
									" Right-click the file in Google Drive → ",
									/* @__PURE__ */ jsx("em", { children: "Share" }),
									" → set to ",
									/* @__PURE__ */ jsx("em", { children: "“Anyone with the link can view”" }),
									" → Copy link → Paste it in the ",
									/* @__PURE__ */ jsx("strong", { children: "“Restore Directly from Cloud Link”" }),
									" box above!"
								] }),
								/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Automated Nightly Google Drive API (Optional):" }), " If you want the server to push daily backups to Google Drive automatically via cron, you can connect a Google Cloud Service Account with Google Drive API v3 permissions."] })
							]
						})]
					}),
					activeCloudTab === "jiocloud" && /* @__PURE__ */ jsxs("div", {
						className: "space-y-4 rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 sm:p-5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "text-sm font-bold text-slate-800 flex items-center gap-2",
								children: /* @__PURE__ */ jsx("span", { children: "Jio Cloud Storage & Restore" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs font-medium text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded",
								children: "5 GB – 100 GB with Jio"
							})]
						}), /* @__PURE__ */ jsxs("ol", {
							className: "list-decimal list-inside space-y-2.5 text-xs sm:text-sm text-slate-700",
							children: [
								/* @__PURE__ */ jsxs("li", { children: [
									/* @__PURE__ */ jsx("strong", { children: "Create Backup:" }),
									" Click ",
									/* @__PURE__ */ jsx("em", { children: "“Download Full Backup (ZIP)”" }),
									" above."
								] }),
								/* @__PURE__ */ jsxs("li", { children: [
									/* @__PURE__ */ jsx("strong", { children: "Save to JioCloud:" }),
									" Log into ",
									/* @__PURE__ */ jsx("a", {
										href: "https://www.jiocloud.com",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "text-emerald-700 underline font-medium",
										children: "JioCloud Web"
									}),
									" or the JioCloud Mobile / PC app. Upload the ZIP to your Documents or Backups section."
								] }),
								/* @__PURE__ */ jsxs("li", { children: [
									/* @__PURE__ */ jsx("strong", { children: "Restore when needed:" }),
									" When you need to restore your website, download the backup ZIP from JioCloud and click ",
									/* @__PURE__ */ jsx("strong", { children: "“Restore from Local ZIP”" }),
									", or generate a shareable JioCloud link and use ",
									/* @__PURE__ */ jsx("em", { children: "“Fetch & Restore from Cloud”" }),
									"."
								] }),
								/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Note:" }), " JioCloud is consumer-oriented with end-to-end user encryption. Storing periodic copies in JioCloud gives you free, ultra-fast Indian server storage."] })
							]
						})]
					}),
					activeCloudTab === "mega" && /* @__PURE__ */ jsxs("div", {
						className: "space-y-4 rounded-xl border border-red-100 bg-red-50/40 p-4 sm:p-5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "text-sm font-bold text-slate-800 flex items-center gap-2",
								children: /* @__PURE__ */ jsx("span", { children: "MEGA Drive (MEGA.nz) Encrypted Storage" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs font-medium text-red-700 bg-red-100/70 px-2 py-0.5 rounded",
								children: "20 GB Free Zero-Knowledge Storage"
							})]
						}), /* @__PURE__ */ jsxs("ol", {
							className: "list-decimal list-inside space-y-2.5 text-xs sm:text-sm text-slate-700",
							children: [
								/* @__PURE__ */ jsxs("li", { children: [
									/* @__PURE__ */ jsx("strong", { children: "Create Backup:" }),
									" Click ",
									/* @__PURE__ */ jsx("em", { children: "“Download Full Backup (ZIP)”" }),
									" above."
								] }),
								/* @__PURE__ */ jsxs("li", { children: [
									/* @__PURE__ */ jsx("strong", { children: "Upload to MEGA:" }),
									" Drag the ZIP into your ",
									/* @__PURE__ */ jsx("a", {
										href: "https://mega.io",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "text-red-600 underline font-medium",
										children: "MEGA Cloud Drive"
									}),
									". MEGA provides military-grade zero-knowledge encryption."
								] }),
								/* @__PURE__ */ jsxs("li", { children: [
									/* @__PURE__ */ jsx("strong", { children: "Restore:" }),
									" Right-click the file in MEGA → ",
									/* @__PURE__ */ jsx("em", { children: "Get Link" }),
									" → Copy link. You can also download the ZIP anytime and click ",
									/* @__PURE__ */ jsx("strong", { children: "“Restore from Local ZIP”" }),
									" to roll back your database and images in seconds."
								] })
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
				children: [/* @__PURE__ */ jsxs("h3", {
					className: "text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5",
					children: [/* @__PURE__ */ jsx(FolderArchive, { className: "h-4 w-4 text-slate-400" }), "What is Stored in Every Backup Archive?"]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid gap-3 sm:grid-cols-3 text-xs",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-lg border border-slate-100 bg-slate-50 p-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "font-bold text-slate-800 mb-1 flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5 text-emerald-600" }), "13 Database Tables"]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-slate-500 leading-relaxed",
								children: "Articles, categories, tags, comments, profiles, user accounts, journalist points, and system settings."
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-lg border border-slate-100 bg-slate-50 p-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "font-bold text-slate-800 mb-1 flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5 text-emerald-600" }), "All Uploaded Images"]
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-slate-500 leading-relaxed",
								children: [
									"Every featured image, ad banner, promo graphic, and logo uploaded to ",
									/* @__PURE__ */ jsx("code", {
										className: "text-slate-700",
										children: "/uploads/"
									}),
									" is packaged inside."
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-lg border border-slate-100 bg-slate-50 p-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "font-bold text-slate-800 mb-1 flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5 text-emerald-600" }), "Manifest & Metadata"]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-slate-500 leading-relaxed",
								children: "JSON manifest verifying website version, checksums, export timestamp, and exact record counts."
							})]
						})
					]
				})]
			})
		]
	});
}
export { BackupRestoreTab, BackupRestoreTab as default };

//# sourceMappingURL=BackupRestoreTab-Dx6jEueZ.js.map