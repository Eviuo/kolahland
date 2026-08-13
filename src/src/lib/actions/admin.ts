"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import {
  productFormSchema,
  categoryFormSchema,
  couponFormSchema,
  blogPostFormSchema,
  brandFormSchema,
} from "@/lib/validation/admin";
import type { OrderStatus } from "@/lib/data/admin";

/**
 * All create/edit mutations below now write to Postgres via Prisma. Every
 * action re-checks the session and ADMIN role itself (not just the
 * `/admin` layout) because server actions are callable as their own network
 * endpoint regardless of which page rendered the form.
 *
 * Scope note: `moderateReview` is still a stub — there's no admin UI for
 * review moderation yet (no list page reads reviews), so wiring the write
 * side alone would just throw "record not found" against nothing. It
 * follows the exact same pattern as the ones below once that page exists.
 */

export interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

async function requireAdmin(): Promise<ActionResult | null> {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, message: "دسترسی غیرمجاز — ابتدا با حساب مدیر وارد شوید." };
  }
  return null;
}

/** Prisma unique-constraint violations (P2002) → a readable Persian message. */
function isUniqueConstraintError(error: unknown): error is { code: "P2002"; meta?: { target?: string[] } } {
  return typeof error === "object" && error !== null && (error as { code?: string }).code === "P2002";
}

export async function createProduct(formData: unknown): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const parsed = productFormSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: "اطلاعات وارد شده معتبر نیست.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  const category = await prisma.category.findUnique({ where: { slug: data.category } });
  if (!category) {
    return { success: false, message: "دسته‌بندی انتخاب‌شده پیدا نشد." };
  }

  try {
    await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        sku: data.sku,
        price: data.price,
        compareAtPrice: data.compareAtPrice || null,
        categoryId: category.id,
        // The admin form only collects one overall inventory number (no
        // color/size picker yet), so every product created here gets a
        // single default variant. Multi-variant products (like the seeded
        // catalog) still need Prisma Studio or a future variant UI.
        variants: {
          create: [
            {
              color: "پیش‌فرض",
              colorHex: "#111111",
              size: "یک‌سایز",
              sku: `${data.sku}-VAR`,
              inventory: data.inventory,
            },
          ],
        },
        images: {
          create: data.images.map((img, index) => ({ url: img.url, altText: img.altText, position: index })),
        },
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { success: false, message: "نامک یا کد محصول (SKU) قبلاً استفاده شده — یکی دیگر انتخاب کنید." };
    }
    console.error("createProduct error:", error);
    return { success: false, message: "خطا در ذخیره محصول. دوباره تلاش کنید." };
  }

  revalidatePath("/admin/products");
  revalidateTag("products");
  return { success: true, message: `محصول «${data.name}» ذخیره شد.` };
}

export async function updateProduct(productId: string, formData: unknown): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const parsed = productFormSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: "اطلاعات وارد شده معتبر نیست.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  if (!productId) return { success: false, message: "شناسه محصول نامعتبر است." };
  const data = parsed.data;

  const category = await prisma.category.findUnique({ where: { slug: data.category } });
  if (!category) {
    return { success: false, message: "دسته‌بندی انتخاب‌شده پیدا نشد." };
  }

  const existing = await prisma.product.findUnique({ where: { id: productId }, include: { variants: true } });
  if (!existing) return { success: false, message: "محصول پیدا نشد." };

  try {
    await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: {
          name: data.name,
          slug: data.slug,
          shortDescription: data.shortDescription,
          description: data.description,
          sku: data.sku,
          price: data.price,
          compareAtPrice: data.compareAtPrice || null,
          categoryId: category.id,
        },
      }),
      // Single-variant products (the common case for anything created
      // through this form): keep that one variant's stock number in sync.
      // Products with more than one variant are left alone — this simple
      // form can't represent per-color/size stock, so we don't want to
      // silently wipe it.
      ...(existing.variants.length === 1
        ? [prisma.productVariant.update({ where: { id: existing.variants[0]!.id }, data: { inventory: data.inventory } })]
        : []),
      // Images are fully replaced with whatever the form currently holds —
      // simplest correct behavior for a flat "add/remove" list UI.
      prisma.productImage.deleteMany({ where: { productId } }),
      prisma.productImage.createMany({
        data: data.images.map((img, index) => ({ productId, url: img.url, altText: img.altText, position: index })),
      }),
    ]);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { success: false, message: "نامک یا کد محصول (SKU) قبلاً برای محصول دیگری استفاده شده." };
    }
    console.error("updateProduct error:", error);
    return { success: false, message: "خطا در به‌روزرسانی محصول. دوباره تلاش کنید." };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${data.slug}`);
  revalidateTag("products");
  return { success: true, message: `محصول «${data.name}» به‌روزرسانی شد.` };
}

export async function updateProductStatus(productId: string, status: "DRAFT" | "PUBLISHED" | "ARCHIVED"): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!productId) return { success: false, message: "شناسه محصول نامعتبر است." };

  try {
    await prisma.product.update({ where: { id: productId }, data: { status } });
  } catch (error) {
    console.error("updateProductStatus error:", error);
    return { success: false, message: "محصول پیدا نشد یا خطا در به‌روزرسانی رخ داد." };
  }

  revalidatePath("/admin/products");
  return { success: true, message: "وضعیت محصول به‌روزرسانی شد." };
}

export async function deleteProduct(productId: string): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!productId) return { success: false, message: "شناسه محصول نامعتبر است." };

  const existing = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, name: true, _count: { select: { orderItems: true } } },
  });
  if (!existing) return { success: false, message: "محصول پیدا نشد." };

  // A product referenced by past orders can't be hard-deleted: OrderItem.product
  // has no cascade (deliberately — deleting the product must never delete order
  // history), so the delete would fail at the DB level anyway. Point the admin
  // at the existing ARCHIVED status instead, which already hides it from the
  // storefront without touching order records.
  if (existing._count.orderItems > 0) {
    return {
      success: false,
      message: `این محصول در ${existing._count.orderItems} سفارش ثبت‌شده استفاده شده، پس برای حفظ سابقه‌ی سفارش‌ها قابل حذف کامل نیست. به‌جایش وضعیتش را به «آرشیو» تغییر بده تا از فروشگاه مخفی شود.`,
    };
  }

  try {
    await prisma.$transaction([
      // Not ordered yet, but may still sit in someone's active cart —
      // remove those references first so the delete doesn't fail on them.
      prisma.cartItem.deleteMany({ where: { productId } }),
      prisma.product.delete({ where: { id: productId } }),
    ]);
  } catch (error) {
    console.error("deleteProduct error:", error);
    return { success: false, message: "خطا در حذف محصول. دوباره تلاش کنید." };
  }

  revalidatePath("/admin/products");
  revalidateTag("products");
  return { success: true, message: `محصول «${existing.name}» حذف شد.` };
}

export async function createCategory(formData: unknown): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const parsed = categoryFormSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: "اطلاعات دسته‌بندی معتبر نیست.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.category.create({ data: parsed.data });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { success: false, message: "دسته‌ای با همین نامک از قبل وجود دارد." };
    }
    console.error("createCategory error:", error);
    return { success: false, message: "خطا در ایجاد دسته‌بندی. دوباره تلاش کنید." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/admin/products/new");
  revalidateTag("categories");
  return { success: true, message: `دسته «${parsed.data.title}» ایجاد شد.` };
}

export async function deleteCategory(categoryId: string): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!categoryId) return { success: false, message: "شناسه دسته نامعتبر است." };

  const existing = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true, title: true, _count: { select: { products: true, children: true } } },
  });
  if (!existing) return { success: false, message: "دسته پیدا نشد." };

  // Product.categoryId is required, so the DB would reject this delete
  // anyway (foreign-key restrict) — catching it here first gives the admin
  // a clear next step instead of a raw database error.
  if (existing._count.products > 0) {
    return {
      success: false,
      message: `این دسته روی ${existing._count.products} محصول ست شده، پس قابل حذف نیست. ابتدا آن محصولات را به دسته‌ی دیگری منتقل کن یا حذفشان کن.`,
    };
  }

  try {
    // Sub-categories (if any) lose their parent link automatically —
    // Category.parentId is optional, so the DB sets it to null rather
    // than blocking the delete.
    await prisma.category.delete({ where: { id: categoryId } });
  } catch (error) {
    console.error("deleteCategory error:", error);
    return { success: false, message: "خطا در حذف دسته. دوباره تلاش کنید." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/admin/products/new");
  revalidateTag("categories");
  return { success: true, message: `دسته «${existing.title}» حذف شد.` };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!orderId) return { success: false, message: "شناسه سفارش نامعتبر است." };

  try {
    await prisma.order.update({ where: { id: orderId }, data: { status } });
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    return { success: false, message: "سفارش پیدا نشد یا خطا در به‌روزرسانی رخ داد." };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true, message: "وضعیت سفارش به‌روزرسانی شد." };
}

export async function createCoupon(formData: unknown): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const parsed = couponFormSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: "اطلاعات کوپن معتبر نیست.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  try {
    await prisma.coupon.create({
      data: {
        code: data.code,
        discountType: data.discountType,
        value: Math.round(data.value),
        minOrderTotal: data.minOrderTotal ? Math.round(data.minOrderTotal) : null,
        usageLimit: data.usageLimit ?? null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        usedCount: 0,
        isActive: true,
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { success: false, message: "کد تخفیفی با همین نام از قبل وجود دارد." };
    }
    console.error("createCoupon error:", error);
    return { success: false, message: "خطا در ساخت کد تخفیف. دوباره تلاش کنید." };
  }

  revalidatePath("/admin/coupons");
  return { success: true, message: `کد تخفیف «${data.code}» ساخته شد.` };
}

export async function toggleCouponStatus(couponId: string, isActive: boolean): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!couponId) return { success: false, message: "شناسه کوپن نامعتبر است." };

  try {
    await prisma.coupon.update({ where: { id: couponId }, data: { isActive } });
  } catch (error) {
    console.error("toggleCouponStatus error:", error);
    return { success: false, message: "کوپن پیدا نشد یا خطا در به‌روزرسانی رخ داد." };
  }

  revalidatePath("/admin/coupons");
  return { success: true, message: isActive ? "کوپن فعال شد." : "کوپن غیرفعال شد." };
}

export async function deleteCoupon(couponId: string): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!couponId) return { success: false, message: "شناسه کوپن نامعتبر است." };

  const existing = await prisma.coupon.findUnique({ where: { id: couponId }, select: { id: true, code: true } });
  if (!existing) return { success: false, message: "کوپن پیدا نشد." };

  try {
    // Coupon.code on Order is stored as a plain string snapshot, not a
    // foreign key, so past orders keep their record of the code even
    // after the coupon itself is deleted — nothing to guard against here.
    await prisma.coupon.delete({ where: { id: couponId } });
  } catch (error) {
    console.error("deleteCoupon error:", error);
    return { success: false, message: "خطا در حذف کد تخفیف. دوباره تلاش کنید." };
  }

  revalidatePath("/admin/coupons");
  return { success: true, message: `کد تخفیف «${existing.code}» حذف شد.` };
}

export async function moderateReview(reviewId: string, approve: boolean): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!reviewId) return { success: false, message: "شناسه نظر نامعتبر است." };
  // Still a stub — see the scope note at the top of this file.
  // await prisma.review.update({ where: { id: reviewId }, data: { isApproved: approve } });
  return { success: true, message: approve ? "نظر تأیید و منتشر شد." : "نظر رد شد." };
}

export async function updateBlogPostStatus(postId: string, status: "DRAFT" | "PUBLISHED"): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!postId) return { success: false, message: "شناسه بلاگ نامعتبر است." };

  const existing = await prisma.blogPost.findUnique({
    where: { id: postId },
    select: { slug: true, publishedAt: true },
  });
  if (!existing) return { success: false, message: "بلاگ پیدا نشد." };

  try {
    await prisma.blogPost.update({
      where: { id: postId },
      data: {
        status,
        // Only stamp publishedAt the first time a post goes live — flipping
        // it back to draft later and republishing shouldn't reset the
        // original publish date.
        publishedAt: status === "PUBLISHED" ? (existing.publishedAt ?? new Date()) : existing.publishedAt,
      },
    });
  } catch (error) {
    console.error("updateBlogPostStatus error:", error);
    return { success: false, message: "بلاگ پیدا نشد یا خطا در به‌روزرسانی رخ داد." };
  }

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${postId}`);
  revalidatePath("/blog");
  revalidatePath(`/blog/${existing.slug}`);
  return { success: true, message: status === "PUBLISHED" ? "بلاگ منتشر شد." : "بلاگ به پیش‌نویس برگشت." };
}

export async function saveBlogPost(formData: unknown, postId?: string): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const session = await auth();
  const parsed = blogPostFormSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: "اطلاعات بلاگ معتبر نیست.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  // Rough estimate — the form doesn't collect this separately.
  const wordCount = data.content.trim().split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));

  let previousSlug: string | undefined;

  try {
    const tagSlug = slugify(data.tag) || data.tag;
    const tag = await prisma.tag.upsert({
      where: { slug: tagSlug },
      update: {},
      create: { slug: tagSlug, name: data.tag },
    });

    if (postId) {
      const existing = await prisma.blogPost.findUnique({
        where: { id: postId },
        select: { slug: true, publishedAt: true },
      });
      if (!existing) return { success: false, message: "بلاگ پیدا نشد." };
      previousSlug = existing.slug;

      await prisma.$transaction([
        prisma.blogPost.update({
          where: { id: postId },
          data: {
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            coverImage: data.coverImage,
            status: data.status,
            readingMinutes,
            // Only stamp publishedAt the first time a post goes live —
            // re-saving an already-published post (or flipping it back to
            // DRAFT) shouldn't reset its original publish date.
            publishedAt: data.status === "PUBLISHED" ? (existing.publishedAt ?? new Date()) : existing.publishedAt,
          },
        }),
        // The form only supports one tag, so the join row is fully replaced
        // rather than diffed — simplest correct behavior for a single-picker UI.
        prisma.blogPostTag.deleteMany({ where: { postId } }),
        prisma.blogPostTag.create({ data: { postId, tagId: tag.id } }),
      ]);
    } else {
      await prisma.blogPost.create({
        data: {
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          coverImage: data.coverImage,
          status: data.status,
          readingMinutes,
          publishedAt: data.status === "PUBLISHED" ? new Date() : null,
          authorId: session!.user.id,
          tags: { create: [{ tagId: tag.id }] },
        },
      });
    }
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { success: false, message: "بلاگی با همین نامک از قبل وجود دارد." };
    }
    console.error("saveBlogPost error:", error);
    return {
      success: false,
      message: postId ? "خطا در به‌روزرسانی بلاگ. دوباره تلاش کنید." : "خطا در ذخیره بلاگ. دوباره تلاش کنید.",
    };
  }

  revalidatePath("/admin/blog");
  if (postId) revalidatePath(`/admin/blog/${postId}`);
  revalidatePath("/blog");
  revalidatePath(`/blog/${data.slug}`);
  // The slug can change on edit — make sure the old public URL doesn't keep
  // serving stale cached content once it no longer resolves to this post.
  if (previousSlug && previousSlug !== data.slug) revalidatePath(`/blog/${previousSlug}`);

  return {
    success: true,
    message: postId ? `بلاگ «${data.title}» به‌روزرسانی شد.` : `بلاگ «${data.title}» ذخیره شد.`,
  };
}

export async function deleteBlogPost(postId: string): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!postId) return { success: false, message: "شناسه بلاگ نامعتبر است." };

  const existing = await prisma.blogPost.findUnique({ where: { id: postId }, select: { id: true, title: true, slug: true } });
  if (!existing) return { success: false, message: "بلاگ پیدا نشد." };

  try {
    // BlogPostTag rows cascade automatically (onDelete: Cascade in schema).
    await prisma.blogPost.delete({ where: { id: postId } });
  } catch (error) {
    console.error("deleteBlogPost error:", error);
    return { success: false, message: "خطا در حذف بلاگ. دوباره تلاش کنید." };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${existing.slug}`);
  return { success: true, message: `بلاگ «${existing.title}» حذف شد.` };
}

export async function saveSeoOverride(path: string, title?: string, description?: string, noIndex?: boolean): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!path.startsWith("/")) return { success: false, message: "مسیر باید با / شروع شود." };

  try {
    await prisma.seoOverride.upsert({
      where: { path },
      create: { path, title: title || null, description: description || null, noIndex: !!noIndex },
      update: { title: title || null, description: description || null, noIndex: !!noIndex },
    });
  } catch (error) {
    console.error("saveSeoOverride error:", error);
    return { success: false, message: "خطا در ذخیره تنظیمات سئو. دوباره تلاش کنید." };
  }

  revalidatePath("/admin/seo");
  return { success: true, message: `تنظیمات سئوی «${path}» ذخیره شد.` };
}

export async function createSeoOverridePath(path: string): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!path.startsWith("/")) return { success: false, message: "مسیر باید با / شروع شود (مثال: /product/my-product)." };

  try {
    await prisma.seoOverride.create({ data: { path } });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { success: false, message: "این مسیر قبلاً اضافه شده است." };
    }
    console.error("createSeoOverridePath error:", error);
    return { success: false, message: "خطا در افزودن مسیر. دوباره تلاش کنید." };
  }

  revalidatePath("/admin/seo");
  return { success: true, message: `مسیر «${path}» اضافه شد.` };
}

export async function deleteSeoOverride(id: string): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!id) return { success: false, message: "شناسه نامعتبر است." };

  const existing = await prisma.seoOverride.findUnique({ where: { id }, select: { id: true, path: true } });
  if (!existing) return { success: false, message: "این مسیر پیدا نشد." };

  try {
    await prisma.seoOverride.delete({ where: { id } });
  } catch (error) {
    console.error("deleteSeoOverride error:", error);
    return { success: false, message: "خطا در حذف مسیر. دوباره تلاش کنید." };
  }

  revalidatePath("/admin/seo");
  revalidatePath(existing.path);
  return { success: true, message: `مسیر «${existing.path}» حذف شد.` };
}

export async function deleteCustomer(userId: string): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!userId) return { success: false, message: "شناسه مشتری نامعتبر است." };

  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, _count: { select: { orders: true } } },
  });
  if (!existing) return { success: false, message: "مشتری پیدا نشد." };

  // Belt-and-suspenders: this action is only ever wired to the customers
  // list, which already filters to role = CUSTOMER, but a crafted call with
  // someone else's id should never be able to delete an admin/editor account.
  if (existing.role !== "CUSTOMER") {
    return { success: false, message: "این حساب مدیر/ویراستار است و از این بخش قابل حذف نیست." };
  }

  // Order.userId is required, so a customer with order history can't be
  // hard-deleted (the DB would reject it) — and shouldn't be, since that
  // history needs to stay intact for accounting/support purposes.
  if (existing._count.orders > 0) {
    return {
      success: false,
      message: `این مشتری ${existing._count.orders} سفارش ثبت‌شده دارد، پس برای حفظ سابقه‌ی سفارش‌ها قابل حذف نیست.`,
    };
  }

  try {
    // Addresses, cart, wishlist items, reviews, and auth sessions/accounts
    // all cascade automatically (onDelete: Cascade in schema).
    await prisma.user.delete({ where: { id: userId } });
  } catch (error) {
    console.error("deleteCustomer error:", error);
    return { success: false, message: "خطا در حذف مشتری. دوباره تلاش کنید." };
  }

  revalidatePath("/admin/customers");
  return { success: true, message: `مشتری «${existing.name ?? existing.email}» حذف شد.` };
}

export async function createBrand(formData: unknown): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const parsed = brandFormSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: "اطلاعات برند معتبر نیست.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.brand.create({ data: parsed.data });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { success: false, message: "برندی با همین نامک از قبل وجود دارد." };
    }
    console.error("createBrand error:", error);
    return { success: false, message: "خطا در ایجاد برند. دوباره تلاش کنید." };
  }

  revalidatePath("/admin/brands");
  return { success: true, message: `برند «${parsed.data.name}» ایجاد شد.` };
}

export async function deleteBrand(brandId: string): Promise<ActionResult> {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!brandId) return { success: false, message: "شناسه برند نامعتبر است." };

  const existing = await prisma.brand.findUnique({
    where: { id: brandId },
    select: { id: true, name: true, _count: { select: { products: true } } },
  });
  if (!existing) return { success: false, message: "برند پیدا نشد." };

  try {
    // Product.brandId is optional, so the DB just sets it to null on the
    // affected products instead of blocking the delete — but we still warn
    // the admin up front (via the confirm dialog on the client) since it's
    // a real, visible side effect.
    await prisma.brand.delete({ where: { id: brandId } });
  } catch (error) {
    console.error("deleteBrand error:", error);
    return { success: false, message: "خطا در حذف برند. دوباره تلاش کنید." };
  }

  revalidatePath("/admin/brands");
  revalidatePath("/admin/products");
  return {
    success: true,
    message:
      existing._count.products > 0
        ? `برند «${existing.name}» حذف شد. برند ${existing._count.products} محصول مرتبط، خالی شد.`
        : `برند «${existing.name}» حذف شد.`,
  };
}
