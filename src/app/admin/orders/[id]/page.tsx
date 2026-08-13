import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { OrderStatusControl } from "@/components/admin/order-status-control";
import { getAdminOrderById } from "@/lib/data/admin-catalog";
import { formatToman, toPersianDigits } from "@/lib/utils";

export const dynamic = "force-dynamic";

function orderTotal(order: { items: { unitPrice: number; quantity: number }[]; discountTotal: number; shippingTotal: number }) {
  const subtotal = order.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  return subtotal - order.discountTotal + order.shippingTotal;
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getAdminOrderById(id);
  if (!order) notFound();

  const subtotal = order.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <>
      <AdminPageHeader title={`سفارش ${order.orderNumber}`} description={`ثبت‌شده در ${new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(new Date(order.createdAt))}`} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="mb-4 text-sm font-bold text-ink">اقلام سفارش</h2>
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-stone">
                  <th className="py-2 font-medium">محصول</th>
                  <th className="py-2 font-medium">رنگ / سایز</th>
                  <th className="py-2 font-medium">تعداد</th>
                  <th className="py-2 font-medium">قیمت واحد</th>
                  <th className="py-2 font-medium">جمع</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-b border-line last:border-none">
                    <td className="py-3 font-medium text-ink">{item.name}</td>
                    <td className="py-3 text-charcoal">
                      {item.color} / {item.size}
                    </td>
                    <td className="py-3 text-charcoal">{toPersianDigits(item.quantity)}</td>
                    <td className="py-3 text-charcoal">{formatToman(item.unitPrice)}</td>
                    <td className="py-3 text-charcoal">{formatToman(item.unitPrice * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between text-stone">
                <span>جمع جزء</span>
                <span>{formatToman(subtotal)}</span>
              </div>
              {order.discountTotal > 0 && (
                <div className="flex justify-between text-stone">
                  <span>تخفیف</span>
                  <span>-{formatToman(order.discountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone">
                <span>هزینه ارسال</span>
                <span>{formatToman(order.shippingTotal)}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-base font-bold text-ink">
                <span>مبلغ نهایی</span>
                <span>{formatToman(orderTotal(order))}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-line bg-white p-6">
            <OrderStatusControl orderId={order.id} initialStatus={order.status} />
          </div>

          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="mb-3 text-sm font-bold text-ink">اطلاعات مشتری</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone">نام</dt>
                <dd className="text-ink">{order.customerName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone">تلفن</dt>
                <dd className="text-ink" dir="ltr">
                  {order.phone}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone">شهر</dt>
                <dd className="text-ink">{order.city}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
