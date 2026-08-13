"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useCompareStore, MAX_COMPARE } from "@/lib/store/compare-store";
import type { Product } from "@/lib/data/products";
import type { StorefrontCategory } from "@/lib/data/catalog";
import { fetchProductsByIds } from "@/lib/actions/catalog";
import { iconByKey, type HatIconKey } from "@/components/icons/hat-icons";
import { Button } from "@/components/ui/button";
import { formatToman } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";

/**
 * All of the compare page's interactive content (header actions + table).
 * Split out of `app/compare/page.tsx` so that page stays a Server Component
 * — the breadcrumb/SEO markup no longer needs to ship as client JS, and only
 * this part (which depends on the persisted zustand compare list) is client.
 */
export function CompareView({ categories }: { categories: StorefrontCategory[] }) {
  const productIds = useCompareStore((s) => s.productIds);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);

  // Avoid a hydration mismatch — the persisted compare list is only known
  // client-side after mount.
  const mounted = useMounted();

  const [compared, setCompared] = useState<Product[]>([]);
  useEffect(() => {
    if (!mounted) return;
    if (productIds.length === 0) {
      setCompared([]);
      return;
    }
    fetchProductsByIds(productIds).then(setCompared);
  }, [mounted, productIds]);

  return (
    <>
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-display-2 font-extrabold text-paper">مقایسه محصولات</h1>
          <p className="mt-2 text-sm text-paper/70">حداکثر {MAX_COMPARE} محصول را می‌توانید هم‌زمان مقایسه کنید.</p>
        </div>
        {compared.length > 0 && (
          <Button variant="outline-on-dark" size="sm" onClick={clear}>
            پاک کردن مقایسه
          </Button>
        )}
      </header>

      {!mounted ? null : compared.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-cream py-16 text-center">
          <p className="text-sm text-stone">هنوز محصولی برای مقایسه انتخاب نکرده‌اید.</p>
          <Link href="/shop" className="mt-3 inline-block text-sm font-semibold text-ink hover:underline">
            مشاهده فروشگاه
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-cream p-4">
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-32"></th>
                {compared.map((product) => {
                  const Icon = iconByKey[product.icon as HatIconKey];
                  return (
                    <th key={product.id} className="w-56 border-b border-line p-4 text-right align-top">
                      <div className="relative rounded-xl border border-line bg-paper p-4">
                        <button
                          onClick={() => remove(product.id)}
                          aria-label={`حذف ${product.name} از مقایسه`}
                          className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-cream text-stone hover:text-danger"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <Icon className="mx-auto h-20 w-20 text-ink" aria-hidden />
                        <Link href={`/product/${product.slug}`} className="mt-3 block text-sm font-bold text-ink hover:underline">
                          {product.name}
                        </Link>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr>
                <th className="border-b border-line bg-paper p-3 text-right text-xs font-semibold text-stone">قیمت</th>
                {compared.map((p) => (
                  <td key={p.id} className="border-b border-line p-3 font-bold text-ink">
                    {formatToman(p.price)}
                  </td>
                ))}
              </tr>
              <tr>
                <th className="border-b border-line bg-paper p-3 text-right text-xs font-semibold text-stone">دسته‌بندی</th>
                {compared.map((p) => (
                  <td key={p.id} className="border-b border-line p-3 text-charcoal">
                    {categories.find((c) => c.slug === p.category)?.title}
                  </td>
                ))}
              </tr>
              <tr>
                <th className="border-b border-line bg-paper p-3 text-right text-xs font-semibold text-stone">رنگ‌ها</th>
                {compared.map((p) => (
                  <td key={p.id} className="border-b border-line p-3 text-charcoal">
                    {p.variants.map((v) => v.color).join("، ")}
                  </td>
                ))}
              </tr>
              <tr>
                <th className="border-b border-line bg-paper p-3 text-right text-xs font-semibold text-stone">سایزها</th>
                {compared.map((p) => (
                  <td key={p.id} className="border-b border-line p-3 text-charcoal">
                    {Array.from(new Set(p.variants.flatMap((v) => v.sizes))).join("، ")}
                  </td>
                ))}
              </tr>
              <tr>
                <th className="border-b border-line bg-paper p-3 text-right text-xs font-semibold text-stone">موجودی</th>
                {compared.map((p) => (
                  <td key={p.id} className="border-b border-line p-3 text-charcoal">
                    {p.variants.reduce((sum, v) => sum + v.inventory, 0)} عدد
                  </td>
                ))}
              </tr>
              <tr>
                <th className="p-3 text-right text-xs font-semibold text-stone align-top">توضیحات</th>
                {compared.map((p) => (
                  <td key={p.id} className="p-3 text-xs leading-6 text-stone align-top">
                    {p.shortDescription}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
