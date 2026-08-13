"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export interface WishlistActionResult {
  success: boolean;
  message: string;
  requiresLogin?: boolean;
  wishlisted?: boolean;
}

export async function toggleWishlist(productId: string): Promise<WishlistActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, message: "برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید.", requiresLogin: true };
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    revalidatePath("/wishlist");
    return { success: true, message: "از علاقه‌مندی‌ها حذف شد.", wishlisted: false };
  }

  await prisma.wishlistItem.create({ data: { userId: session.user.id, productId } });
  revalidatePath("/wishlist");
  return { success: true, message: "به علاقه‌مندی‌ها اضافه شد.", wishlisted: true };
}
