import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/sidebar";

// Admin routes must never be indexed — enforced here and in robots.ts.
export const metadata: Metadata = {
  title: "پنل مدیریت | کلاه‌لند",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?redirect=/admin/products");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <AdminSidebar />
      <div className="flex-1">
        <main className="container max-w-none px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
