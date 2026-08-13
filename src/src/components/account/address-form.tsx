"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { addressSchema, type AddressValues } from "@/lib/validation/account";
import { createAddress, updateAddress } from "@/lib/actions/account";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/lib/utils";
import { FormField } from "@/components/ui/form-field";

interface AddressFormProps {
  addressId?: string;
  defaultValues?: Partial<AddressValues>;
  onDone: () => void;
}

export function AddressForm({ addressId, defaultValues, onDone }: AddressFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const isEdit = Boolean(addressId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      province: "",
      city: "",
      postalCode: "",
      addressLine: "",
      isDefault: false,
      ...defaultValues,
    },
  });

  async function onSubmit(values: AddressValues) {
    setSubmitting(true);
    const result = isEdit ? await updateAddress(addressId!, values) : await createAddress(values);
    setSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      onDone();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-line bg-cream p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="نام گیرنده" error={errors.fullName?.message}>
          <input className={inputClass} {...register("fullName")} />
        </FormField>
        <FormField label="شماره موبایل" error={errors.phone?.message}>
          <input className={inputClass} dir="ltr" {...register("phone")} placeholder="09123456789" />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="استان" error={errors.province?.message}>
          <input className={inputClass} {...register("province")} />
        </FormField>
        <FormField label="شهر" error={errors.city?.message}>
          <input className={inputClass} {...register("city")} />
        </FormField>
      </div>

      <FormField label="آدرس کامل" error={errors.addressLine?.message}>
        <textarea className={`${inputClass} min-h-20 resize-y`} {...register("addressLine")} />
      </FormField>

      <div className="max-w-[200px]">
        <FormField label="کد پستی" error={errors.postalCode?.message}>
          <input className={inputClass} dir="ltr" {...register("postalCode")} placeholder="1234567890" />
        </FormField>
      </div>

      <label className="flex items-center gap-2 text-xs text-charcoal">
        <input type="checkbox" {...register("isDefault")} />
        تنظیم به‌عنوان آدرس پیش‌فرض
      </label>

      <div className="flex gap-3 border-t border-line pt-4">
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting ? "در حال ذخیره..." : isEdit ? "ذخیره تغییرات" : "افزودن آدرس"}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onDone}>
          انصراف
        </Button>
      </div>
    </form>
  );
}
