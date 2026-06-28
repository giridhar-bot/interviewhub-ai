"use client";

import { cn } from "@/lib/utils";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { useRef, useState, useCallback } from "react";

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  accept,
  maxSizeMB = 5,
  multiple = false,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const valid = Array.from(files).filter(
        (f) => f.size <= maxSizeMB * 1024 * 1024
      );
      if (valid.length) onFileSelect(valid);
    },
    [maxSizeMB, onFileSelect]
  );

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
        dragOver
          ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20"
          : "border-gray-300 hover:border-gray-400 dark:border-gray-700",
        className
      )}
    >
      <CloudArrowUpIcon className="mb-2 h-8 w-8 text-gray-400" />
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Click or drag to upload
      </p>
      <p className="mt-1 text-xs text-gray-500">Max {maxSizeMB}MB</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );
}
