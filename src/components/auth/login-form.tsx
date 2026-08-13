"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { loginSchema, type LoginValues } from "@/lib/validation/auth";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/lib/utils";
import { FormField } from "@/components/ui/form-field";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState<"password" | "otp">("password");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    setSubmitting(true);
    const result = await signIn("credentials", { ...values, redirect: false });
    setSubmitting(false);

    if (result?.error) {
      toast.error("ایمیل/شماره موبایل یا رمز عبور اشتباه است.");
      return;
    }

    toast.success("خوش آمدید!");
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-line bg-cream p-6">
      <div className="mb-6 flex rounded-full border border-line bg-cream p-1">
        <button
          onClick={() => setTab("password")}
          className={`flex-1 rounded-full py-2 text-xs font-semibold transition-colors ${
            tab === "password" ? "bg-ink text-paper" : "text-stone"
          }`}
        >
          ورود با رمز عبور
        </button>
        <button
          onClick={() => setTab("otp")}
          className="flex-1 rounded-full py-2 text-xs font-semibold text-stone/50"
          title="ورود با کد پیامکی به‌زودی فعال می‌شود"
        >
          کد پیامکی (به‌زودی)
        </button>
      </div>

      {tab === "otp" ? (
        <p className="rounded-xl border border-dashed border-line bg-cream p-4 text-center text-xs text-stone">
          ورود با کد تأیید پیامکی نیازمند اتصال به سرویس پیامک است و در فاز بعدی فعال می‌شود. فعلاً از ورود با رمز
          عبور استفاده کنید.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="ایمیل یا شماره موبایل" error={errors.identifier?.message}>
            <input className={inputClass} dir="ltr" {...register("identifier")} placeholder="you@example.com" />
          </FormField>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="login-password" className="text-xs font-semibold text-ink">
                رمز عبور
              </label>
              <Link href="/forgot-password" className="text-xs text-stone hover:text-ink hover:underline">
                فراموشی رمز عبور؟
              </Link>
            </div>
            <input id="login-password" type="password" className={inputClass} dir="ltr" {...register("password")} />
            {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            {submitting ? "در حال ورود..." : "ورود"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-xs text-stone">
        حساب کاربری ندارید؟{" "}
        <Link href="/register" className="font-semibold text-ink hover:underline">
          ثبت‌نام کنید
        </Link>
      </p>
    </div>
  );
}
