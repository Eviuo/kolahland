import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "تغییر رمز عبور",
  description: "تعیین رمز عبور جدید برای حساب کاربری کلاه‌لند.",
  path: "/reset-password",
  noIndex: true,
});

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string; email?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token, email } = await searchParams;

  return (
    <AuthShell title="تعیین رمز عبور جدید" subtitle="یک رمز عبور جدید و امن انتخاب کنید">
      <ResetPasswordForm token={token ?? ""} email={email ?? ""} />
    </AuthShell>
  );
}
