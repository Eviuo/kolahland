import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/data/catalog";
import type { Product } from "@/lib/data/products";

export async function searchProducts(query: string): Promise<Product[]> {
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
    include: { category: true, variants: true, images: { orderBy: { position: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return rows.map(mapProduct);
}
