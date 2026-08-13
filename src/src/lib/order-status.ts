export type OrderStatus = "PENDING_PAYMENT" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "در انتظار پرداخت",
  PROCESSING: "در حال پردازش",
  SHIPPED: "ارسال شده",
  DELIVERED: "تحویل داده شده",
  CANCELLED: "لغو شده",
  REFUNDED: "بازپرداخت شده",
};

export const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "bg-amber-100 text-amber-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-violet-100 text-violet-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-stone-200 text-stone-700",
};
