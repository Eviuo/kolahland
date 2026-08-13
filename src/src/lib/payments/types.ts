/**
 * Payment gateway abstraction.
 *
 * Checkout code should only ever talk to `PaymentGateway`, never to a
 * specific SDK. This keeps Stripe (used for initial development/testing)
 * swappable for an Iranian gateway (ZarinPal, IDPay, etc.) with zero changes
 * to checkout/order logic — only `getPaymentGateway()` needs to change.
 */

export interface CreatePaymentInput {
  orderId: string;
  orderNumber: string;
  amount: number; // Toman
  description: string;
  customerEmail?: string;
  customerPhone?: string;
  callbackUrl: string;
}

export interface CreatePaymentResult {
  /** URL to redirect the customer to for completing payment. */
  redirectUrl: string;
  /** Provider-specific reference used later to verify the payment. */
  providerRef: string;
}

export interface VerifyPaymentInput {
  providerRef: string;
  /** Raw query params Next.js received on the callback route. */
  callbackParams: Record<string, string | string[] | undefined>;
}

export interface VerifyPaymentResult {
  success: boolean;
  amount: number;
  transactionId: string;
  rawResponse: unknown;
}

export interface PaymentGateway {
  readonly id: "stripe" | "zarinpal" | "idpay";
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult>;
}
