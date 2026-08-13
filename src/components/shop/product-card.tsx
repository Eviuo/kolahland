import Image from "next/image";
import Link from "next/link";
import { iconByKey, type HatIconKey } from "@/components/icons/hat-icons";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/shop/wishlist-button";
import { CompareToggleButton } from "@/components/shop/compare-toggle-button";
import { formatToman } from "@/lib/utils";
import type { Product } from "@/lib/data/products";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  initialWishlisted?: boolean;
}

export function ProductCard({ product, priority = false, initialWishlisted = false }: ProductCardProps) {
  const Icon = iconByKey[product.icon as HatIconKey];
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const image = product.images[0];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-cream transition-shadow hover:shadow-card">
      <div className="absolute inset-x-3 top-3 z-10 flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          {product.isNew && <Badge variant="accent">جدید</Badge>}
          {product.isBestSeller && <Badge variant="default">پرفروش</Badge>}
          {onSale && <Badge variant="sale">تخفیف</Badge>}
        </div>
        <div className="flex flex-col gap-1.5">
          <WishlistButton productId={product.id} productName={product.name} initialWishlisted={initialWishlisted} />
          <CompareToggleButton productId={product.id} productName={product.name} />
        </div>
      </div>

      <Link href={`/product/${product.slug}`} className="relative flex aspect-square items-center justify-center bg-paper p-10">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover p-0 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <>
            <Icon className="h-full w-full text-ink/85 transition-transform duration-300 group-hover:scale-105" aria-hidden />
            <span className="sr-only">تصویر {product.name}</span>
          </>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 border-t border-line p-4">
        <Link href={`/product/${product.slug}`} className="text-sm font-semibold text-ink hover:underline">
          {product.name}
        </Link>
        <p className="line-clamp-1 text-xs text-stone">{product.shortDescription}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm font-bold text-ink">{formatToman(product.price)}</span>
          {onSale && <span className="text-xs text-stone line-through">{formatToman(product.compareAtPrice!)}</span>}
        </div>
      </div>
    </article>
  );
}
