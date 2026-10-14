import Papa from "papaparse";
import { toast } from "sonner";
import {
  Download,
  ChevronDown,
  ArrowUpDown,
  FileSpreadsheet,
  FileUp,
} from "lucide-react";
import { useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type Props<T> = {
  data?: T[];
  getData?: () => Promise<T[]>;
  filename: string;
  onImport: (data: T[]) => void;
  iconOnly?: boolean;
};

export function CsvImportExport<T>({
  data,
  getData,
  filename,
  onImport,
  iconOnly,
}: Props<T>) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = async (mode: "all" | "page") => {
    try {
      let exportData = data;
      if (mode === "all" && getData) {
        exportData = await getData();
      }

      if (!exportData || exportData.length === 0) {
        toast.error("No data to export");
        return;
      }

      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${filename}-${mode}-${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Export successful (${exportData.length} ${filename})`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to export data");
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          onImport(results.data as T[]);
          toast.success(`Successfully imported ${results.data.length} rows`);
        } catch (err: any) {
          toast.error(err.message || "Failed to process imported data");
        }

        // Reset file input
        if (fileRef.current) fileRef.current.value = "";
      },
      error: (error) => {
        console.error(error);
        toast.error("Failed to read file");
        if (fileRef.current) fileRef.current.value = "";
      },
    });
  };

  return (
    <div className="inline-flex items-center">
      <input
        type="file"
        accept=".csv"
        ref={fileRef}
        onChange={handleImport}
        className="hidden"
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            title="Import or Export CSV Data"
            aria-label="Import or Export CSV Data"
            className={
              iconOnly
                ? "h-9 w-9 inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-2xs shrink-0 cursor-pointer"
                : "inline-flex items-center gap-1.5 sm:gap-2 rounded-md sm:rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition whitespace-nowrap shadow-2xs cursor-pointer"
            }
          >
            <ArrowUpDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600 dark:text-slate-400 shrink-0" />
            {!iconOnly && <span>Import / Export</span>}
            <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-400 shrink-0" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 p-1.5 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-lg">
          <DropdownMenuLabel className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider px-2 py-1">
            CSV Actions
          </DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer rounded-md transition"
          >
            <FileUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="flex flex-col">
              <span className="font-semibold text-slate-800 dark:text-slate-100">Import CSV</span>
              <span className="text-[10px] text-slate-400">Upload & merge data</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />

          <DropdownMenuItem
            onClick={() => handleExport("page")}
            className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer rounded-md transition"
          >
            <Download className="h-4 w-4 text-slate-600 dark:text-slate-400 shrink-0" />
            <div className="flex flex-col">
              <span className="font-semibold text-slate-800 dark:text-slate-100">Export Current Page</span>
              <span className="text-[10px] text-slate-400">Export visible table rows</span>
            </div>
          </DropdownMenuItem>

          {getData && (
            <DropdownMenuItem
              onClick={() => handleExport("all")}
              className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer rounded-md transition"
            >
              <FileSpreadsheet className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div className="flex flex-col">
                <span className="font-semibold text-slate-800 dark:text-slate-100">Export All Data</span>
                <span className="text-[10px] text-slate-400">Download all database records</span>
              </div>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
