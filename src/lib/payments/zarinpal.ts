import type {
  PaymentGateway,
  CreatePaymentInput,
  CreatePaymentResult,
  VerifyPaymentInput,
  VerifyPaymentResult,
} from "./types";

// ZarinPal REST endpoints (v4). Use the sandbox host while MERCHANT_ID is a test id.
const ZARINPAL_BASE = process.env.ZARINPAL_SANDBOX === "true"
  ? "https://sandbox.zarinpal.com"
  : "https://payment.zarinpal.com";

const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID ?? "";

export const zarinpalGateway: PaymentGateway = {
  id: "zarinpal",

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const res = await fetch(`${ZARINPAL_BASE}/pg/v4/payment/request.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: MERCHANT_ID,
        amount: input.amount * 10, // ZarinPal expects Rial; convert Toman -> Rial
        callback_url: `${input.callbackUrl}?order=${input.orderId}`,
        description: input.description,
        metadata: { email: input.customerEmail, mobile: input.customerPhone },
      }),
    });

    const data = await res.json();

    if (data?.data?.code !== 100) {
      throw new Error(`ZarinPal payment request failed: ${JSON.stringify(data?.errors ?? data)}`);
    }

    const authority = data.data.authority as string;
    const gatewayBase = process.env.ZARINPAL_SANDBOX === "true"
      ? "https://sandbox.zarinpal.com"
      : "https://www.zarinpal.com";

    return {
      redirectUrl: `${gatewayBase}/pg/StartPay/${authority}`,
      providerRef: authority,
    };
  },

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    const amountParam = input.callbackParams.amount;
    const amount = Number(Array.isArray(amountParam) ? amountParam[0] : amountParam ?? 0);

    const res = await fetch(`${ZARINPAL_BASE}/pg/v4/payment/verify.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: MERCHANT_ID,
        amount: amount * 10, // Toman -> Rial
        authority: input.providerRef,
      }),
    });

    const data = await res.json();
    const success = data?.data?.code === 100 || data?.data?.code === 101;

    return {
      success,
      amount,
      transactionId: data?.data?.ref_id?.toString() ?? "",
      rawResponse: data,
    };
  },
};
