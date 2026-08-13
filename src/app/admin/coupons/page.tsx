import { AdminPageHeader } from "@/components/admin/page-header";
import { CouponForm } from "@/components/admin/coupon-form";
import { CouponToggle } from "@/components/admin/coupon-toggle";
import { CouponDeleteButton } from "@/components/admin/coupon-delete-button";
import { getAdminCoupons } from "@/lib/data/admin-catalog";
import { formatToman, formatPercent, toPersianDigits } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await getAdminCoupons();

  return (
    <>
      <AdminPageHeader title="کدهای تخفیف" description="ایجاد و مدیریت کدهای تخفیف و کمپین‌های فروش ویژه" />

      <div className="mb-6">
        <CouponForm />
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-stone">
              <th className="px-4 py-3 font-medium">کد</th>
              <th className="px-4 py-3 font-medium">مقدار تخفیف</th>
              <th className="px-4 py-3 font-medium">حداقل خرید</th>
              <th className="px-4 py-3 font-medium">استفاده‌شده</th>
              <th className="px-4 py-3 font-medium">انقضا</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-line last:border-none">
                <td className="px-4 py-3 font-semibold text-ink" dir="ltr">
                  {c.code}
                </td>
                <td className="px-4 py-3 text-charcoal">
                  {c.discountType === "PERCENTAGE" ? formatPercent(c.value) : formatToman(c.value)}
                </td>
                <td className="px-4 py-3 text-charcoal">{c.minOrderTotal ? formatToman(c.minOrderTotal) : "—"}</td>
                <td className="px-4 py-3 text-charcoal">
                  {toPersianDigits(c.usedCount)}
                  {c.usageLimit ? ` از ${toPersianDigits(c.usageLimit)}` : ""}
                </td>
                <td className="px-4 py-3 text-stone">
                  {c.expiresAt ? new Intl.DateTimeFormat("fa-IR").format(new Date(c.expiresAt)) : "—"}
                </td>
                <td className="px-4 py-3">
                  <CouponToggle couponId={c.id} initialActive={c.isActive} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end">
                    <CouponDeleteButton couponId={c.id} couponCode={c.code} />
                  </div>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center text-sm text-stone">
                  هنوز کد تخفیفی ثبت نشده.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
