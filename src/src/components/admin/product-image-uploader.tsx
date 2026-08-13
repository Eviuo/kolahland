"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2 } from "lucide-react";
import { uploadProductImage } from "@/lib/actions/upload";
import { RemoveImageButton } from "@/components/admin/remove-image-button";

export interface ProductImageValue {
  url: string;
  altText: string;
}

interface ProductImageUploaderProps {
  images: ProductImageValue[];
  onChange: (images: ProductImageValue[]) => void;
}

export function ProductImageUploader({ images, onChange }: ProductImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);

    // Accumulate locally so selecting several files at once doesn't lose
    // earlier uploads to a stale `images` closure.
    let next = [...images];
    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadProductImage(formData);
      if (result.success && result.url) {
        next = [...next, { url: result.url, altText: "" }];
        onChange(next);
      } else {
        toast.error(result.message);
      }
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function updateAltText(index: number, altText: string) {
    onChange(images.map((img, i) => (i === index ? { ...img, altText } : img)));
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <p className="mb-1.5 block text-xs font-semibold text-ink">تصاویر محصول</p>

      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((img, index) => (
            <div key={img.url} className="relative overflow-hidden rounded-lg border border-line bg-paper">
              <RemoveImageButton onClick={() => removeImage(index)} />
              {/* Local/uploaded product photos — plain <img> keeps the admin
                  panel independent of next/image remote-pattern config. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.altText} className="h-28 w-full object-cover" />
              <input
                value={img.altText}
                onChange={(e) => updateAltText(index, e.target.value)}
                placeholder="متن جایگزین (alt)"
                className="w-full border-t border-line bg-white px-2 py-1.5 text-xs text-ink focus-visible:outline-none"
              />
            </div>
          ))}
        </div>
      )}

      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-line px-4 py-2.5 text-xs font-medium text-stone hover:border-ink hover:text-ink">
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        {uploading ? "در حال بارگذاری..." : "افزودن تصویر (JPG, PNG, WebP — حداکثر ۵ مگابایت)"}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </label>
    </div>
  );
}
