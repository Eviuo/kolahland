"use client";

import { useState } from "react";
import { toast } from "sonner";
import { toggleCouponStatus } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

export function CouponToggle({ couponId, initialActive }: { couponId: string; initialActive: boolean }) {
  const [active, setActive] = useState(initialActive);
  const [pending, setPending] = useState(false);

  async function handleToggle() {
    setPending(true);
    const next = !active;
    const result = await toggleCouponStatus(couponId, next);
    setPending(false);
    if (result.success) {
      setActive(next);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      aria-pressed={active}
      className={cn(
        "rounded-full px-3 py-1 text-[11px] font-semibold transition-colors disabled:opacity-60",
        active ? "bg-green-100 text-green-800" : "bg-stone-200 text-stone-600"
      )}
    >
      {active ? "فعال" : "غیرفعال"}
    </button>
  );
}
