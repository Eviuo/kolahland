import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { formatToman, toPersianDigits } from "@/lib/utils";

export default async function AccountOrdersPage() {
  const session = await auth();
  const orders = await prisma.order.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-paper">سفارش‌های من</h1>
      <p className="mt-1.5 text-sm text-paper/70">{toPersianDigits(orders.length)} سفارش ثبت‌شده</p>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-cream py-16 text-center">
          <p className="text-sm text-stone">هنوز سفارشی ثبت نکرده‌اید.</p>
          <Link href="/shop" className="mt-3 inline-block text-sm font-semibold text-ink hover:underline">
            مشاهده فروشگاه
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-cream p-5 transition-colors hover:border-ink"
            >
              <div>
                <p className="text-sm font-semibold text-ink" dir="ltr">
                  {order.orderNumber}
                </p>
                <p className="mt-1 text-xs text-stone">
                  {new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(order.createdAt)} ·{" "}
                  {toPersianDigits(order.items.length)} قلم
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-ink">{formatToman(order.total)}</span>
                <OrderStatusBadge status={order.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
