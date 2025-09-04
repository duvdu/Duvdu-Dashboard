import { cn } from "@/lib/utils";
import { MediaPreview } from "./media-preview";
import { useEffect, useRef, useState } from "react";
import {
  Upload,
  X,
  File as FileIcon,
  FileImage,
  FileAudio,
  FileVideo,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

export type DocumentUploaderProps = {
  value?: string | File;
  onChange: (file: File | string | null) => void;
  label?: string;
  accept?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  maxSize?: number;
};

function getKindFromName(
  name: string
): "image" | "video" | "audio" | "pdf" | "text" | "unknown" {
  const lower = name.toLowerCase();
  if (/(\.png|\.jpg|\.jpeg|\.gif|\.bmp|\.webp|\.svg)$/.test(lower))
    return "image";
  if (/(\.mp4|\.webm|\.ogg|\.mov|\.avi|\.wmv|\.flv|\.mkv)$/.test(lower))
    return "video";
  if (/(\.mp3|\.wav|\.ogg|\.aac|\.flac|\.m4a)$/.test(lower)) return "audio";
  if (/\.pdf$/.test(lower)) return "pdf";
  if (/(\.txt|\.md|\.csv|\.json|\.xml|\.yml|\.yaml)$/.test(lower))
    return "text";
  return "unknown";
}

export function DocumentUploader({
  value,
  onChange,
  label = "Document",
  accept = [
    "image/*",
    "video/*",
    "audio/*",
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".xls",
    ".xlsx",
    ".txt",
    ".csv",
    ".json",
  ].join(","),
  className = "",
  disabled = false,
  maxSize = 20 * 1024 * 1024,
  placeholder = "Drop a file here or click to browse",
}: DocumentUploaderProps) {
  const [preview, setPreview] = useState<string | undefined>();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      if (typeof value === "string") {
        setPreview(value);
      } else if (value instanceof File) {
        const kind =
          value.type.startsWith("image/") ||
          value.type.startsWith("video/") ||
          value.type.startsWith("audio/");
        if (kind) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            setPreview(ev.target?.result as string);
          };
          reader.readAsDataURL(value);
        } else {
          setPreview(undefined);
        }
      }
    } else {
      setPreview(undefined);
    }
  }, [value]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    if (file && !disabled && file.size <= maxSize) {
      processFile(file);
    } else if (file && file.size > maxSize) {
      toast.error(
        `File size exceeds the maximum allowed size of ${
          maxSize / 1024 / 1024
        }MB`
      );
    }
  }

  function processFile(file: File) {
    if (file.size > maxSize) {
      toast.error(
        `File size exceeds the maximum allowed size of ${
          maxSize / 1024 / 1024
        }MB`
      );
      return;
    }
    if (
      file.type.startsWith("image/") ||
      file.type.startsWith("video/") ||
      file.type.startsWith("audio/")
    ) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(undefined);
    }
    onChange(file);
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPreview(undefined);
    onChange(null);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  }

  function handleClick() {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function renderFileThumb() {
    if (preview) {
      return (
        <MediaPreview
          className="h-32 w-32 rounded-md object-cover"
          imageClassName="object-cover aspect-square"
          src={preview}
        />
      );
    }
    const name =
      typeof value === "string"
        ? value.split("/").pop() || ""
        : value instanceof File
        ? value.name
        : "";
    const kind = getKindFromName(name);
    const iconClass = "h-8 w-8";
    let Icon = FileIcon;
    if (kind === "image") Icon = FileImage;
    else if (kind === "video") Icon = FileVideo;
    else if (kind === "audio") Icon = FileAudio;
    else if (kind === "pdf" || kind === "text") Icon = FileText;
    return (
      <div className="flex flex-col items-center justify-center h-32 px-6 pt-5 pb-6 border rounded-lg bg-muted/30">
        <Icon className={iconClass} />
        <p className="text-xs text-muted-foreground mt-2 truncate max-w-[180px]">
          {name || "No file selected"}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2 w-fit", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div
        className={cn(
          "relative group cursor-pointer transition-all duration-200",
          disabled && "cursor-not-allowed opacity-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          accept={accept}
          ref={fileInputRef}
          onChange={handleFileChange}
          className="sr-only"
          disabled={disabled}
        />

        {value ? (
          <div className="relative">
            {renderFileThumb()}
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors duration-200 shadow-sm"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ) : (
          <div
            className={cn(
              "flex flex-col items-center justify-center h-32 px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-all duration-200",
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
              "hover:bg-gray-50 dark:hover:bg-gray-800/50"
            )}
          >
            <div className="flex flex-col items-center justify-center">
              <div
                className={cn(
                  "mb-2 transition-colors duration-200",
                  isDragging ? "text-blue-500" : "text-gray-400"
                )}
              >
                <Upload className="h-8 w-8" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {isDragging ? "Drop to upload" : placeholder}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Up to {Math.floor(maxSize / 1024 / 1024)}MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
