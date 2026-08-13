import { X } from "lucide-react";

/**
 * Small overlay button used by both `CoverImageUploader` and
 * `ProductImageUploader` to remove an uploaded image. Extracted because the
 * markup was identical in both places, aside from the click handler.
 */
export function RemoveImageButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute left-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm hover:bg-white"
      aria-label="حذف تصویر"
    >
      <X className="h-3.5 w-3.5" />
    </button>
  );
}
