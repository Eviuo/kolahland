import type { Metadata } from "next";
import { SearchBar } from "@/components/search/search-bar";
import { ProductCard } from "@/components/shop/product-card";
import { searchProducts } from "@/lib/data/search";
import { buildMetadata } from "@/lib/seo";
import { toPersianDigits } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "جستجوی محصولات",
  description: "در میان کلاه‌های کلاه‌لند جستجو کنید.",
  path: "/search",
  noIndex: true, // search result pages are per-query, not meant for indexing
});

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const results = q ? await searchProducts(q) : [];

  return (
    <div className="container py-12">
      <header className="mb-10 text-center">
        <h1 className="text-display-2 font-extrabold text-paper">جستجوی محصولات</h1>
        <div className="mt-6 flex justify-center">
          <SearchBar initialQuery={q} />
        </div>
      </header>

      {!q ? (
        <p className="text-center text-sm text-paper/70">برای مشاهده نتایج، عبارتی را جستجو کنید.</p>
      ) : (
        <>
          <p className="mb-6 text-center text-sm text-paper/70">
            {toPersianDigits(results.length)} نتیجه برای «{q}»
          </p>

          {results.length === 0 ? (
            <div className="mx-auto max-w-md rounded-2xl border border-dashed border-navy-line bg-cream py-16 text-center">
              <p className="text-sm text-stone">چیزی پیدا نشد. عبارت دیگری را امتحان کنید یا فروشگاه را مرور کنید.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {results.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
