import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AccountSidebar } from "@/components/account/sidebar";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";

export const metadata: Metadata = {
  title: "حساب کاربری | کلاه‌لند",
  robots: { index: false, follow: false },
};

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?redirect=/account");
  }

  return (
    <>
      <Breadcrumbs items={[{ name: "حساب کاربری", path: "/account" }]} />
      <div className="container py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <AccountSidebar />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  );
}
