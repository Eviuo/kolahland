"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getPaymentGateway } from "@/lib/payments";
import { placeOrderSchema } from "@/lib/validation/checkout";

type PrismaPaymentProvider = "STRIPE" | "ZARINPAL" | "IDPAY" | "COD";

const GATEWAY_TO_PROVIDER: Record<string, PrismaPaymentProvider> = {
  stripe: "STRIPE",
  zarinpal: "ZARINPAL",
  idpay: "IDPAY",
};

export interface PlaceOrderResult {
  success: boolean;
  message: string;
  orderId?: string;
  redirectUrl?: string;
}

const FLAT_SHIPPING_FEE = 45000;

export interface CouponPreviewResult {
  valid: boolean;
  message: string;
  discountAmount?: number;
}

export async function previewCoupon(code: string, subtotal: number): Promise<CouponPreviewResult> {
  const session = await auth();
  if (!session?.user) return { valid: false, message: "برای این عملیات باید وارد حساب کاربری شوید." };

  const coupon = await prisma.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });
  const now = new Date();

  if (!coupon || !coupon.isActive) return { valid: false, message: "کد تخفیف نامعتبر است." };
  if (coupon.expiresAt && coupon.expiresAt < now) return { valid: false, message: "کد تخفیف منقضی شده است." };
  if (coupon.startsAt && coupon.startsAt > now) return { valid: false, message: "این کد تخفیف هنوز فعال نشده است." };
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, message: "ظرفیت استفاده از این کد تخفیف تمام شده است." };
  }
  if (coupon.minOrderTotal && subtotal < coupon.minOrderTotal) {
    return { valid: false, message: `حداقل مبلغ سفارش برای این کد ${coupon.minOrderTotal.toLocaleString("en-US")} تومان است.` };
  }

  const discountAmount =
    coupon.discountType === "PERCENTAGE" ? Math.round((subtotal * coupon.value) / 100) : Math.min(coupon.value, subtotal);

  return { valid: true, message: "کد تخفیف اعمال شد.", discountAmount };
}

export async function placeOrder(formData: unknown): Promise<PlaceOrderResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, message: "برای ثبت سفارش ابتدا وارد حساب کاربری شوید." };
  }

  const parsed = placeOrderSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message ?? "اطلاعات سفارش معتبر نیست." };
  }
  const { addressId, items, couponCode, paymentMethod } = parsed.data;

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== session.user.id) {
    return { success: false, message: "آدرس انتخاب‌شده معتبر نیست." };
  }

  // Re-resolve every line against the database — the price and availability
  // the browser sent are never trusted for the actual charge.
  const resolvedLines: {
    productId: string;
    variantId: string;
    quantity: number;
    unitPrice: number;
    name: string;
  }[] = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { slug: item.slug } });
    if (!product) {
      return { success: false, message: `محصول «${item.slug}» دیگر در دسترس نیست.` };
    }

    const variant = await prisma.productVariant.findUnique({
      where: { productId_color_size: { productId: product.id, color: item.color, size: item.size } },
    });
    if (!variant) {
      return { success: false, message: `تنوع انتخاب‌شده برای «${product.name}» دیگر موجود نیست.` };
    }
    if (variant.inventory < item.quantity) {
      return {
        success: false,
        message: `موجودی «${product.name} — ${item.color}/${item.size}» کافی نیست (${variant.inventory} عدد باقی مانده).`,
      };
    }

    resolvedLines.push({
      productId: product.id,
      variantId: variant.id,
      quantity: item.quantity,
      unitPrice: product.price + variant.priceDelta,
      name: product.name,
    });
  }

  const subtotal = resolvedLines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

  // Coupon validation
  let discountTotal = 0;
  let appliedCouponCode: string | undefined;
  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.trim().toUpperCase() } });
    const now = new Date();

    if (!coupon || !coupon.isActive) {
      return { success: false, message: "کد تخفیف نامعتبر است." };
    }
    if (coupon.expiresAt && coupon.expiresAt < now) {
      return { success: false, message: "کد تخفیف منقضی شده است." };
    }
    if (coupon.startsAt && coupon.startsAt > now) {
      return { success: false, message: "این کد تخفیف هنوز فعال نشده است." };
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { success: false, message: "ظرفیت استفاده از این کد تخفیف تمام شده است." };
    }
    if (coupon.minOrderTotal && subtotal < coupon.minOrderTotal) {
      return { success: false, message: `حداقل مبلغ سفارش برای این کد تخفیف ${coupon.minOrderTotal.toLocaleString("en-US")} تومان است.` };
    }

    discountTotal =
      coupon.discountType === "PERCENTAGE" ? Math.round((subtotal * coupon.value) / 100) : Math.min(coupon.value, subtotal);
    appliedCouponCode = coupon.code;
  }

  const shippingTotal = FLAT_SHIPPING_FEE;
  const total = subtotal - discountTotal + shippingTotal;

  // NOTE: count-based order numbers can collide under concurrent checkouts;
  // fine at this scale, but a DB sequence would be the production-grade fix.
  const orderCount = await prisma.order.count();
  const orderNumber = `KL-${10247 + orderCount + 1}`;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        addressId,
        status: paymentMethod === "COD" ? "PROCESSING" : "PENDING_PAYMENT",
        subtotal,
        discountTotal,
        shippingTotal,
        total,
        couponCode: appliedCouponCode,
        paymentProvider: paymentMethod === "COD" ? "COD" : undefined,
        items: {
          create: resolvedLines.map((l) => ({
            productId: l.productId,
            variantId: l.variantId,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
          })),
        },
      },
    });

    for (const line of resolvedLines) {
      await tx.productVariant.update({
        where: { id: line.variantId },
        data: { inventory: { decrement: line.quantity } },
      });
    }

    if (appliedCouponCode) {
      await tx.coupon.update({ where: { code: appliedCouponCode }, data: { usedCount: { increment: 1 } } });
    }

    return created;
  });

  if (paymentMethod === "COD") {
    return {
      success: true,
      message: "سفارش شما ثبت شد. مبلغ سفارش هنگام تحویل دریافت می‌شود.",
      orderId: order.id,
      redirectUrl: `/account/orders/${order.id}?placed=1`,
    };
  }

  // Online payment — hand off to whichever gateway is configured.
  try {
    const gateway = getPaymentGateway();
    const payment = await gateway.createPayment({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: total,
      description: `پرداخت سفارش ${order.orderNumber} — کلاه‌لند`,
      customerEmail: session.user.email ?? undefined,
      callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/callback`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentProvider: GATEWAY_TO_PROVIDER[gateway.id], paymentRef: payment.providerRef },
    });

    return { success: true, message: "در حال انتقال به درگاه پرداخت...", orderId: order.id, redirectUrl: payment.redirectUrl };
  } catch (error) {
    console.error("Payment gateway error:", error);
    // The order still exists as PENDING_PAYMENT — the customer can retry
    // payment or contact support instead of losing the order entirely.
    return {
      success: false,
      message:
        "درگاه پرداخت آنلاین در حال حاضر در دسترس نیست. سفارش شما ثبت شد؛ می‌توانید بعداً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.",
      orderId: order.id,
    };
  }
}
