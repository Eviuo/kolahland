import type { HatIconKey } from "@/components/icons/hat-icons";

/**
 * The line-icon system is purely presentational — Prisma's Category model
 * has no `icon` column. This maps the known launch categories to their icon
 * and falls back to a generic one for anything created later through the
 * admin panel, so a brand-new category never breaks rendering.
 */
const CATEGORY_ICON: Record<string, HatIconKey> = {
  "baseball-caps": "cap",
  "bucket-hats": "bucket",
  beanies: "beanie",
  "winter-hats": "winter",
  "fashion-hats": "visor",
  "mens-hats": "fedora",
  "womens-hats": "fedora",
};

export function iconForCategory(slug: string): HatIconKey {
  return CATEGORY_ICON[slug] ?? "cap";
}
