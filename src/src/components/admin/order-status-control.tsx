"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/lib/actions/admin";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/data/admin";

export function OrderStatusControl({ orderId, initialStatus }: { orderId: string; initialStatus: OrderStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [pending, setPending] = useState(false);

  async function handleChange(next: OrderStatus) {
    setPending(true);
    const result = await updateOrderStatus(orderId, next);
    setPending(false);
    if (result.success) {
      setStatus(next);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div>
      <label htmlFor="order-status" className="mb-1.5 block text-xs font-semibold text-ink">
        وضعیت سفارش
      </label>
      <select
        id="order-status"
        value={status}
        disabled={pending}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
        className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus-visible:outline-none focus-visible:border-ink disabled:opacity-60"
      >
        {Object.entries(ORDER_STATUS_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
