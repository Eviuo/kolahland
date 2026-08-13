"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/lib/store/cart-store";
import { iconByKey } from "@/components/icons/hat-icons";
import { Button } from "@/components/ui/button";
import { formatToman, toPersianDigits } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";

/**
 * All of the cart page's interactive content. Split out of `app/cart/page.tsx`
 * so that page stays a Server Component — this is the only part of the page
 * that actually needs client-side state (the persisted zustand cart store).
 */
export function CartLines() {
  const lines = useCartStore((s) => s.lines);
  const removeLine = useCartStore((s) => s.removeLine);
  const setQuantity = useCartStore((s) => s.setQuantity);

  // Avoid a hydration mismatch — persisted cart contents are only known
  // client-side after mount.
  const mounted = useMounted();

  const subtotal = mounted ? cartSubtotal(lines) : 0;

  if (!mounted) return null;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-dashed border-line bg-cream py-16 text-center">
        <p className="text-sm text-stone">سبد خرید شما خالی است.</p>
        <Link href="/shop" className="mt-3 inline-block text-sm font-semibold text-ink hover:underline">
          مشاهده فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        {lines.map((line) => {
          const Icon = iconByKey[line.icon];
          return (
            <div key={line.lineId} className="flex items-center gap-4 rounded-2xl border border-line bg-cream p-4">
              <Link href={`/product/${line.slug}`} className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-paper p-3">
                <Icon className="h-full w-full text-ink" aria-hidden />
              </Link>

              <div className="min-w-0 flex-1">
                <Link href={`/product/${line.slug}`} className="text-sm font-semibold text-ink hover:underline">
                  {line.name}
                </Link>
                <p className="mt-1 text-xs text-stone">
                  {line.color} / {line.size}
                </p>
                <p className="mt-1 text-sm font-bold text-ink">{formatToman(line.price)}</p>
              </div>

              <div className="flex items-center rounded-full border border-line">
                <button
                  onClick={() => setQuantity(line.lineId, line.quantity - 1)}
                  disabled={line.quantity <= 1}
                  className="flex h-9 w-9 items-center justify-center text-ink disabled:opacity-40"
                  aria-label="کاهش تعداد"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-7 text-center text-sm font-semibold">{toPersianDigits(line.quantity)}</span>
                <button
                  onClick={() => setQuantity(line.lineId, line.quantity + 1)}
                  disabled={line.quantity >= line.maxQuantity}
                  className="flex h-9 w-9 items-center justify-center text-ink disabled:opacity-40"
                  aria-label="افزایش تعداد"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                onClick={() => removeLine(line.lineId)}
                aria-label={`حذف ${line.name} از سبد`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-stone hover:bg-red-50 hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="h-fit rounded-2xl border border-line bg-cream p-6">
        <h2 className="mb-4 text-sm font-bold text-ink">خلاصه سفارش</h2>
        <div className="flex justify-between text-sm text-stone">
          <span>جمع جزء</span>
          <span className="font-semibold text-ink">{formatToman(subtotal)}</span>
        </div>
        <p className="mt-2 text-xs text-stone">هزینه ارسال در مرحله تسویه‌حساب محاسبه می‌شود.</p>

        <Button asChild size="lg" className="mt-6 w-full">
          <Link href="/checkout">
            ادامه به تسویه‌حساب
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </Button>
      </div>
    </div>
  );
}
