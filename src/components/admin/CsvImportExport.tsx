import Papa from "papaparse";
import { toast } from "sonner";
import { Download, Upload } from "lucide-react";
import { useRef } from "react";

type Props<T> = {
  data: T[];
  filename: string;
  onImport: (data: T[]) => void;
};

export function CsvImportExport<T>({ data, filename, onImport }: Props<T>) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.error("No data to export");
      return;
    }
    
    try {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.csv`);
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
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".csv"
        ref={fileRef}
        onChange={handleImport}
        className="hidden"
      />
      <button
        onClick={() => fileRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-md bg-white border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
      >
        <Upload className="h-4 w-4" /> Import CSV
      </button>
      <button
        onClick={handleExport}
        className="inline-flex items-center gap-2 rounded-md bg-white border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
      >
        <Download className="h-4 w-4" /> Export CSV
      </button>
    </div>
  );
}
