import { notFound } from "next/navigation";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { PrintInvoiceButton } from "@/components/account/print-invoice-button";
import { formatToman, toPersianDigits } from "@/lib/utils";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment?: string; placed?: string }>;
}

export default async function AccountOrderDetailPage({ params, searchParams }: OrderDetailPageProps) {
  const { id } = await params;
  const { payment, placed } = await searchParams;
  const session = await auth();

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true, variant: true } },
      address: true,
    },
  });

  // Ownership check — a customer must never be able to view another
  // customer's order by guessing/incrementing an id.
  if (!order || order.userId !== session!.user.id) notFound();

  return (
    <div>
      {placed === "1" && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          سفارش شما با موفقیت ثبت شد.
        </div>
      )}
      {payment === "success" && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          پرداخت با موفقیت انجام شد.
        </div>
      )}
      {payment === "failed" && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          <XCircle className="h-4.5 w-4.5 shrink-0" />
          پرداخت انجام نشد یا لغو شد. می‌توانید دوباره تلاش کنید.
        </div>
      )}
      {payment === "error" && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-amber-400/40 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
          در بررسی وضعیت پرداخت مشکلی پیش آمد. اگر مبلغی کسر شده، با پشتیبانی تماس بگیرید.
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-paper" dir="ltr">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-xs text-paper/70">
            ثبت‌شده در {new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <PrintInvoiceButton />
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-cream p-6">
        <h2 className="mb-4 text-sm font-bold text-ink">اقلام سفارش</h2>
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-stone">
              <th className="py-2 font-medium">محصول</th>
              <th className="py-2 font-medium">رنگ / سایز</th>
              <th className="py-2 font-medium">تعداد</th>
              <th className="py-2 font-medium">جمع</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-line last:border-none">
                <td className="py-3 font-medium text-ink">{item.product.name}</td>
                <td className="py-3 text-charcoal">
                  {item.variant.color} / {item.variant.size}
                </td>
                <td className="py-3 text-charcoal">{toPersianDigits(item.quantity)}</td>
                <td className="py-3 text-charcoal">{formatToman(item.unitPrice * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between text-stone">
            <span>جمع جزء</span>
            <span>{formatToman(order.subtotal)}</span>
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
            <span>{formatToman(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-cream p-6">
        <h2 className="mb-3 text-sm font-bold text-ink">آدرس ارسال</h2>
        <p className="text-sm text-charcoal">
          {order.address.fullName} — {order.address.phone}
        </p>
        <p className="mt-1 text-sm text-stone">
          {order.address.province}، {order.address.city}، {order.address.addressLine} — کد پستی{" "}
          {toPersianDigits(order.address.postalCode)}
        </p>
      </div>
    </div>
  );
}
