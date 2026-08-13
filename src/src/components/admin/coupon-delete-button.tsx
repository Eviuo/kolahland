"use client";

import { deleteCoupon } from "@/lib/actions/admin";
import { DeleteIconButton } from "@/components/admin/delete-icon-button";

export function CouponDeleteButton({ couponId, couponCode }: { couponId: string; couponCode: string }) {
  return (
    <DeleteIconButton
      ariaLabel="حذف کد تخفیف"
      confirmMessage={`کد تخفیف «${couponCode}» برای همیشه حذف می‌شود و قابل بازگشت نیست. مطمئنی؟`}
      action={() => deleteCoupon(couponId)}
    />
  );
}
