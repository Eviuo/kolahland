"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Heart } from "lucide-react";
import { iconByKey, type HatIconKey } from "@/components/icons/hat-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatToman } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart-store";
import { toggleWishlist } from "@/lib/actions/wishlist";
import type { Product } from "@/lib/data/products";

interface ProductPurchasePanelProps {
  product: Product;
  initialWishlisted?: boolean;
}

export function ProductPurchasePanel({ product, initialWishlisted = false }: ProductPurchasePanelProps) {
  const router = useRouter();
  const addLine = useCartStore((s) => s.addLine);
  const [colorId, setColorId] = useState(product.variants[0]!.id);
  const [size, setSize] = useState(product.variants[0]!.sizes[0]!);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [wishlistPending, startWishlistTransition] = useTransition();
  const [activeImage, setActiveImage] = useState(0);

  const selectedVariant = useMemo(
    () => product.variants.find((v) => v.id === colorId) ?? product.variants[0]!,
    [colorId, product.variants]
  );

  const Icon = iconByKey[product.icon as HatIconKey];
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const outOfStock = selectedVariant.inventory === 0;
  const hasPhotos = product.images.length > 0;

  function handleAddToCart() {
    addLine(
      {
        slug: product.slug,
        color: selectedVariant.color,
        size,
        name: product.name,
        price: product.price,
        icon: product.icon as HatIconKey,
        maxQuantity: selectedVariant.inventory,
      },
      quantity
    );
    toast.success("به سبد خرید اضافه شد", {
      description: `${product.name} — ${selectedVariant.color} / ${size} × ${quantity}`,
    });
  }

  function handleWishlist() {
    startWishlistTransition(async () => {
      const result = await toggleWishlist(product.id);

      if (result.requiresLogin) {
        toast("برای افزودن به علاقه‌مندی‌ها وارد شوید");
        router.push(`/login?redirect=/product/${product.slug}`);
        return;
      }

      if (result.success) {
        setWishlisted(result.wishlisted ?? !wishlisted);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* gallery */}
      <div>
        {hasPhotos ? (
          <>
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-paper">
              <Image
                src={product.images[activeImage]!.url}
                alt={product.images[activeImage]!.altText || product.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {product.images.map((img, index) => (
                  <button
                    key={img.url}
                    onClick={() => setActiveImage(index)}
                    aria-label={`تصویر ${index + 1}`}
                    className={`relative h-16 w-16 overflow-hidden rounded-xl border transition-colors ${
                      index === activeImage ? "border-ink" : "border-line"
                    }`}
                  >
                    <Image src={img.url} alt={img.altText || product.name} fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div
              className="flex aspect-square items-center justify-center rounded-3xl border border-line p-16 transition-colors"
              style={{ backgroundColor: `${selectedVariant.colorHex}14` }}
            >
              <Icon className="h-full w-full text-ink" aria-hidden />
              <span className="sr-only">
                تصویر {product.name} رنگ {selectedVariant.color}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setColorId(v.id)}
                  aria-label={`نمایش رنگ ${v.color}`}
                  className={`flex h-16 w-16 items-center justify-center rounded-xl border p-3 transition-colors ${
                    v.id === selectedVariant.id ? "border-ink" : "border-line"
                  }`}
                  style={{ backgroundColor: `${v.colorHex}14` }}
                >
                  <Icon className="h-full w-full text-ink" aria-hidden />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* buy box */}
      <div className="rounded-3xl bg-cream p-6 lg:p-8">
        <div className="mb-3 flex gap-2">
          {product.isNew && <Badge variant="accent">جدید</Badge>}
          {product.isBestSeller && <Badge variant="default">پرفروش</Badge>}
          {onSale && <Badge variant="sale">تخفیف</Badge>}
        </div>

        {product.brand && <p className="mb-1.5 text-xs font-semibold text-stone">{product.brand}</p>}
        <h1 className="text-2xl font-extrabold text-ink lg:text-3xl">{product.name}</h1>
        <p className="mt-1.5 text-xs text-stone">
          کد محصول: <span className="font-medium text-charcoal" dir="ltr">{product.sku}</span>
        </p>
        <p className="mt-3 text-sm leading-7 text-stone">{product.shortDescription}</p>

        <div className="mt-6 flex items-baseline gap-3">
          <span className="text-2xl font-extrabold text-ink">{formatToman(product.price)}</span>
          {onSale && <span className="text-base text-stone line-through">{formatToman(product.compareAtPrice!)}</span>}
        </div>

        <div className="mt-8 space-y-6 border-t border-line pt-6">
          <div>
            <p className="mb-2.5 text-sm font-semibold text-ink">
              رنگ: <span className="font-normal text-stone">{selectedVariant.color}</span>
            </p>
            <div className="flex gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setColorId(v.id)}
                  aria-label={v.color}
                  aria-pressed={v.id === selectedVariant.id}
                  className={`h-9 w-9 rounded-full border-2 transition-transform ${
                    v.id === selectedVariant.id ? "border-ink scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: v.colorHex }}
                />
              ))}
            </div>
          </div>

          {selectedVariant.sizes.length > 1 && (
            <div>
              <p className="mb-2.5 text-sm font-semibold text-ink">سایز</p>
              <div className="flex gap-2">
                {selectedVariant.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${
                      s === size ? "border-ink bg-ink text-paper" : "border-line text-charcoal hover:border-ink"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="mb-2.5 text-sm font-semibold text-ink">تعداد</p>
            <div className="flex w-fit items-center rounded-full border border-line">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="flex h-10 w-10 items-center justify-center text-ink disabled:opacity-40"
                aria-label="کاهش تعداد"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(selectedVariant.inventory, q + 1))}
                disabled={quantity >= selectedVariant.inventory}
                className="flex h-10 w-10 items-center justify-center text-ink disabled:opacity-40"
                aria-label="افزایش تعداد"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-xs text-stone">
              {outOfStock ? "ناموجود" : `${selectedVariant.inventory} عدد در انبار`}
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={outOfStock}>
            <ShoppingBag className="h-4 w-4" strokeWidth={1.8} />
            {outOfStock ? "ناموجود" : "افزودن به سبد خرید"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleWishlist}
            disabled={wishlistPending}
            aria-pressed={wishlisted}
            aria-label={wishlisted ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
            className={wishlisted ? "border-danger text-danger hover:bg-danger hover:text-paper" : ""}
          >
            <Heart className="h-4 w-4" strokeWidth={1.8} fill={wishlisted ? "currentColor" : "none"} />
          </Button>
        </div>

        <div className="mt-8 border-t border-line pt-6 text-xs text-stone">
          <span className="font-semibold text-ink">ارسال: </span>
          ۲۴ تا ۷۲ ساعت کاری
        </div>
      </div>
    </div>
  );
}
