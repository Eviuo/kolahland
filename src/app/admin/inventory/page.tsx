import { AdminPageHeader } from "@/components/admin/page-header";
import { prisma } from "@/lib/prisma";
import { toPersianDigits } from "@/lib/utils";

export const dynamic = "force-dynamic";

const LOW_STOCK_THRESHOLD = 15;

export default async function AdminInventoryPage() {
  const variants = await prisma.productVariant.findMany({
    include: { product: { select: { name: true, sku: true } } },
    orderBy: { product: { name: "asc" } },
  });

  const rows = variants.map((v) => ({
    id: v.id,
    productName: v.product.name,
    sku: v.product.sku,
    color: v.color,
    size: v.size,
    inventory: v.inventory,
  }));

  const lowStockCount = rows.filter((r) => r.inventory < LOW_STOCK_THRESHOLD && r.inventory > 0).length;
  const outOfStockCount = rows.filter((r) => r.inventory === 0).length;

  return (
    <>
      <AdminPageHeader
        title="موجودی انبار"
        description={`${toPersianDigits(lowStockCount)} تنوع رنگ/سایز رو به اتمام، ${toPersianDigits(outOfStockCount)} ناموجود`}
      />

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-stone">
              <th className="px-4 py-3 font-medium">محصول</th>
              <th className="px-4 py-3 font-medium">رنگ</th>
              <th className="px-4 py-3 font-medium">سایز</th>
              <th className="px-4 py-3 font-medium">موجودی</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-none">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{row.productName}</p>
                  <p className="text-[11px] text-stone" dir="ltr">
                    {row.sku}
                  </p>
                </td>
                <td className="px-4 py-3 text-charcoal">{row.color}</td>
                <td className="px-4 py-3 text-charcoal">{row.size}</td>
                <td className="px-4 py-3 text-charcoal">{toPersianDigits(row.inventory)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      row.inventory === 0
                        ? "bg-red-100 text-red-700"
                        : row.inventory < LOW_STOCK_THRESHOLD
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {row.inventory === 0 ? "ناموجود" : row.inventory < LOW_STOCK_THRESHOLD ? "رو به اتمام" : "موجود"}
                  </span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-sm text-stone">
                  هنوز محصولی ثبت نشده.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
