import { useCallback } from "react";
import { CloudUpload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
}

export const FileUploadZone = ({ file, onFileSelect, onFileRemove }: FileUploadZoneProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && droppedFile.type === "application/pdf" && droppedFile.size <= 15 * 1024 * 1024) {
        onFileSelect(droppedFile);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={cn(
        "border-2 border-dashed rounded-xl p-10 transition-all duration-200",
        file
          ? "border-portfolio-gain bg-background dark:bg-card"
          : "border-portfolio-gain/50 bg-muted/30 dark:bg-muted/10 hover:bg-muted/50 dark:hover:bg-muted/20"
      )}
    >
      {file ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FileText className="h-10 w-10 text-portfolio-gain" />
            <div>
              <p className="font-medium text-foreground">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={onFileRemove}
            className="p-2 rounded-full hover:bg-destructive/10 transition-colors"
            aria-label="Remove file"
          >
            <X className="h-5 w-5 text-destructive" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <CloudUpload className="h-12 w-12 text-portfolio-gain mb-4" />
          <p className="text-foreground mb-2">Drag & drop your NSDL CAS PDF here</p>
          <p className="text-sm text-muted-foreground mb-4">or</p>
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="hidden"
            />
            <span className="px-5 py-2.5 rounded-lg border border-portfolio-gain text-portfolio-gain font-semibold hover:bg-portfolio-gain/10 transition-colors inline-block">
              Choose File
            </span>
          </label>
          <p className="text-xs text-muted-foreground mt-3">PDF files only, max 15MB</p>
        </div>
      )}
    </div>
  );
};
