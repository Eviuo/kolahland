import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentGateway } from "@/lib/payments";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("order");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;

  if (!orderId) {
    return NextResponse.redirect(`${siteUrl}/`);
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.redirect(`${siteUrl}/`);
  }

  // ZarinPal's convention: Status=OK means the user completed the bank step;
  // anything else (e.g. NOK) means they cancelled before paying.
  //
  // Scoping this (and the transitions below) to `status: "PENDING_PAYMENT"`
  // makes it a no-op against an order that's already been resolved — this
  // endpoint is an unauthenticated GET by necessity (the payment gateway
  // redirects the browser here), so anyone who learns an order id could
  // otherwise replay/craft a request to flip an already-paid or
  // already-cancelled order's status with nothing but a URL.
  const status = searchParams.get("Status");
  if (status && status !== "OK") {
    await prisma.order.updateMany({
      where: { id: orderId, status: "PENDING_PAYMENT" },
      data: { status: "CANCELLED" },
    });
    return NextResponse.redirect(`${siteUrl}/account/orders/${orderId}?payment=failed`);
  }

  if (order.status !== "PENDING_PAYMENT") {
    // Already resolved by an earlier callback — just send them to the order,
    // which reflects the real (already-decided) outcome.
    return NextResponse.redirect(`${siteUrl}/account/orders/${orderId}`);
  }

  try {
    const gateway = getPaymentGateway();
    const authority = searchParams.get("Authority");
    const callbackParams = Object.fromEntries(searchParams.entries());

    const verification = await gateway.verifyPayment({
      providerRef: authority ?? order.paymentRef ?? "",
      callbackParams,
    });

    if (verification.success) {
      await prisma.order.updateMany({
        where: { id: orderId, status: "PENDING_PAYMENT" },
        data: { status: "PROCESSING", paidAt: new Date(), paymentRef: verification.transactionId },
      });
      return NextResponse.redirect(`${siteUrl}/account/orders/${orderId}?payment=success`);
    }

    await prisma.order.updateMany({
      where: { id: orderId, status: "PENDING_PAYMENT" },
      data: { status: "CANCELLED" },
    });
    return NextResponse.redirect(`${siteUrl}/account/orders/${orderId}?payment=failed`);
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.redirect(`${siteUrl}/account/orders/${orderId}?payment=error`);
  }
}
