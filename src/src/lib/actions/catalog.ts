"use server";

import { getProductsByIds } from "@/lib/data/catalog";
import { searchProducts } from "@/lib/data/search";
import type { Product } from "@/lib/data/products";

// Generous upper bound — legitimate callers (wishlist, compare) never send
// more than a handful of ids. This just stops a crafted request to this
// public server action from blowing up the query with an arbitrarily large array.
const MAX_IDS = 100;

/** Used by client components (e.g. the compare page) that only have product
 * ids from client-persisted state (localStorage) and need real product data. */
export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  if (!Array.isArray(ids)) return [];
  return getProductsByIds(ids.slice(0, MAX_IDS));
}

// Small, fixed cap — this powers the header's instant-search dropdown, which
// only ever shows a handful of results plus a "see all" link to /search.
const QUICK_SEARCH_LIMIT = 6;

export async function quickSearchProducts(query: string): Promise<Product[]> {
  if (typeof query !== "string") return [];
  return searchProducts(query, QUICK_SEARCH_LIMIT);
}
