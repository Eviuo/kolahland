import { AdminPageHeader } from "@/components/admin/page-header";
import { CustomerDeleteButton } from "@/components/admin/customer-delete-button";
import { getAdminCustomers } from "@/lib/data/admin-catalog";
import { formatToman, toPersianDigits } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <>
      <AdminPageHeader title="مشتریان" description="فهرست مشتریان ثبت‌نام‌شده و سابقه خرید آن‌ها" />

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-stone">
              <th className="px-4 py-3 font-medium">نام</th>
              <th className="px-4 py-3 font-medium">ایمیل</th>
              <th className="px-4 py-3 font-medium">شهر</th>
              <th className="px-4 py-3 font-medium">تعداد سفارش</th>
              <th className="px-4 py-3 font-medium">مجموع خرید</th>
              <th className="px-4 py-3 font-medium">تاریخ عضویت</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-line last:border-none">
                <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                <td className="px-4 py-3 text-stone" dir="ltr">
                  {c.email}
                </td>
                <td className="px-4 py-3 text-charcoal">{c.city}</td>
                <td className="px-4 py-3 text-charcoal">{toPersianDigits(c.ordersCount)}</td>
                <td className="px-4 py-3 text-charcoal">{formatToman(c.totalSpent)}</td>
                <td className="px-4 py-3 text-stone">{new Intl.DateTimeFormat("fa-IR").format(new Date(c.joinedAt))}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end">
                    <CustomerDeleteButton customerId={c.id} customerName={c.name} ordersCount={c.ordersCount} />
                  </div>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center text-sm text-stone">
                  هنوز مشتری‌ای ثبت‌نام نکرده.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
