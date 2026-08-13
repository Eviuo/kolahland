export type ProductCategorySlug = string;

export interface ProductVariant {
  id: string;
  color: string;
  colorHex: string;
  sizes: string[];
  inventory: number;
}

export interface ProductImage {
  url: string;
  altText: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: ProductCategorySlug;
  price: number;
  compareAtPrice?: number;
  sku: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  variants: ProductVariant[];
  images: ProductImage[];
  icon: "cap" | "bucket" | "beanie" | "fedora" | "visor" | "winter";
  brand?: string;
}

export type HatIcon = "cap" | "bucket" | "beanie" | "fedora" | "visor" | "winter";

export const categories: { slug: ProductCategorySlug; title: string; description: string; icon: HatIcon }[] = [
  { slug: "baseball-caps", title: "کلاه بیسبالی", description: "کلاه‌های اسپرت و روزمره با طراحی کلاسیک آمریکایی", icon: "cap" },
  { slug: "bucket-hats", title: "کلاه باکت", description: "کلاه‌های باکت پارچه‌ای، انتخاب اول استایل خیابانی", icon: "bucket" },
  { slug: "beanies", title: "کلاه بافت", description: "کلاه‌های بافتنی گرم برای پاییز و زمستان", icon: "beanie" },
  { slug: "winter-hats", title: "کلاه زمستانی", description: "کلاه‌های ضخیم و گرم مخصوص هوای سرد", icon: "winter" },
  { slug: "fashion-hats", title: "کلاه‌های مد روز", description: "طرح‌های خاص و ترند برای متمایز شدن", icon: "visor" },
  { slug: "mens-hats", title: "کلاه مردانه", description: "مجموعه کامل کلاه‌های مردانه", icon: "fedora" },
  { slug: "womens-hats", title: "کلاه زنانه", description: "مجموعه کامل کلاه‌های زنانه", icon: "fedora" },
];

export const products: Product[] = [];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: ProductCategorySlug): Product[] {
  return products.filter((p) => p.category === category);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
}
