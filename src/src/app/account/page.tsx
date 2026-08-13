import Link from "next/link";
import { Package, MapPin, ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { formatToman, toPersianDigits } from "@/lib/utils";

export default async function AccountOverviewPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [orders, addressCount] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.address.count({ where: { userId } }),
  ]);

  const totalOrders = await prisma.order.count({ where: { userId } });

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-paper">سلام {session!.user.name} 👋</h1>
      <p className="mt-1.5 text-sm text-paper/70">خلاصه‌ای از فعالیت حساب کاربری شما</p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Link
          href="/account/orders"
          className="flex items-center gap-3 rounded-2xl border border-line bg-cream p-5 transition-colors hover:border-ink"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink">
            <Package className="h-5 w-5" strokeWidth={1.7} />
          </div>
          <div>
            <p className="text-xl font-extrabold text-ink">{toPersianDigits(totalOrders)}</p>
            <p className="text-xs text-stone">سفارش ثبت‌شده</p>
          </div>
        </Link>
        <Link
          href="/account/addresses"
          className="flex items-center gap-3 rounded-2xl border border-line bg-cream p-5 transition-colors hover:border-ink"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink">
            <MapPin className="h-5 w-5" strokeWidth={1.7} />
          </div>
          <div>
            <p className="text-xl font-extrabold text-ink">{toPersianDigits(addressCount)}</p>
            <p className="text-xs text-stone">آدرس ثبت‌شده</p>
          </div>
        </Link>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-paper">آخرین سفارش‌ها</h2>
          <Link href="/account/orders" className="flex items-center gap-1 text-xs font-semibold text-paper hover:underline">
            مشاهده همه
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-cream py-14 text-center">
            <p className="text-sm text-stone">هنوز سفارشی ثبت نکرده‌اید.</p>
            <Link href="/shop" className="mt-3 inline-block text-sm font-semibold text-ink hover:underline">
              مشاهده فروشگاه
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between rounded-2xl border border-line bg-cream p-4 transition-colors hover:border-ink"
              >
                <div>
                  <p className="text-sm font-semibold text-ink" dir="ltr">
                    {order.orderNumber}
                  </p>
                  <p className="mt-0.5 text-xs text-stone">
                    {new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-ink">{formatToman(order.total)}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
