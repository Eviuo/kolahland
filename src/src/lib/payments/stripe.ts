import Stripe from "stripe";
import type { PaymentGateway, CreatePaymentInput, CreatePaymentResult, VerifyPaymentInput, VerifyPaymentResult } from "./types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", { apiVersion: "2024-06-20" });

// Stripe works in the smallest currency unit; Toman has no minor unit,
// so we pass amounts through as-is and use a zero-decimal-compatible currency.
export const stripeGateway: PaymentGateway = {
  id: "stripe",

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd", // swap for a supported currency; Toman is not natively supported by Stripe
            product_data: { name: input.description },
            unit_amount: Math.round(input.amount), // adjust conversion in production
          },
          quantity: 1,
        },
      ],
      customer_email: input.customerEmail,
      success_url: `${input.callbackUrl}?session_id={CHECKOUT_SESSION_ID}&order=${input.orderId}`,
      cancel_url: `${input.callbackUrl}?cancelled=1&order=${input.orderId}`,
      metadata: { orderId: input.orderId, orderNumber: input.orderNumber },
    });

    return { redirectUrl: session.url ?? "", providerRef: session.id };
  },

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    const session = await stripe.checkout.sessions.retrieve(input.providerRef);
    return {
      success: session.payment_status === "paid",
      amount: session.amount_total ?? 0,
      transactionId: session.payment_intent?.toString() ?? session.id,
      rawResponse: session,
    };
  },
};
