"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteProduct } from "@/lib/actions/admin";

interface ProductDeleteButtonProps {
  productId: string;
  productName: string;
  /** Called after a successful delete — lets the table drop the row locally. */
  onDeleted?: () => void;
  /** "icon": compact icon-only button for table rows. "full": labeled button for the edit page. */
  variant?: "icon" | "full";
  /** If set, navigate here after a successful delete instead of just refreshing
   * (needed on the edit page itself, since that route stops existing). */
  redirectTo?: string;
}

export function ProductDeleteButton({ productId, productName, onDeleted, variant = "icon", redirectTo }: ProductDeleteButtonProps) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(
      `محصول «${productName}» برای همیشه حذف می‌شود و قابل بازگشت نیست. مطمئنی؟`
    );
    if (!confirmed) return;

    setPending(true);
    const result = await deleteProduct(productId);
    setPending(false);

    if (result.success) {
      toast.success(result.message);
      onDeleted?.();
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.refresh();
      }
    } else {
      // Covers the "used in past orders" case too — the message from the
      // action already explains why and what to do instead (archive it).
      toast.error(result.message);
    }
  }

  if (variant === "full") {
    return (
      <button
        onClick={handleDelete}
        disabled={pending}
        className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-60"
      >
        <Trash2 className="h-4 w-4" />
        {pending ? "در حال حذف..." : "حذف محصول"}
      </button>
    );
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      aria-label="حذف محصول"
      title="حذف محصول"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-stone transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
