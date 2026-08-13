import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABEL, ORDER_STATUS_STYLE, type OrderStatus } from "@/lib/order-status";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", ORDER_STATUS_STYLE[status])}>
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}
