import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "فراموشی رمز عبور",
  description: "درخواست بازیابی رمز عبور حساب کاربری کلاه‌لند.",
  path: "/forgot-password",
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="فراموشی رمز عبور" subtitle="ایمیل حساب خود را وارد کنید تا لینک بازیابی برایتان ارسال شود">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
