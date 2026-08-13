"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { changePasswordSchema, type ChangePasswordValues } from "@/lib/validation/account";
import { changePassword } from "@/lib/actions/account";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/lib/utils";
import { FormField } from "@/components/ui/form-field";

export function ChangePasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({ resolver: zodResolver(changePasswordSchema) });

  async function onSubmit(values: ChangePasswordValues) {
    setSubmitting(true);
    const result = await changePassword(values);
    setSubmitting(false);
    if (result.success) {
      toast.success(result.message);
      reset();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4 rounded-2xl border border-line bg-cream p-6">
      <FormField label="رمز عبور فعلی" error={errors.currentPassword?.message}>
        <input type="password" className={inputClass} dir="ltr" {...register("currentPassword")} />
      </FormField>
      <FormField label="رمز عبور جدید" error={errors.newPassword?.message}>
        <input type="password" className={inputClass} dir="ltr" {...register("newPassword")} />
      </FormField>
      <FormField label="تکرار رمز عبور جدید" error={errors.confirmPassword?.message}>
        <input type="password" className={inputClass} dir="ltr" {...register("confirmPassword")} />
      </FormField>
      <Button type="submit" variant="outline" disabled={submitting}>
        {submitting ? "در حال تغییر..." : "تغییر رمز عبور"}
      </Button>
    </form>
  );
}
