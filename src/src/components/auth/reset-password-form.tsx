"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/validation/auth";
import { resetPassword } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/lib/utils";
import { FormField } from "@/components/ui/form-field";

export function ResetPasswordForm({ token, email }: { token: string; email: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  async function onSubmit(values: ResetPasswordValues) {
    setSubmitting(true);
    const result = await resetPassword(values, email);
    setSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      router.push("/login");
    } else {
      toast.error(result.message);
    }
  }

  if (!token || !email) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-line bg-cream p-6 text-center">
        <p className="text-sm text-danger">لینک بازیابی نامعتبر است.</p>
        <Link href="/forgot-password" className="mt-4 inline-block text-xs font-semibold text-ink hover:underline">
          درخواست لینک جدید
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4 rounded-2xl border border-line bg-cream p-6">
      <input type="hidden" {...register("token")} />
      <FormField label="رمز عبور جدید" error={errors.password?.message}>
        <input type="password" className={inputClass} dir="ltr" {...register("password")} />
      </FormField>
      <FormField label="تکرار رمز عبور جدید" error={errors.confirmPassword?.message}>
        <input type="password" className={inputClass} dir="ltr" {...register("confirmPassword")} />
      </FormField>
      <Button type="submit" className="w-full" size="lg" disabled={submitting}>
        {submitting ? "در حال ذخیره..." : "تغییر رمز عبور"}
      </Button>
    </form>
  );
}
