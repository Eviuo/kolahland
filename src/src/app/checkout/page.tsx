import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CheckoutClient } from "@/components/checkout/checkout-client";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "تسویه‌حساب",
  description: "تکمیل خرید و ثبت سفارش در کلاه‌لند.",
  path: "/checkout",
  noIndex: true,
});

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?redirect=/checkout");

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <Breadcrumbs items={[{ name: "تسویه‌حساب", path: "/checkout" }]} />
      <div className="container py-10">
        <h1 className="mb-8 text-display-2 font-extrabold text-paper">تسویه‌حساب</h1>
        <CheckoutClient addresses={addresses} />
      </div>
    </>
  );
}
