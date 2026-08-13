import { AdminPageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminCategories } from "@/lib/data/admin-catalog";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getAdminCategories();

  return (
    <>
      <AdminPageHeader title="محصول جدید" description="اطلاعات محصول را وارد کنید" />
      <ProductForm categories={categories} />
    </>
  );
}
