"use client";

import { deleteBrand } from "@/lib/actions/admin";
import { DeleteIconButton } from "@/components/admin/delete-icon-button";
import { toPersianDigits } from "@/lib/utils";

interface BrandDeleteButtonProps {
  brandId: string;
  brandName: string;
  productCount: number;
}

export function BrandDeleteButton({ brandId, brandName, productCount }: BrandDeleteButtonProps) {
  const confirmMessage =
    productCount > 0
      ? `برند «${brandName}» برای همیشه حذف می‌شود. ${toPersianDigits(productCount)} محصول مرتبط با این برند، بدون برند می‌مانند (خودشان حذف نمی‌شوند). مطمئنی؟`
      : `برند «${brandName}» برای همیشه حذف می‌شود و قابل بازگشت نیست. مطمئنی؟`;

  return <DeleteIconButton ariaLabel="حذف برند" confirmMessage={confirmMessage} action={() => deleteBrand(brandId)} />;
}
