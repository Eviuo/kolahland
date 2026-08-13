"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/lib/store/cart-store";
import { iconByKey } from "@/components/icons/hat-icons";
import { AddressForm } from "@/components/account/address-form";
import { Button } from "@/components/ui/button";
import { placeOrder, previewCoupon } from "@/lib/actions/checkout";
import { formatToman } from "@/lib/utils";
import type { AddressItem } from "@/components/account/addresses-manager";
import { useMounted } from "@/hooks/use-mounted";

const FLAT_SHIPPING_FEE = 45000;

export function CheckoutClient({ addresses }: { addresses: AddressItem[] }) {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const clearCart = useCartStore((s) => s.clear);

  const mounted = useMounted();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? null
  );
  const [showAddAddress, setShowAddAddress] = useState(addresses.length === 0);
  const [couponInput, setCouponInput] = useState("");
  const [couponChecking, setCouponChecking] = useState(false);
  const [couponResult, setCouponResult] = useState<{ valid: boolean; message: string; discountAmount?: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = mounted ? cartSubtotal(lines) : 0;
  const discount = couponResult?.valid ? couponResult.discountAmount ?? 0 : 0;
  const total = Math.max(0, subtotal - discount + FLAT_SHIPPING_FEE);

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCouponChecking(true);
    const result = await previewCoupon(couponInput, subtotal);
    setCouponChecking(false);
    setCouponResult(result);
    if (!result.valid) toast.error(result.message);
  }

  const canSubmit = useMemo(() => mounted && lines.length > 0 && Boolean(selectedAddressId), [mounted, lines, selectedAddressId]);

  async function handleSubmit() {
    if (!selectedAddressId) {
      toast.error("لطفاً یک آدرس ارسال انتخاب کنید.");
      return;
    }

    setSubmitting(true);
    const result = await placeOrder({
      addressId: selectedAddressId,
      items: lines.map((l) => ({ slug: l.slug, color: l.color, size: l.size, quantity: l.quantity })),
      couponCode: couponResult?.valid ? couponInput : undefined,
      paymentMethod,
    });
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    clearCart();
    toast.success(result.message);

    if (result.redirectUrl?.startsWith("http")) {
      window.location.href = result.redirectUrl;
    } else if (result.redirectUrl) {
      router.push(result.redirectUrl);
    } else if (result.orderId) {
      router.push(`/account/orders/${result.orderId}`);
    }
  }

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
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-8">
        {/* address */}
        <section>
          <h2 className="mb-4 text-sm font-bold text-paper">آدرس ارسال</h2>
          <div className="space-y-3">
            {addresses.map((address) => (
              <label
                key={address.id}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border bg-cream p-4 transition-colors ${
                  selectedAddressId === address.id ? "border-ink" : "border-line"
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === address.id}
                  onChange={() => setSelectedAddressId(address.id)}
                  className="mt-1"
                />
                <div className="text-sm">
                  <p className="font-semibold text-ink">
                    {address.fullName} <span className="font-normal text-stone">— {address.phone}</span>
                  </p>
                  <p className="mt-1 text-stone">
                    {address.province}، {address.city}، {address.addressLine}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {showAddAddress ? (
            <div className="mt-4">
              <AddressForm
                onDone={() => {
                  setShowAddAddress(false);
                  router.refresh();
                }}
              />
            </div>
          ) : (
            <button onClick={() => setShowAddAddress(true)} className="mt-4 text-xs font-semibold text-ink hover:underline">
              + افزودن آدرس جدید
            </button>
          )}
        </section>

        {/* payment method */}
        <section>
          <h2 className="mb-4 text-sm font-bold text-paper">روش پرداخت</h2>
          <div className="space-y-3">
            <label className={`flex items-start gap-3 rounded-2xl border bg-cream p-4 ${paymentMethod === "COD" ? "border-ink" : "border-line"}`}>
              <input type="radio" name="payment" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} className="mt-1" />
              <div className="text-sm">
                <p className="font-semibold text-ink">پرداخت در محل</p>
                <p className="mt-1 text-xs text-stone">مبلغ سفارش هنگام تحویل از شما دریافت می‌شود.</p>
              </div>
            </label>
            <label className={`flex items-start gap-3 rounded-2xl border bg-cream p-4 ${paymentMethod === "ONLINE" ? "border-ink" : "border-line"}`}>
              <input type="radio" name="payment" checked={paymentMethod === "ONLINE"} onChange={() => setPaymentMethod("ONLINE")} className="mt-1" />
              <div className="text-sm">
                <p className="font-semibold text-ink">پرداخت آنلاین (زرین‌پال)</p>
                <p className="mt-1 text-xs text-stone">به درگاه پرداخت بانکی منتقل می‌شوید.</p>
              </div>
            </label>
          </div>
        </section>

        {/* items */}
        <section>
          <h2 className="mb-4 text-sm font-bold text-paper">اقلام سفارش</h2>
          <div className="space-y-3">
            {lines.map((line) => {
              const Icon = iconByKey[line.icon];
              return (
                <div key={line.lineId} className="flex items-center gap-3 rounded-xl border border-line bg-cream p-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-paper p-2">
                    <Icon className="h-full w-full text-ink" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="truncate font-medium text-ink">{line.name}</p>
                    <p className="text-xs text-stone">
                      {line.color} / {line.size} × {line.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-ink">{formatToman(line.price * line.quantity)}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* summary */}
      <div className="h-fit rounded-2xl border border-line bg-cream p-6">
        <h2 className="mb-4 text-sm font-bold text-paper">خلاصه سفارش</h2>

        <div className="mb-4 flex gap-2">
          <input
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="کد تخفیف"
            dir="ltr"
            className="flex-1 rounded-lg border border-line px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:border-ink"
          />
          <Button type="button" size="sm" variant="outline" onClick={handleApplyCoupon} disabled={couponChecking}>
            اعمال
          </Button>
        </div>
        {couponResult?.valid && (
          <p className="mb-4 flex items-center gap-1.5 text-xs text-success">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {couponResult.message}
          </p>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-stone">
            <span>جمع جزء</span>
            <span>{formatToman(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-success">
              <span>تخفیف</span>
              <span>-{formatToman(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-stone">
            <span>هزینه ارسال</span>
            <span>{formatToman(FLAT_SHIPPING_FEE)}</span>
          </div>
          <div className="flex justify-between border-t border-line pt-2 text-base font-bold text-ink">
            <span>مبلغ نهایی</span>
            <span>{formatToman(total)}</span>
          </div>
        </div>

        <Button size="lg" className="mt-6 w-full" onClick={handleSubmit} disabled={!canSubmit || submitting}>
          {submitting ? "در حال ثبت سفارش..." : "ثبت سفارش"}
        </Button>
      </div>
    </div>
  );
}
