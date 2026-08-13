import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CapIcon } from "@/components/icons/hat-icons";
import { getAllProducts } from "@/lib/data/catalog";
import { ProductCard } from "@/components/shop/product-card";

export default async function NotFound() {
  const suggestions = await getAllProducts(4);

  return (
    <div className="container py-20">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-line bg-paper">
          <CapIcon className="h-16 w-16 text-ink/70" aria-hidden />
        </div>
        <p className="mt-8 text-sm font-semibold tracking-widest text-brass">خطای ۴۰۴</p>
        <h1 className="mt-2 text-display-2 font-extrabold text-paper">این صفحه پیدا نشد</h1>
        <p className="mt-4 text-sm leading-7 text-paper/70">
          به نظر می‌رسد صفحه‌ای که دنبالش بودید جابه‌جا شده یا وجود ندارد. می‌توانید از فروشگاه ما دیدن کنید یا
          جستجو کنید.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" variant="accent">
            <Link href="/">
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              بازگشت به خانه
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline-on-dark">
            <Link href="/search">
              <Search className="h-4 w-4" strokeWidth={1.8} />
              جستجوی محصولات
            </Link>
          </Button>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-center text-sm font-bold text-paper">شاید این محصولات را دوست داشته باشید</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {suggestions.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
