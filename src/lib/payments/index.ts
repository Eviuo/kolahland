import type { PaymentGateway } from "./types";
import { stripeGateway } from "./stripe";
import { zarinpalGateway } from "./zarinpal";

/**
 * Checkout and webhook/callback routes should call this instead of importing
 * a gateway directly. Switching the entire store from Stripe to ZarinPal is
 * a one-line env var change: PAYMENT_PROVIDER=zarinpal
 */
export function getPaymentGateway(): PaymentGateway {
  const provider = process.env.PAYMENT_PROVIDER ?? "zarinpal";

  switch (provider) {
    case "stripe":
      return stripeGateway;
    case "zarinpal":
      return zarinpalGateway;
    default:
      throw new Error(`Unknown PAYMENT_PROVIDER: ${provider}`);
  }
}

export type { PaymentGateway } from "./types";
