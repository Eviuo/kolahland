import { AdminPageHeader } from "@/components/admin/page-header";
import { SeoOverrideForm } from "@/components/admin/seo-override-form";
import { SeoAddPathForm } from "@/components/admin/seo-add-path-form";
import { getAdminSeoOverrides } from "@/lib/data/admin-catalog";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  const rows = await getAdminSeoOverrides();

  return (
    <>
      <AdminPageHeader
        title="سئو"
        description="بازنویسی عنوان، توضیح متا و نمایه‌سازی هر مسیر — این مقادیر بر پیش‌فرض‌های خودکار سایت اولویت دارند"
      />
      <div className="mb-4">
        <SeoAddPathForm />
      </div>
      <div className="space-y-4">
        {rows.map((row) => (
          <SeoOverrideForm
            key={row.id}
            row={{
              id: row.id,
              path: row.path,
              title: row.title ?? undefined,
              description: row.description ?? undefined,
              noIndex: row.noIndex,
            }}
          />
        ))}
        {rows.length === 0 && <p className="p-6 text-center text-sm text-stone">هنوز مسیری اضافه نشده.</p>}
      </div>
    </>
  );
}
