import { prisma } from "@/lib/prisma";
import { mapProduct, PRODUCT_LISTING_INCLUDE } from "@/lib/data/catalog";
import type { ProductCategorySlug } from "@/lib/data/products";
import {
  SORT_OPTIONS,
  PAGE_SIZE,
  type SortValue,
  type ShopSearchParams,
  type ShopQueryResult,
} from "@/lib/data/shop-query-options";

/**
 * This module imports `prisma`, which pulls in `pg` (a Node-only package
 * that touches `fs`). It must only ever be imported from Server Components
 * or other server-only code (route handlers, server actions).
 *
 * Client Components must import constants/types from
 * `@/lib/shop-query-options` instead — never from this file — or Next.js
 * will try to bundle `pg`/`fs` into the browser build and fail with
 * "Module not found: Can't resolve 'fs'".
 */

export { SORT_OPTIONS, PAGE_SIZE };
export type { SortValue, ShopSearchParams, ShopQueryResult };

/** Filters, sorts, and paginates the catalog for /shop and /category/[slug]. */
export async function queryProducts(
  params: ShopSearchParams,
  forcedCategory?: ProductCategorySlug
): Promise<ShopQueryResult> {
  const category = forcedCategory ?? (params.category as ProductCategorySlug | undefined);
  const min = params.min && Number.isFinite(Number(params.min)) ? Number(params.min) : undefined;
  const max = params.max && Number.isFinite(Number(params.max)) ? Number(params.max) : undefined;
  const colors = params.colors
    ? params.colors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : [];
  const sort = (SORT_OPTIONS.find((o) => o.value === params.sort)?.value ?? "featured") as SortValue;

  const where = {
    status: "PUBLISHED" as const,
    ...(category ? { category: { slug: category } } : {}),
    ...(min !== undefined || max !== undefined
      ? { price: { ...(min !== undefined ? { gte: min } : {}), ...(max !== undefined ? { lte: max } : {}) } }
      : {}),
    ...(colors.length > 0 ? { variants: { some: { color: { in: colors } } } } : {}),
  };

  // "newest" and "featured" (no separate signal yet) both fall back to recency.
  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
        ? { price: "desc" as const }
        : { createdAt: "desc" as const };

  const total = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(params.page) || 1), totalPages);

  const rows = await prisma.product.findMany({
    where,
    include: PRODUCT_LISTING_INCLUDE,
    orderBy,
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return { items: rows.map(mapProduct), total, page, totalPages, sort };
}
