import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { ProductCard } from "@/components/shop/product-card";
import { getProductsByIds } from "@/lib/data/catalog";
import { buildMetadata } from "@/lib/seo";
import { toPersianDigits } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "علاقه‌مندی‌های من",
  description: "محصولاتی که ذخیره کرده‌اید.",
  path: "/wishlist",
  noIndex: true,
});

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?redirect=/wishlist");

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const displayProducts = await getProductsByIds(items.map((item) => item.productId));

  return (
    <>
      <Breadcrumbs items={[{ name: "علاقه‌مندی‌ها", path: "/wishlist" }]} />

      <div className="container py-12">
        <header className="mb-8">
          <h1 className="text-display-2 font-extrabold text-paper">علاقه‌مندی‌های من</h1>
          <p className="mt-2 text-sm text-paper/70">{toPersianDigits(displayProducts.length)} محصول ذخیره‌شده</p>
        </header>

        {displayProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-cream py-16 text-center">
            <p className="text-sm text-stone">هنوز محصولی به علاقه‌مندی‌ها اضافه نکرده‌اید.</p>
            <Link href="/shop" className="mt-3 inline-block text-sm font-semibold text-ink hover:underline">
              مشاهده فروشگاه
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {displayProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} initialWishlisted priority={index < 4} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
