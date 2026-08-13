"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { couponFormSchema, type CouponFormValues } from "@/lib/validation/admin";
import { createCoupon } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/lib/utils";

export function CouponForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: { discountType: "PERCENTAGE" },
  });

  async function onSubmit(values: CouponFormValues) {
    setSubmitting(true);
    const result = await createCoupon(values);
    setSubmitting(false);
    if (result.success) {
      toast.success(result.message);
      reset();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-2xl border border-line bg-white p-5 sm:grid-cols-5">
      <div>
        <input className={inputClass} dir="ltr" placeholder="کد تخفیف" aria-label="کد تخفیف" {...register("code")} />
        {errors.code && <p className="mt-1 text-xs text-danger">{errors.code.message}</p>}
      </div>
      <div>
        <select className={inputClass} aria-label="نوع تخفیف" {...register("discountType")}>
          <option value="PERCENTAGE">درصدی</option>
          <option value="FIXED_AMOUNT">مبلغ ثابت</option>
        </select>
      </div>
      <div>
        <input type="number" className={inputClass} placeholder="مقدار" aria-label="مقدار تخفیف" {...register("value")} />
        {errors.value && <p className="mt-1 text-xs text-danger">{errors.value.message}</p>}
      </div>
      <div>
        <input
          type="number"
          className={inputClass}
          placeholder="حداقل سبد خرید"
          aria-label="حداقل سبد خرید"
          {...register("minOrderTotal")}
        />
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? "در حال ذخیره..." : "ساخت کد تخفیف"}
      </Button>
    </form>
  );
}
