import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ProductsTable } from "@/components/admin/products-table";
import { Button } from "@/components/ui/button";
import { getAdminProducts, getAdminCategories } from "@/lib/data/admin-catalog";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getAdminProducts(), getAdminCategories()]);

  return (
    <>
      <AdminPageHeader
        title="محصولات"
        description="مدیریت کاتالوگ کلاه‌لند — افزودن، ویرایش و کنترل موجودی"
        action={
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4" />
              محصول جدید
            </Link>
          </Button>
        }
      />
      <ProductsTable products={products} categories={categories} />
    </>
  );
}
