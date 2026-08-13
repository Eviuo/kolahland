import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllProducts } from "@/lib/data/catalog";
import { ProductCard } from "@/components/shop/product-card";

export async function FeaturedCollection() {
  const featured = await getAllProducts(5);

  if (featured.length === 0) return null;

  return (
    <section className="bg-cream py-16" aria-labelledby="featured-heading">
      <div className="container">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brass">مجموعه منتخب</p>
            <h2 id="featured-heading" className="mt-2 text-display-2 font-extrabold text-ink">
              محصولاتی که همه از آن‌ها می‌گویند
            </h2>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:underline">
            مشاهده همه کلاه‌ها
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}
