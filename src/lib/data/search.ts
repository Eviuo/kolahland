import { prisma } from "@/lib/prisma";
import { mapProduct, PRODUCT_LISTING_INCLUDE } from "@/lib/data/catalog";
import type { Product } from "@/lib/data/products";

export async function searchProducts(query: string, limit?: number): Promise<Product[]> {
  const q = query.trim();
  if (!q) return [];

  const rows = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { shortDescription: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { category: { title: { contains: q, mode: "insensitive" } } },
      ],
    },
    include: PRODUCT_LISTING_INCLUDE,
    orderBy: { createdAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });

  return rows.map(mapProduct);
}
