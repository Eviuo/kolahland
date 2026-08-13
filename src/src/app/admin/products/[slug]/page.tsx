import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { ProductDeleteButton } from "@/components/admin/product-delete-button";
import { getAdminProductBySlug, getAdminCategories } from "@/lib/data/admin-catalog";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, categories] = await Promise.all([getAdminProductBySlug(slug), getAdminCategories()]);
  if (!product) notFound();

  const totalInventory = product.variants.reduce((sum, v) => sum + v.inventory, 0);

  return (
    <>
      <AdminPageHeader title={`ویرایش: ${product.name}`} description={`کد محصول: ${product.sku}`} />
      <ProductForm
        productId={product.id}
        categories={categories}
        defaultValues={{
          name: product.name,
          slug: product.slug,
          shortDescription: product.shortDescription,
          description: product.description,
          category: product.category.slug,
          price: product.price,
          compareAtPrice: product.compareAtPrice ?? undefined,
          sku: product.sku,
          inventory: totalInventory,
          images: product.images.map((img) => ({ url: img.url, altText: img.altText })),
        }}
      />

      <div className="mt-8 rounded-2xl border border-red-200 bg-red-50/40 p-4">
        <p className="mb-3 text-sm font-medium text-red-800">
          حذف این محصول برای همیشه است و قابل بازگشت نیست.
        </p>
        <ProductDeleteButton
          productId={product.id}
          productName={product.name}
          variant="full"
          redirectTo="/admin/products"
        />
      </div>
    </>
  );
}
