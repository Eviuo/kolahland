import type { Product, ProductCategorySlug } from "@/lib/data/products";

/**
 * Client-safe constants/types for the shop query system.
 *
 * These are split out from `shop-query.ts` because that file imports
 * `prisma` (which pulls in `pg` / Node's `fs` module). Any file that ends
 * up in a client bundle — directly or through an import chain — must not
 * import from `shop-query.ts`. Import from here instead.
 */

export const SORT_OPTIONS = [
  { value: "featured", label: "پیشنهادی" },
  { value: "newest", label: "جدیدترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export const PAGE_SIZE = 8;

export interface ShopSearchParams {
  category?: string;
  sort?: string;
  page?: string;
  min?: string;
  max?: string;
  colors?: string;
}

export interface ShopQueryResult {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
  sort: SortValue;
}

export type { ProductCategorySlug };
