import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "ثبت‌نام",
  description: "در کلاه‌لند ثبت‌نام کنید و از خرید سریع‌تر، پیگیری سفارش و پیشنهادهای ویژه بهره‌مند شوید.",
  path: "/register",
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <AuthShell title="ساخت حساب کاربری" subtitle="در کمتر از یک دقیقه عضو کلاه‌لند شوید">
      <RegisterForm />
    </AuthShell>
  );
}
