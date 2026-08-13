import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "ورود به حساب کاربری",
  description: "وارد حساب کاربری کلاه‌لند شوید تا سفارش‌ها، آدرس‌ها و علاقه‌مندی‌های خود را مدیریت کنید.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <AuthShell title="ورود" subtitle="خوش برگشتید! وارد حساب کاربری خود شوید">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
