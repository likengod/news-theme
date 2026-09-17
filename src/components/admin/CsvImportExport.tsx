import Papa from "papaparse";
import { toast } from "sonner";
import { Download, Upload, ChevronDown } from "lucide-react";
import { useRef, useState, useEffect } from "react";

type Props<T> = {
  data?: T[];
  getData?: () => Promise<T[]>;
  filename: string;
  onImport: (data: T[]) => void;
  iconOnly?: boolean;
};

export function CsvImportExport<T>({ data, getData, filename, onImport, iconOnly }: Props<T>) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = async (mode: "all" | "page") => {
    setShowExportMenu(false);
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
      link.setAttribute("download", `${filename}-${mode}-${new Date().toISOString().split("T")[0]}.csv`);
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
    <div className="flex items-center gap-1.5 sm:gap-2">
      <input type="file" accept=".csv" ref={fileRef} onChange={handleImport} className="hidden" />
      <button
        onClick={() => fileRef.current?.click()}
        title="Import CSV"
        aria-label="Import CSV"
        className={
          iconOnly
            ? "h-9 w-9 inline-flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition shadow-xs shrink-0"
            : "inline-flex items-center gap-1.5 sm:gap-2 rounded-md bg-white border border-slate-200 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition whitespace-nowrap shadow-xs"
        }
      >
        <Upload className={iconOnly ? "h-4 w-4" : "h-3.5 w-3.5 sm:h-4 sm:w-4"} />
        {!iconOnly && " Import CSV"}
      </button>
      
      {getData ? (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            title="Export CSV"
            aria-label="Export CSV"
            className={
              iconOnly
                ? "h-9 w-9 inline-flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition shadow-xs shrink-0"
                : "inline-flex items-center gap-1.5 sm:gap-2 rounded-md bg-white border border-slate-200 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition whitespace-nowrap shadow-xs"
            }
          >
            <Download className={iconOnly ? "h-4 w-4" : "h-3.5 w-3.5 sm:h-4 sm:w-4"} />
            {!iconOnly && (
              <>
                {" "}Export CSV <ChevronDown className="h-3 w-3 opacity-50" />
              </>
            )}
          </button>
          
          {showExportMenu && (
            <div className="absolute right-0 mt-1 w-44 sm:w-48 rounded-md bg-white shadow-lg border border-slate-100 py-1 z-50">
              <button
                onClick={() => handleExport("page")}
                className="w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                Export Current Page
              </button>
              <button
                onClick={() => handleExport("all")}
                className="w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                Export All Data
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => handleExport("page")}
          title="Export CSV"
          aria-label="Export CSV"
          className={
            iconOnly
              ? "h-9 w-9 inline-flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition shadow-xs shrink-0"
              : "inline-flex items-center gap-1.5 sm:gap-2 rounded-md bg-white border border-slate-200 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition whitespace-nowrap shadow-xs"
          }
        >
          <Download className={iconOnly ? "h-4 w-4" : "h-3.5 w-3.5 sm:h-4 sm:w-4"} />
          {!iconOnly && " Export CSV"}
        </button>
      )}
    </div>
  );
}
