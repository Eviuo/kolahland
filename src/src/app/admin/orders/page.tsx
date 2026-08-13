import { AdminPageHeader } from "@/components/admin/page-header";
import { OrdersTable } from "@/components/admin/orders-table";
import { getAdminOrders } from "@/lib/data/admin-catalog";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <>
      <AdminPageHeader title="سفارش‌ها" description="مدیریت و پیگیری سفارش‌های ثبت‌شده" />
      <OrdersTable orders={orders} />
    </>
  );
}
