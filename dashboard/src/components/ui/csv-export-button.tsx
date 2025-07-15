import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Papa from "papaparse";
import { useState } from "react";

interface CSVExportButtonProps {
  filename: string;
  fetchData: () => Promise<any>;
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
}

export function CSVExportButton({
  filename,
  fetchData,
  className,
  variant = "outline",
  size = "default",
  disabled = false,
}: CSVExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    try {
      setIsLoading(true);

      // Fetch data with high limit
      const data = await fetchData();

      // Convert to CSV
      const csv = Papa.unparse(data, {
        header: true,
        skipEmptyLines: true,
      });

      // Create download link
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      // You might want to show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={disabled || isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? "Exporting..." : "Export CSV"}
      <Download className="h-4 w-4 mr-2" />
    </Button>
  );
}
