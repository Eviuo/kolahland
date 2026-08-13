"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2 } from "lucide-react";
import { uploadBlogCoverImage } from "@/lib/actions/upload";
import { RemoveImageButton } from "@/components/admin/remove-image-button";

interface CoverImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  error?: string;
}

export function CoverImageUploader({ value, onChange, error }: CoverImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadBlogCoverImage(formData);
    setUploading(false);
    if (result.success && result.url) {
      onChange(result.url);
    } else {
      toast.error(result.message);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <p className="mb-1.5 block text-xs font-semibold text-ink">تصویر کاور</p>

      {value ? (
        <div className="relative w-full max-w-xs overflow-hidden rounded-lg border border-line bg-paper">
          <RemoveImageButton onClick={() => onChange("")} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-40 w-full object-cover" />
        </div>
      ) : (
        <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-line px-4 py-2.5 text-xs font-medium text-stone hover:border-ink hover:text-ink">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          {uploading ? "در حال بارگذاری..." : "بارگذاری تصویر کاور (JPG, PNG, WebP)"}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            onChange={(e) => handleFile(e.target.files)}
            className="hidden"
          />
        </label>
      )}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
