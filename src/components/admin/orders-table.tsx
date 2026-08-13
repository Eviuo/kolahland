"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { ORDER_STATUS_LABEL, orderTotal, type AdminOrder, type OrderStatus } from "@/lib/data/admin";
import { formatToman, toPersianDigits } from "@/lib/utils";

export function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesQuery =
        o.orderNumber.toLowerCase().includes(query.toLowerCase()) || o.customerName.includes(query);
      const matchesStatus = status === "all" || o.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [orders, query, status]);

  return (
    <div className="rounded-2xl border border-line bg-white">
      <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی شماره سفارش یا نام مشتری..."
            className="w-full rounded-lg border border-line py-2 pe-9 ps-3 text-sm focus-visible:outline-none focus-visible:border-ink"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus | "all")}
          className="rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink"
        >
          <option value="all">همه وضعیت‌ها</option>
          {Object.entries(ORDER_STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <span className="text-xs text-stone">{toPersianDigits(filtered.length)} سفارش</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-right text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-stone">
              <th className="px-4 py-3 font-medium">شماره سفارش</th>
              <th className="px-4 py-3 font-medium">مشتری</th>
              <th className="px-4 py-3 font-medium">شهر</th>
              <th className="px-4 py-3 font-medium">مبلغ</th>
              <th className="px-4 py-3 font-medium">تاریخ</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-line last:border-none hover:bg-paper/60">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium text-ink hover:underline" dir="ltr">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-charcoal">{order.customerName}</td>
                <td className="px-4 py-3 text-charcoal">{order.city}</td>
                <td className="px-4 py-3 text-charcoal">{formatToman(orderTotal(order))}</td>
                <td className="px-4 py-3 text-stone">
                  {new Intl.DateTimeFormat("fa-IR").format(new Date(order.createdAt))}
                </td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-10 text-center text-sm text-stone">سفارشی پیدا نشد.</p>}
      </div>
    </div>
  );
}
