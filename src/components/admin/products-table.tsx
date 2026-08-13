"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Pencil, ExternalLink } from "lucide-react";
import { iconByKey } from "@/components/icons/hat-icons";
import { formatToman, toPersianDigits } from "@/lib/utils";
import type { AdminProductRow } from "@/lib/data/admin-catalog";
import { ProductDeleteButton } from "@/components/admin/product-delete-button";

interface ProductsTableProps {
  products: AdminProductRow[];
  categories: { slug: string; title: string }[];
}

export function ProductsTable({ products: initialProducts, categories }: ProductsTableProps) {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery =
        p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || p.categorySlug === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  return (
    <div className="rounded-2xl border border-line bg-white">
      <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی نام یا کد محصول..."
            className="w-full rounded-lg border border-line py-2 pe-9 ps-3 text-sm focus-visible:outline-none focus-visible:border-ink"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink"
        >
          <option value="all">همه دسته‌ها</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.title}
            </option>
          ))}
        </select>
        <span className="text-xs text-stone">{toPersianDigits(filtered.length)} محصول</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-right text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-stone">
              <th className="px-4 py-3 font-medium">محصول</th>
              <th className="px-4 py-3 font-medium">دسته</th>
              <th className="px-4 py-3 font-medium">قیمت</th>
              <th className="px-4 py-3 font-medium">موجودی</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => {
              const Icon = iconByKey[product.icon];
              const stock = product.totalInventory;
              return (
                <tr key={product.id} className="border-b border-line last:border-none hover:bg-paper/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-paper p-2">
                        {product.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Icon className="h-full w-full text-ink" aria-hidden />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-ink">{product.name}</p>
                        <p className="text-[11px] text-stone" dir="ltr">
                          {product.sku}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-charcoal">{product.categoryTitle}</td>
                  <td className="px-4 py-3 text-charcoal">{formatToman(product.price)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        stock === 0
                          ? "bg-red-100 text-red-700"
                          : stock < 15
                            ? "bg-amber-100 text-amber-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {toPersianDigits(stock)} عدد
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-stone hover:bg-ink/5 hover:text-ink"
                        aria-label="مشاهده در سایت"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/products/${product.slug}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-stone hover:bg-ink/5 hover:text-ink"
                        aria-label="ویرایش محصول"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <ProductDeleteButton
                        productId={product.id}
                        productName={product.name}
                        onDeleted={() => setProducts((prev) => prev.filter((p) => p.id !== product.id))}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-10 text-center text-sm text-stone">محصولی پیدا نشد.</p>}
      </div>
    </div>
  );
}
