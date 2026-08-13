"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validation/auth";
import { requestPasswordReset } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/lib/utils";
import { FormField } from "@/components/ui/form-field";

export function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(values: ForgotPasswordValues) {
    setSubmitting(true);
    const result = await requestPasswordReset(values);
    setSubmitting(false);
    setSent(result.message);
  }

  if (sent) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-line bg-cream p-6 text-center">
        <p className="text-sm leading-7 text-charcoal">{sent}</p>
        <Link href="/login" className="mt-4 inline-block text-xs font-semibold text-ink hover:underline">
          بازگشت به صفحه ورود
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-line bg-cream p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="ایمیل حساب کاربری" error={errors.email?.message}>
          <input className={inputClass} dir="ltr" {...register("email")} placeholder="you@example.com" />
        </FormField>
        <Button type="submit" className="w-full" size="lg" disabled={submitting}>
          {submitting ? "در حال ارسال..." : "ارسال لینک بازیابی"}
        </Button>
      </form>
      <p className="mt-6 text-center text-xs text-stone">
        رمز عبورتان را به یاد آوردید؟{" "}
        <Link href="/login" className="font-semibold text-ink hover:underline">
          وارد شوید
        </Link>
      </p>
    </div>
  );
}
