"use client";

import { Trash2 } from "lucide-react";
import { deleteCategory } from "@/lib/actions/admin";
import { DeleteIconButton } from "@/components/admin/delete-icon-button";

interface CategoryDeleteButtonProps {
  categoryId: string;
  categoryTitle: string;
  productCount: number;
}

export function CategoryDeleteButton({ categoryId, categoryTitle, productCount }: CategoryDeleteButtonProps) {
  if (productCount > 0) {
    return (
      <button
        disabled
        aria-label="این دسته چون محصول دارد قابل حذف نیست"
        title={`این دسته روی ${productCount} محصول ست شده — برای حذف، اول محصولاتش را جابه‌جا یا حذف کن.`}
        className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg text-stone/40"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    );
  }

  return (
    <DeleteIconButton
      ariaLabel="حذف دسته"
      confirmMessage={`دسته «${categoryTitle}» برای همیشه حذف می‌شود و قابل بازگشت نیست. مطمئنی؟`}
      action={() => deleteCategory(categoryId)}
    />
  );
}
