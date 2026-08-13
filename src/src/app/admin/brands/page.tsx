import { AdminPageHeader } from "@/components/admin/page-header";
import { BrandForm } from "@/components/admin/brand-form";
import { BrandDeleteButton } from "@/components/admin/brand-delete-button";
import { getAdminBrands } from "@/lib/data/admin-catalog";
import { toPersianDigits } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const brands = await getAdminBrands();

  return (
    <>
      <AdminPageHeader title="برندها" description="مدیریت برندهای عرضه‌شده در فروشگاه" />

      <div className="mb-6">
        <BrandForm />
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-stone">
              <th className="px-4 py-3 font-medium">نام برند</th>
              <th className="px-4 py-3 font-medium">نامک</th>
              <th className="px-4 py-3 font-medium">تعداد محصول</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id} className="border-b border-line last:border-none">
                <td className="px-4 py-3 font-medium text-ink">{b.name}</td>
                <td className="px-4 py-3 text-stone" dir="ltr">
                  /{b.slug}
                </td>
                <td className="px-4 py-3 text-charcoal">{toPersianDigits(b.productCount)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end">
                    <BrandDeleteButton brandId={b.id} brandName={b.name} productCount={b.productCount} />
                  </div>
                </td>
              </tr>
            ))}
            {brands.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-sm text-stone">
                  هنوز برندی ثبت نشده.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
