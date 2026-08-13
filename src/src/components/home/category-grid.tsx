import Link from "next/link";
import { getAllCategories, getProductCountsByCategory } from "@/lib/data/catalog";
import { iconForCategory } from "@/lib/data/category-icons";
import { iconByKey } from "@/components/icons/hat-icons";
import { toPersianDigits } from "@/lib/utils";

export async function CategoryGrid() {
  const [categories, counts] = await Promise.all([getAllCategories(), getProductCountsByCategory()]);

  return (
    <section className="border-b border-navy-line bg-navy py-16" aria-labelledby="category-heading">
      <div className="container">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brass">دسته‌بندی‌ها</p>
            <h2 id="category-heading" className="mt-2 text-display-2 font-extrabold text-paper">
              هر استایلی، یک کلاه
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {categories.map((c) => {
            const Icon = iconByKey[iconForCategory(c.slug)];
            const count = counts[c.slug] ?? 0;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-line bg-cream p-5 text-center transition-colors hover:border-brass"
              >
                <Icon className="h-10 w-10 text-ink transition-transform group-hover:scale-110" aria-hidden />
                <span className="text-xs font-semibold text-ink">{c.title}</span>
                <span className="text-[11px] text-stone">{toPersianDigits(count)} محصول</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
