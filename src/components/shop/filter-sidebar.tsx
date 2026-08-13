import Link from "next/link";
import { getAllCategories, getAvailableColors, getPriceRange } from "@/lib/data/catalog";
import { PriceRangeFilter } from "@/components/shop/price-range-filter";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  basePath: string;
  activeCategory?: string;
  activeMin?: string;
  activeMax?: string;
  activeColors?: string[];
  hideCategoryFilter?: boolean;
  categoryCounts?: Record<string, number>;
}

function buildHref(basePath: string, params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const qs = search.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export async function FilterSidebar({
  basePath,
  activeCategory,
  activeMin,
  activeMax,
  activeColors = [],
  hideCategoryFilter,
  categoryCounts = {},
}: FilterSidebarProps) {
  const [categories, availableColors, priceRange] = await Promise.all([
    hideCategoryFilter ? Promise.resolve([]) : getAllCategories(),
    getAvailableColors(),
    getPriceRange(),
  ]);

  // Preserves every other active filter (price) when toggling a color. Category
  // is not included here — on /shop it's never set via this sidebar's own links,
  // and on /category/[slug] it's already part of the path, not a query param.
  function colorHref(colorName: string) {
    const isActive = activeColors.includes(colorName);
    const next = isActive ? activeColors.filter((c) => c !== colorName) : [...activeColors, colorName];
    return buildHref(basePath, {
      min: activeMin,
      max: activeMax,
      colors: next.length > 0 ? next.join(",") : undefined,
    });
  }

  return (
    <aside className="w-full shrink-0 lg:w-64" aria-label="فیلتر محصولات">
      {!hideCategoryFilter && (
        <div className="border-b border-navy-line pb-6">
          <h2 className="mb-4 text-sm font-bold text-paper">دسته‌بندی</h2>
          <ul className="space-y-1">
            <li>
              <Link
                href="/shop"
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition-colors",
                  !activeCategory ? "bg-brass text-paper" : "text-paper/70 hover:bg-paper/10"
                )}
              >
                همه محصولات
              </Link>
            </li>
            {categories.map((c) => {
              const count = categoryCounts[c.slug] ?? 0;
              const active = activeCategory === c.slug;
              return (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                      active ? "bg-brass text-paper" : "text-paper/70 hover:bg-paper/10"
                    )}
                  >
                    <span>{c.title}</span>
                    <span className={cn("text-xs", active ? "text-paper/70" : "text-paper/40")}>{count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {availableColors.length > 0 && (
        <div className="border-b border-navy-line py-6">
          <h2 className="mb-4 text-sm font-bold text-paper">رنگ</h2>
          <ul className="flex flex-wrap gap-2">
            {availableColors.map((color) => {
              const active = activeColors.includes(color.name);
              return (
                <li key={color.name}>
                  <Link
                    href={colorHref(color.name)}
                    aria-pressed={active}
                    aria-label={`رنگ ${color.name}`}
                    title={color.name}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors",
                      active ? "border-brass" : "border-transparent hover:border-paper/30"
                    )}
                  >
                    <span
                      className="h-6 w-6 rounded-full border border-paper/20"
                      style={{ backgroundColor: color.hex }}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="pt-6">
        <h2 className="mb-4 text-sm font-bold text-paper">محدوده قیمت</h2>
        <PriceRangeFilter bounds={priceRange} activeMin={activeMin} activeMax={activeMax} />
      </div>
    </aside>
  );
}
