import type { Metadata } from "next";
import { queryProducts, type ShopSearchParams } from "@/lib/data/shop-query";
import { getProductCountsByCategory } from "@/lib/data/catalog";
import { ProductCard } from "@/components/shop/product-card";
import { FilterSidebar } from "@/components/shop/filter-sidebar";
import { SortSelect } from "@/components/shop/sort-select";
import { Pagination } from "@/components/shop/pagination";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { buildMetadata, siteConfig } from "@/lib/seo";
import { toPersianDigits } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const title = page > 1 ? `فروشگاه کلاه — صفحه ${page}` : "فروشگاه — تمام کلاه‌ها";

  return buildMetadata({
    title,
    description:
      "خرید انواع کلاه بیسبالی، باکت، بافت و زمستانی با ارسال به سراسر ایران. جدیدترین مدل‌های کلاه‌لند را اینجا ببینید.",
    path: page > 1 ? `/shop?page=${page}` : "/shop",
  });
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<ShopSearchParams> }) {
  const params = await searchParams;
  const [result, categoryCounts] = await Promise.all([queryProducts(params), getProductCountsByCategory()]);

  return (
    <>
      <Breadcrumbs items={[{ name: "فروشگاه", path: "/shop" }]} />

      {result.page > 1 && <link rel="prev" href={`${siteConfig.url}/shop?page=${result.page - 1}`} />}
      {result.page < result.totalPages && (
        <link rel="next" href={`${siteConfig.url}/shop?page=${result.page + 1}`} />
      )}

      <div className="container py-10">
        <header className="mb-8">
          <h1 className="text-display-2 font-extrabold text-paper">فروشگاه کلاه‌لند</h1>
          <p className="mt-2 text-sm text-paper/70">
            {toPersianDigits(result.total)} محصول موجود — طراحی مینیمال، جنس اصل، ارسال به سراسر ایران.
          </p>
        </header>

        <div className="flex flex-col gap-10 lg:flex-row">
          <FilterSidebar
            basePath="/shop"
            activeMin={params.min}
            activeMax={params.max}
            activeColors={params.colors ? params.colors.split(",").filter(Boolean) : []}
            categoryCounts={categoryCounts}
          />

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xs text-stone">
                نمایش {toPersianDigits(result.items.length)} از {toPersianDigits(result.total)} محصول
              </p>
              <SortSelect current={result.sort} />
            </div>

            {result.items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line py-20 text-center">
                <p className="text-sm text-stone">محصولی با این فیلتر پیدا نشد.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {result.items.map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 4} />
                ))}
              </div>
            )}

            <Pagination
              basePath="/shop"
              currentPage={result.page}
              totalPages={result.totalPages}
              searchParams={params}
            />
          </div>
        </div>
      </div>
    </>
  );
}
