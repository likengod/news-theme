import { useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
//#region src/components/admin/CsvImportExport.tsx
function CsvImportExport({ data, getData, filename, onImport }) {
	const fileRef = useRef(null);
	const handleExport = async () => {
		try {
			let exportData = data;
			if (getData) exportData = await getData();
			if (!exportData || exportData.length === 0) {
				toast.error("No data to export");
				return;
			}
			const csv = Papa.unparse(exportData);
			const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
			const link = document.createElement("a");
			const url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute("download", `${filename}-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			toast.success("Export successful!");
		} catch (e) {
			console.error(e);
			toast.error("Failed to export data");
		}
	};
	const handleImport = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				if (results.errors.length > 0) {
					console.error("CSV Parse Errors:", results.errors);
					toast.error("Error parsing CSV file");
					return;
				}
				try {
					onImport(results.data);
					toast.success(`Successfully imported ${results.data.length} rows`);
				} catch (err) {
					toast.error(err.message || "Failed to process imported data");
				}
				if (fileRef.current) fileRef.current.value = "";
			},
			error: (error) => {
				console.error(error);
				toast.error("Failed to read file");
				if (fileRef.current) fileRef.current.value = "";
			}
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-2",
		children: [
			/* @__PURE__ */ jsx("input", {
				type: "file",
				accept: ".csv",
				ref: fileRef,
				onChange: handleImport,
				className: "hidden"
			}),
			/* @__PURE__ */ jsxs("button", {
				onClick: () => fileRef.current?.click(),
				className: "inline-flex items-center gap-2 rounded-md bg-white border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition",
				children: [/* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }), " Import CSV"]
			}),
			/* @__PURE__ */ jsxs("button", {
				onClick: handleExport,
				className: "inline-flex items-center gap-2 rounded-md bg-white border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition",
				children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Export CSV"]
			})
		]
	});
}
//#endregion
export { CsvImportExport as t };
