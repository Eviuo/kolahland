import { AdminPageHeader } from "@/components/admin/page-header";
import { CategoryForm } from "@/components/admin/category-form";
import { CategoryDeleteButton } from "@/components/admin/category-delete-button";
import { getAdminCategoriesWithCounts } from "@/lib/data/admin-catalog";
import { toPersianDigits } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategoriesWithCounts();

  return (
    <>
      <AdminPageHeader title="دسته‌بندی‌ها" description="مدیریت دسته‌های محصولات فروشگاه" />

      <div className="mb-6">
        <CategoryForm />
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-stone">
              <th className="px-4 py-3 font-medium">نام دسته</th>
              <th className="px-4 py-3 font-medium">نامک</th>
              <th className="px-4 py-3 font-medium">توضیح</th>
              <th className="px-4 py-3 font-medium">تعداد محصول</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.slug} className="border-b border-line last:border-none">
                <td className="px-4 py-3 font-medium text-ink">{c.title}</td>
                <td className="px-4 py-3 text-stone" dir="ltr">
                  /{c.slug}
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-charcoal">{c.description}</td>
                <td className="px-4 py-3 text-charcoal">{toPersianDigits(c.productCount)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end">
                    <CategoryDeleteButton categoryId={c.id} categoryTitle={c.title} productCount={c.productCount} />
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-sm text-stone">
                  هنوز دسته‌ای ثبت نشده.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
