"use client";

import { Trash2 } from "lucide-react";
import { deleteCustomer } from "@/lib/actions/admin";
import { DeleteIconButton } from "@/components/admin/delete-icon-button";
import { toPersianDigits } from "@/lib/utils";

interface CustomerDeleteButtonProps {
  customerId: string;
  customerName: string;
  ordersCount: number;
}

export function CustomerDeleteButton({ customerId, customerName, ordersCount }: CustomerDeleteButtonProps) {
  if (ordersCount > 0) {
    return (
      <button
        disabled
        aria-label="این مشتری چون سفارش ثبت‌شده دارد قابل حذف نیست"
        title={`این مشتری ${toPersianDigits(ordersCount)} سفارش ثبت‌شده دارد و برای حفظ سابقه قابل حذف نیست.`}
        className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg text-stone/40"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    );
  }

  return (
    <DeleteIconButton
      ariaLabel="حذف مشتری"
      confirmMessage={`حساب «${customerName}» برای همیشه حذف می‌شود — آدرس‌ها، سبد خرید و علاقه‌مندی‌هایش هم پاک می‌شود. قابل بازگشت نیست. مطمئنی؟`}
      action={() => deleteCustomer(customerId)}
    />
  );
}
