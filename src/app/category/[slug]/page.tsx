import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { queryProducts, type ShopSearchParams } from "@/lib/data/shop-query";
import { getProductCountsByCategory, getAllCategories, getCategoryBySlug } from "@/lib/data/catalog";
import { ProductCard } from "@/components/shop/product-card";
import { FilterSidebar } from "@/components/shop/filter-sidebar";
import { SortSelect } from "@/components/shop/sort-select";
import { Pagination } from "@/components/shop/pagination";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { buildMetadata, jsonLdScript, siteConfig } from "@/lib/seo";
import { toPersianDigits } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ShopSearchParams>;
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  const { page } = await searchParams;
  const pageNum = Number(page) || 1;

  return buildMetadata({
    title: pageNum > 1 ? `${category.title} — صفحه ${pageNum}` : `${category.title} | خرید آنلاین`,
    description: `${category.description} خرید آنلاین ${category.title} با ضمانت اصالت کالا و ارسال سریع به سراسر ایران — کلاه‌لند.`,
    path: pageNum > 1 ? `/category/${slug}?page=${pageNum}` : `/category/${slug}`,
  });
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const sp = await searchParams;
  const [result, categoryCounts] = await Promise.all([
    queryProducts(sp, slug),
    getProductCountsByCategory(),
  ]);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "فروشگاه", path: "/shop" },
          { name: category.title, path: `/category/${slug}` },
        ]}
      />

      {result.page > 1 && (
        <link rel="prev" href={`${siteConfig.url}/category/${slug}?page=${result.page - 1}`} />
      )}
      {result.page < result.totalPages && (
        <link rel="next" href={`${siteConfig.url}/category/${slug}?page=${result.page + 1}`} />
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: category.title,
          description: category.description,
          url: `${siteConfig.url}/category/${slug}`,
        })}
      />

      <div className="container py-10">
        <header className="mb-8 max-w-2xl">
          <h1 className="text-display-2 font-extrabold text-paper">{category.title}</h1>
          <p className="mt-3 text-sm leading-7 text-paper/70">{category.description}</p>
        </header>

        <div className="flex flex-col gap-10 lg:flex-row">
          <FilterSidebar
            basePath={`/category/${slug}`}
            activeCategory={slug}
            activeMin={sp.min}
            activeMax={sp.max}
            activeColors={sp.colors ? sp.colors.split(",").filter(Boolean) : []}
            categoryCounts={categoryCounts}
          />

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xs text-stone">{toPersianDigits(result.total)} محصول</p>
              <SortSelect current={result.sort} />
            </div>

            {result.items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line py-20 text-center">
                <p className="text-sm text-stone">فعلاً محصولی در این دسته با این فیلتر موجود نیست.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {result.items.map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 4} />
                ))}
              </div>
            )}

            <Pagination
              basePath={`/category/${slug}`}
              currentPage={result.page}
              totalPages={result.totalPages}
              searchParams={sp}
            />
          </div>
        </div>
      </div>
    </>
  );
}
