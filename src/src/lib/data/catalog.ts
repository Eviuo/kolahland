import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { iconForCategory } from "@/lib/data/category-icons";
import type { HatIcon, Product, ProductCategorySlug, ProductVariant } from "@/lib/data/products";

/**
 * The whole public storefront (`/shop`, `/category/[slug]`, `/product/[slug]`,
 * search, related products, wishlist, compare, sitemap, 404 suggestions)
 * reads through this module instead of the static `lib/data/products.ts`
 * catalog, which is intentionally empty (see `products.ts`). Shapes here
 * mirror the mock `Product`/`ProductVariant` types so components written
 * against the mock catalog (ProductCard, ProductPurchasePanel, ...) don't
 * need to change.
 *
 * Prisma stores one row per color+size combination; the storefront UI
 * groups by color and shows one stock number per color (sum across that
 * color's sizes) — the same simplification the original mock catalog used.
 */

// A plain structural shape (not Prisma's generated GetPayload types) so this
// keeps compiling regardless of exactly how the `prisma-client` generator
// names its utility types — every query below includes at least these
// fields, and TS structural typing accepts the extra ones for free.
export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  createdAt: Date;
  category: { slug: string };
  // Optional (not just nullable) on purpose: some callers' `findMany`/`findUnique`
  // calls pass `PRODUCT_LISTING_INCLUDE` through an imported reference rather than
  // an inline literal, and in that shape TypeScript doesn't always narrow the
  // resulting row type to include every relation key from the shared constant.
  // Making this optional (mapProduct already reads it via `p.brand?.name`) keeps
  // every real call site — which does include brand at runtime — compiling
  // correctly without relying on that cross-module inference always lining up.
  brand?: { name: string } | null;
  variants: { id: string; color: string; colorHex: string; size: string; inventory: number }[];
  images: { url: string; altText: string }[];
}

// Shared `include` for every customer-facing product listing/detail query
// below. `mapProduct()` only ever reads the fields selected here — the
// previous version used bare `include: { category: true, variants: true,
// images: {...} }`, which pulls every column of Category and every column
// of ProductVariant (including columns no caller uses, like
// `category.seoDescription` or `variant.priceDelta`) for every row, on
// every request. Trimming this to just the needed fields cuts DB I/O and
// network payload, especially for variants (a product can have many rows).
export const PRODUCT_LISTING_INCLUDE = {
  category: { select: { slug: true } },
  brand: { select: { name: true } },
  variants: { select: { id: true, color: true, colorHex: true, size: true, inventory: true } },
  images: { select: { url: true, altText: true }, orderBy: { position: "asc" } },
} as const;

export function mapProduct(p: ProductRow): Product {
  const byColor = new Map<string, ProductVariant>();
  for (const v of p.variants) {
    const existing = byColor.get(v.color);
    if (existing) {
      existing.sizes.push(v.size);
      existing.inventory += v.inventory;
    } else {
      byColor.set(v.color, { id: v.id, color: v.color, colorHex: v.colorHex, sizes: [v.size], inventory: v.inventory });
    }
  }
  const variants =
    byColor.size > 0
      ? Array.from(byColor.values())
      : [{ id: p.id, color: "پیش‌فرض", colorHex: "#111111", sizes: ["یک‌سایز"], inventory: 0 }];

  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  const isNew = Date.now() - p.createdAt.getTime() < THIRTY_DAYS;

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    description: p.description,
    category: p.category.slug as ProductCategorySlug,
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? undefined,
    sku: p.sku,
    isNew,
    // No sales-based signal available yet (would need order aggregation).
    isBestSeller: false,
    variants,
    icon: iconForCategory(p.category.slug) as HatIcon,
    images: p.images,
    brand: p.brand?.name,
  };
}

export async function getAllProducts(limit?: number): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    include: PRODUCT_LISTING_INCLUDE,
    orderBy: { createdAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });
  return rows.map(mapProduct);
}

/** A handful of products per category, for the homepage's per-category
 * sections (one row of products under each category heading). */
export async function getProductsByCategorySlug(slug: string, limit: number): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { status: "PUBLISHED", category: { slug } },
    include: PRODUCT_LISTING_INCLUDE,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(mapProduct);
}

// For `generateStaticParams` and the sitemap, which only ever read `.slug`
// off every product — fetching the full listing payload (variants, images,
// category) for that is pure waste.
export async function getAllProductSlugs(): Promise<{ slug: string }[]> {
  return prisma.product.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
}

// Wrapped in `cache()` because `app/product/[slug]/page.tsx` calls this once
// from `generateMetadata` and again from the page component — without this,
// every single product-page view ran the identical query twice.
export const getProductBySlug = cache(async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const row = await prisma.product.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: PRODUCT_LISTING_INCLUDE,
  });
  return row ? mapProduct(row) : null;
});

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { status: "PUBLISHED", category: { slug: product.category }, NOT: { id: product.id } },
    include: PRODUCT_LISTING_INCLUDE,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapProduct);
}

export interface StorefrontCategory {
  id: string;
  slug: string;
  title: string;
  description: string;
}

/**
 * The real source of truth for "which categories exist" — previously,
 * `/categories`, `/category/[slug]`, the footer, and the shop filter
 * sidebar all read from a hardcoded 7-item array in `lib/data/products.ts`
 * instead of the database. That array is only ever used to *seed* the
 * `Category` table (see `prisma/seed.ts`) — after seeding, the database is
 * meant to be authoritative, which is exactly what `createCategory` in the
 * admin panel assumes. Because nothing on the storefront actually queried
 * it, any category created after the initial seed was invisible: its page
 * 404'd and it never appeared in navigation.
 *
 * Cached (independent of any page's own dynamic/static rendering mode)
 * since the category list changes only when an admin adds one — no reason
 * to re-query on every request across every route that shows it, including
 * fully dynamic ones like checkout/account.
 */
export const getAllCategories = unstable_cache(
  async (): Promise<StorefrontCategory[]> => {
    const rows = await prisma.category.findMany({
      select: { id: true, slug: true, title: true, description: true },
      orderBy: { createdAt: "asc" },
    });
    // Category.description is optional in the schema (admins can leave it
    // blank), but every storefront consumer (footer, category grid, filter
    // sidebar, /categories) already treats it as a plain string — coalesce
    // here once instead of pushing `string | null` out to every caller.
    return rows.map((c) => ({ ...c, description: c.description ?? "" }));
  },
  ["storefront-categories"],
  { revalidate: 300, tags: ["categories"] }
);

export async function getCategoryBySlug(slug: string): Promise<StorefrontCategory | null> {
  const all = await getAllCategories();
  return all.find((c) => c.slug === slug) ?? null;
}

export async function getProductCountsByCategory(): Promise<Record<string, number>> {
  const rows = await prisma.product.groupBy({
    by: ["categoryId"],
    where: { status: "PUBLISHED" },
    _count: { _all: true },
  });
  if (rows.length === 0) return {};

  const categoryRows = await prisma.category.findMany({ select: { id: true, slug: true } });
  const idToSlug = new Map<string, string>(categoryRows.map((c) => [c.id, c.slug] as const));

  const counts: Record<string, number> = {};
  for (const row of rows) {
    const slug = idToSlug.get(row.categoryId);
    if (slug) counts[slug] = row._count._all;
  }
  return counts;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const rows = await prisma.product.findMany({
    where: { id: { in: ids }, status: "PUBLISHED" },
    include: PRODUCT_LISTING_INCLUDE,
  });
  const byIdMap = new Map(rows.map((r) => [r.id, mapProduct(r)]));
  // Preserve the caller's original order (e.g. wishlist "most recent first").
  return ids.map((id) => byIdMap.get(id)).filter((p): p is Product => Boolean(p));
}

export interface AvailableColor {
  name: string;
  hex: string;
}

/**
 * Distinct colors across every published product's variants, for the shop
 * color filter. Cached like `getAllCategories` — this only changes when an
 * admin adds/edits products, not on every request.
 */
export const getAvailableColors = unstable_cache(
  async (): Promise<AvailableColor[]> => {
    const rows = await prisma.productVariant.findMany({
      where: { product: { status: "PUBLISHED" } },
      select: { color: true, colorHex: true },
      distinct: ["color"],
      orderBy: { color: "asc" },
    });
    return rows.map((r) => ({ name: r.color, hex: r.colorHex }));
  },
  ["storefront-available-colors"],
  { revalidate: 300, tags: ["products"] }
);

export interface PriceRange {
  min: number;
  max: number;
}

/** Bounds for the shop price slider — the actual lowest/highest price among
 * published products, not an arbitrary fixed ceiling. */
export const getPriceRange = unstable_cache(
  async (): Promise<PriceRange> => {
    const result = await prisma.product.aggregate({
      where: { status: "PUBLISHED" },
      _min: { price: true },
      _max: { price: true },
    });
    return { min: result._min.price ?? 0, max: result._max.price ?? 0 };
  },
  ["storefront-price-range"],
  { revalidate: 300, tags: ["products"] }
);
