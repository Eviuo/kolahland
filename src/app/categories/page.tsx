import type { Metadata } from "next";
import Link from "next/link";
import { getProductCountsByCategory, getAllCategories } from "@/lib/data/catalog";
import { iconForCategory } from "@/lib/data/category-icons";
import { iconByKey } from "@/components/icons/hat-icons";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { toPersianDigits } from "@/lib/utils";

// Category counts change only when admin adds/edits products — a short ISR
// window means every visitor doesn't re-run the same aggregate query.
export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "دسته‌بندی محصولات",
  description: "همه دسته‌بندی‌های کلاه‌لند در یک نگاه — کلاه بیسبالی، باکت، بافت، زمستانی، مد روز، مردانه و زنانه.",
  path: "/categories",
});

export default async function CategoriesPage() {
  const [categories, counts] = await Promise.all([getAllCategories(), getProductCountsByCategory()]);

  return (
    <>
      <Breadcrumbs items={[{ name: "دسته‌بندی‌ها", path: "/categories" }]} />

      <div className="container py-12">
        <header className="mb-10 max-w-xl">
          <h1 className="text-display-2 font-extrabold text-paper">دسته‌بندی محصولات</h1>
          <p className="mt-3 text-sm leading-8 text-paper/70">همه مدل‌های کلاه‌لند را بر اساس دسته‌بندی مرور کنید.</p>
        </header>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => {
            const Icon = iconByKey[iconForCategory(c.slug)];
            const count = counts[c.slug] ?? 0;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="group flex flex-col items-center gap-4 rounded-2xl border border-line bg-cream p-8 text-center transition-colors hover:border-ink"
              >
                <Icon className="h-16 w-16 text-ink transition-transform group-hover:scale-110" aria-hidden />
                <div>
                  <p className="text-sm font-bold text-ink">{c.title}</p>
                  <p className="mt-1 text-xs text-stone">{c.description}</p>
                  <p className="mt-2 text-[11px] text-stone">{toPersianDigits(count)} محصول</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
