"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { registerSchema, type RegisterValues } from "@/lib/validation/auth";
import { registerUser } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/lib/utils";
import { FormField } from "@/components/ui/form-field";

export function RegisterForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterValues) {
    setSubmitting(true);
    const result = await registerUser(values);

    if (!result.success) {
      setSubmitting(false);
      toast.error(result.message);
      return;
    }

    const signInResult = await signIn("credentials", {
      identifier: values.email,
      password: values.password,
      redirect: false,
    });
    setSubmitting(false);

    if (signInResult?.error) {
      toast.success("ثبت‌نام انجام شد. اکنون وارد شوید.");
      router.push("/login");
      return;
    }

    toast.success("به کلاه‌لند خوش آمدید!");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-line bg-cream p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="نام و نام خانوادگی" error={errors.name?.message}>
          <input className={inputClass} {...register("name")} />
        </FormField>

        <FormField label="ایمیل" error={errors.email?.message}>
          <input className={inputClass} dir="ltr" {...register("email")} placeholder="you@example.com" />
        </FormField>

        <FormField label="شماره موبایل" error={errors.phone?.message}>
          <input className={inputClass} dir="ltr" {...register("phone")} placeholder="09123456789" />
        </FormField>

        <FormField label="رمز عبور" error={errors.password?.message}>
          <input type="password" className={inputClass} dir="ltr" {...register("password")} />
        </FormField>

        <FormField label="تکرار رمز عبور" error={errors.confirmPassword?.message}>
          <input type="password" className={inputClass} dir="ltr" {...register("confirmPassword")} />
        </FormField>

        <label className="flex items-start gap-2 text-xs text-charcoal">
          <input type="checkbox" className="mt-0.5" {...register("acceptTerms")} />
          <span>
            <Link href="/terms" className="font-semibold text-ink hover:underline">
              قوانین و مقررات
            </Link>{" "}
            و{" "}
            <Link href="/privacy-policy" className="font-semibold text-ink hover:underline">
              حریم خصوصی
            </Link>{" "}
            را می‌پذیرم
          </span>
        </label>
        {errors.acceptTerms && <p className="text-xs text-danger">{errors.acceptTerms.message}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={submitting}>
          {submitting ? "در حال ثبت‌نام..." : "ثبت‌نام"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-stone">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <Link href="/login" className="font-semibold text-ink hover:underline">
          وارد شوید
        </Link>
      </p>
    </div>
  );
}
